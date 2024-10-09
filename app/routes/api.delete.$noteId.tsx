import { getAuth } from "@clerk/remix/ssr.server";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { deleteNote } from "~/models/note.server";

export const action = async (args: ActionFunctionArgs) => {
  const { userId } = await getAuth(args);

  if (!userId) {
    return redirect("/sign-in?redirect_url=" + args.request.url);
  }
  invariant(args.params.noteId, "noteId not found");

  await deleteNote({ id: args.params.noteId, userId });
  return redirect("/");
};
