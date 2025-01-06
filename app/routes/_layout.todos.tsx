import { getAuth } from "@clerk/tanstack-start/server";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { formatISO } from "date-fns";
import { useEffect } from "react";
import { getWebRequest } from "vinxi/http";
import { getNotesListItemsByDate } from "~/models/note.server";
import useNotesStore from "~/store/notes.store";

const notesFn = createServerFn({ method: "GET" })
  .validator((data: string | undefined) => {
    return data;
  })
  .handler(async ({ data }: { data?: string }) => {
    const { userId } = await getAuth(getWebRequest());

    if (!userId) {
      throw redirect({
        to: "/sign-in/$",
      });
    }

    let date: string | undefined = data;
    if (date === undefined) {
      date = formatISO(new Date(), { representation: "date" }); // 'YYYY-MM-DD'
    }

    const noteListItems = await getNotesListItemsByDate({
      userId,
      date,
    });

    return { noteListItems, selectedDate: date };
  });

export const Route = createFileRoute("/_layout/todos")({
  component: NotesPage,
  loaderDeps: ({ search }: { search: { date?: string } }) => ({
    date: search.date,
  }),
  loader: async ({ deps: { date } }) => notesFn({ data: date }),
});

export default function NotesPage() {
  const data = Route.useLoaderData();
  const { setNoteListItems, setSelectedDate, setIsReady } = useNotesStore();

  useEffect(() => {
    setNoteListItems(data.noteListItems);
    setSelectedDate(data.selectedDate);
    setIsReady(true);
  }, [
    data.noteListItems,
    data.selectedDate,
    setNoteListItems,
    setSelectedDate,
    setIsReady,
  ]);

  return (
    <div className="container">
      <div>{data.selectedDate}</div>
      <div>TODOs will be here</div>
    </div>
  );
}
