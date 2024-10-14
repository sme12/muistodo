import { getAuth } from "@clerk/remix/ssr.server";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { createNote } from "~/models/note.server";

export const action = async (args: ActionFunctionArgs) => {
  const { userId } = await getAuth(args);

  if (!userId) {
    return redirect("/sign-in?redirect_url=" + args.request.url);
  }

  const formData = await args.request.formData();
  const body = formData.get("body");
  const date = formData.get("date");

  if (typeof body !== "string" || body.length === 0) {
    return json({ errors: { body: "Body is required" } }, { status: 400 });
  }

  if (typeof date !== "string" || date.length === 0) {
    return json({ errors: { date: "Date is required" } }, { status: 400 });
  }

  const note = await createNote({ body, date, userId });
  return json({ note });
};
