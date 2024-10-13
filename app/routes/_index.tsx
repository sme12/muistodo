import { UserButton } from "@clerk/remix";
import { getAuth } from "@clerk/remix/ssr.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { formatISO, parseISO } from "date-fns";
import { useEffect } from "react";
import NotesFeed from "~/components/notes-feed";
import { getNotesListItemsByDate } from "~/models/note.server";
import useNotesStore from "~/store/notes.store";

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    return redirect("/sign-in");
  }

  const url = new URL(args.request.url);
  const dateParam = url.searchParams.get("date");

  // Validate and parse the date
  let dateInput;
  if (dateParam) {
    const parsedDate = parseISO(dateParam);
    if (isNaN(parsedDate.getTime())) {
      // Invalid date format, default to today or handle as needed
      dateInput = new Date();
    } else {
      dateInput = parsedDate;
    }
  } else {
    dateInput = new Date();
  }

  const date = formatISO(dateInput, { representation: "date" }); // 'YYYY-MM-DD'

  const noteListItems = await getNotesListItemsByDate({
    userId,
    date,
  });

  return json({ noteListItems, selectedDate: date });
};

export default function NotesPage() {
  const data = useLoaderData<typeof loader>();
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
    <div className="flex flex-col">
      <header className="flex items-center justify-between p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">MuisTODO</Link>
        </h1>
        <UserButton />
      </header>

      <main>
        <NotesFeed />
      </main>
    </div>
  );
}
