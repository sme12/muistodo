import { getAuth } from "@clerk/remix/ssr.server";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { updateNote } from "~/models/note.server";

export const action = async (args: ActionFunctionArgs) => {
  const { userId } = await getAuth(args);

  if (!userId) {
    return redirect("/sign-in?redirect_url=" + args.request.url);
  }

  const formData = await args.request.formData();
  const id = formData.get("noteId");
  const body = formData.get("body");

  if (typeof id !== "string" || id.length === 0) {
    return json({ errors: { noteId: "Note ID is required" } }, { status: 400 });
  }

  if (typeof body !== "string" || body.length === 0) {
    return json({ errors: { body: "Body is required" } }, { status: 400 });
  }

  const note = await updateNote({ id, body, userId });
  return json({ note });
};
