import { Form } from "@remix-run/react";
import { X } from "lucide-react";

import NewNote from "./new-note";

const StaticNote = ({ body, id }: { body: string; id: string }) => (
  <div className="flex items-start justify-between gap-2">
    <div className="whitespace-pre">{body}</div>
    <Form action={`api/delete/${id}`} method="post">
      <button type="submit" className="text-sm">
        <X className="h-4 w-4" />
      </button>
    </Form>
  </div>
);

interface NoteProps {
  body?: string;
  id?: string;
  isNewNote?: boolean;
  setIsNewNoteActive?: (active: boolean) => void;
}

export default function Note({
  body,
  id,
  isNewNote,
  setIsNewNoteActive,
}: NoteProps) {
  return (
    <div className="border-b p-4 bg-accent rounded-md">
      {isNewNote && setIsNewNoteActive ? (
        <NewNote setIsNewNoteActive={setIsNewNoteActive} />
      ) : (
        body && id && <StaticNote body={body} id={id} />
      )}
    </div>
  );
}
