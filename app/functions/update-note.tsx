import { getAuth } from "@clerk/tanstack-start/server";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { getWebRequest } from "vinxi/http";
import { updateNote as updateNotePrisma } from "~/models/note.server";

export const updateNote = createServerFn({ method: "POST" })
  .validator((data: { body: string; noteId: string }) => {
    return data;
  })
  .handler(async ({ data }) => {
    const { userId } = await getAuth(getWebRequest());

    if (!userId) {
      throw redirect({
        to: "/sign-in/$",
      });
    }

    const note = await updateNotePrisma({
      id: data.noteId,
      body: data.body,
      userId,
    });

    return note;
  });
