import { UserButton } from "@clerk/remix";
import { getAuth } from "@clerk/remix/ssr.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { formatISO, parseISO } from "date-fns";
import NewNote from "~/components/new-note";
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

  // Use useSearchParams to manage query parameters
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize selectedDate from loader or default to today
  const initialDate = searchParams.get("date") || data.selectedDate;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (newDate) {
      setSearchParams({ date: newDate });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="flex flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Notes</Link>
        </h1>
        <p>You are signed in!</p>
        <UserButton />
      </header>

      <main className="flex h-full bg-white">
        <div className="mx-auto flex h-full w-96 flex-col gap-5 border bg-gray-50">
          <div className="flex items-center gap-4 p-4">
            <label htmlFor="date" className="sr-only font-medium">
              Select Date:
            </label>
            <input
              id="date"
              type="date"
              value={initialDate}
              onChange={handleDateChange}
              className="rounded border px-4 py-2"
            />
          </div>
          <div>
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
              <ol>
                {data.noteListItems.map((note) => (
                  <li
                    key={note.id}
                    className="flex items-center justify-between gap-2 border-b p-4"
                  >
                    <div>{note.body}</div>
                    <Form action={`api/delete/${note.id}`} method="post">
                      <button type="submit" className="text-sm">
                        ❌
                      </button>
                    </Form>
                  </li>
                ))}
              </ol>
            )}
          </div>
          <NewNote />
        </div>
      </main>
    </div>
  );
}
