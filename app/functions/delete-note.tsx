import { getAuth } from "@clerk/tanstack-start/server";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { getWebRequest } from "vinxi/http";
import { deleteNote as deleteNotePrisma } from "~/models/note.server";

export const deleteNote = createServerFn({ method: "POST" })
  .validator((data: { noteId: string }) => {
    return data;
  })
  .handler(async ({ data }) => {
    const { userId } = await getAuth(getWebRequest());

    if (!userId) {
      throw redirect({
        to: "/sign-in/$",
      });
    }

    await deleteNotePrisma({ id: data.noteId, userId });
  });
