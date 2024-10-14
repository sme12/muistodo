import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";
import useNotesStore from "~/store/notes.store";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export default function NoteCard() {
  const { activeNote, noteModalOpen, setNoteModalOpen } = useNotesStore();
  const fetcher = useFetcher();
  const [isEditing, setIsEditing] = useState(false);
  const [body, setBody] = useState("");

  useEffect(() => {
    if (fetcher.state === "idle") {
      setNoteModalOpen(false);
    }
  }, [fetcher.state, setNoteModalOpen]);

  useEffect(() => {
    if (!noteModalOpen) {
      setIsEditing(false);
    }
  }, [noteModalOpen]);

  if (!activeNote) return null;
  return (
    <Drawer open={noteModalOpen} onOpenChange={setNoteModalOpen}>
      <DrawerContent>
        <DrawerHeader className="sr-only">
          <DrawerTitle>Note Details</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div className="whitespace-pre py-6 max-w-96 mx-auto w-full">
          {isEditing ? (
            <Textarea
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              name="body"
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full bg-transparent border-0"
            />
          ) : (
            <ReactMarkdown>{activeNote.body ?? ""}</ReactMarkdown>
          )}
        </div>
        <DrawerFooter>
          <div className="flex gap-4 justify-center">
            {!isEditing ? (
              <Button
                onClick={() => {
                  setBody(activeNote.body);
                  setIsEditing(!isEditing);
                }}
              >
                Edit
              </Button>
            ) : (
              <fetcher.Form action={"api/update"} method="post">
                <input type="hidden" name="noteId" value={activeNote.id} />
                <input type="hidden" name="body" value={body} />
                <Button type="submit">Save</Button>
              </fetcher.Form>
            )}

            <fetcher.Form action={`api/delete/${activeNote.id}`} method="post">
              <Button type="submit" variant="destructive">
                Delete
              </Button>
            </fetcher.Form>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
