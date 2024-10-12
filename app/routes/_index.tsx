import { UserButton } from "@clerk/remix";
import { getAuth } from "@clerk/remix/ssr.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { formatISO, parseISO } from "date-fns";
import DatePicker from "~/components/date-picker";
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
  const [searchParams] = useSearchParams();
  const initialDate = searchParams.get("date") || data.selectedDate;

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
