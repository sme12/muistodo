import { UserButton } from "@clerk/remix";
import { getAuth } from "@clerk/remix/ssr.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { formatISO, parseISO } from "date-fns";
import { Plus } from "lucide-react";
import { useState } from "react";
import DatePicker from "~/components/date-picker";
import Note from "~/components/note";
import { Button } from "~/components/ui/button";
import { getNotesListItemsByDate } from "~/models/note.server";

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
  const [searchParams] = useSearchParams();
  const initialDate = searchParams.get("date") || data.selectedDate;
  const [isNewNoteActive, setIsNewNoteActive] = useState(false);

  return (
    <div className="flex flex-col">
      <header className="flex items-center justify-between p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">MuisTODO</Link>
        </h1>
        <UserButton />
      </header>

      <main>
        <div className="mx-auto flex h-full w-96 flex-col gap-5 border p-5 rounded-md">
          <DatePicker initialDate={initialDate} />
          <div className="flex flex-col gap-2">
            {data.noteListItems.length === 0 ? (
              initialDate ===
              formatISO(new Date(), { representation: "date" }) ? (
                <p className="p-4">
                  No notes for today. Have you learned something new or want to
                  add a TODO? Go on!
                </p>
              ) : (
                <p className="p-4">No notes were made on {initialDate}</p>
              )
            ) : (
              <>
                {data.noteListItems.map((note) => (
                  <Note {...note} key={note.id} />
                ))}
              </>
            )}
            {isNewNoteActive ? (
              <Note isNewNote setIsNewNoteActive={setIsNewNoteActive} />
            ) : (
              <Button onClick={() => setIsNewNoteActive(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add new note
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
