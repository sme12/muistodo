import { getAuth } from "@clerk/tanstack-start/server";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { getWebRequest } from "vinxi/http";
import { createNote } from "~/models/note.server";

export const postNewNote = createServerFn({ method: "POST" })
  .validator((data: { noteBody: string; date: string }) => {
    return data;
  })
  .handler(async ({ data }) => {
    const { userId } = await getAuth(getWebRequest());

    if (!userId) {
      throw redirect({
        to: "/sign-in/$",
      });
    }

    const note = await createNote({
      body: data.noteBody,
      date: data.date,
      userId,
    });

    return note;
  });
