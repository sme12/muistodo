import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { formatISO } from "date-fns";

import NewNote from "~/components/new-note";
import { getNotesListItemsByDate } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const dateValue = ""; // TODO: get from selector
  const dateInput = dateValue ? new Date(dateValue) : new Date();
  const date = formatISO(dateInput, { representation: "date" }); // 'YYYY-MM-DD'
  const noteListItems = await getNotesListItemsByDate({
    userId,
    date,
  });
  return json({ noteListItems });
};

export default function NotesPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <div className="flex flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Notes</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="mx-auto flex h-full w-96 flex-col gap-5 border bg-gray-50">
          <div>
            {data.noteListItems.length === 0 ? (
              <p className="p-4">No notes yet</p>
            ) : (
              <ol>
                {data.noteListItems.map((note) => (
                  <li
                    key={note.id}
                    className="flex items-center justify-between gap-2 border-b p-4 text-xl"
                  >
                    <div>📝 {note.body}</div>
                    {note.date ? <div>{note.date}</div> : null}
                    <Form action={`api/delete/${note.id}`} method="post">
                      <button
                        type="submit"
                        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
                      >
                        X
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
