import { Form } from "@remix-run/react";
import { X } from "lucide-react";

interface NoteCardProps {
  body?: string;
  id?: string;
}

export default function NoteCard({ body, id }: NoteCardProps) {
  return (
    <div className="border-b p-4 bg-accent rounded-md">
      <div className="flex items-start justify-between gap-2">
        <div className="whitespace-pre">{body}</div>
        <Form action={`api/delete/${id}`} method="post">
          <button type="submit" className="text-sm">
            <X className="h-4 w-4" />
          </button>
        </Form>
      </div>
    </div>
  );
}
