import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { seed } from "prisma/seed";

export const action: ActionFunction = async ({ request }) => {
  try {
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, { status: 405 });
    }

    // Verify the API key
    const apiKey = request.headers.get("x-api-key") || "";
    if (apiKey !== process.env.SESSION_SECRET) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    await seed();

    return json({ message: "Database seeded successfully." }, { status: 200 });
  } catch (error: unknown) {
    console.error("Seeding error:", error);
    return json(
      { error: (error as Error)?.message ?? "Failed to seed database." },
      { status: 500 },
    );
  }
};
