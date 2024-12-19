import { useRouter } from "@tanstack/react-router";
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
import { deleteNote } from "~/functions/delete-note";
import { updateNote } from "~/functions/update-note";
import useNotesStore from "~/store/notes.store";

import { Button } from "./ui/button";
import { AutosizeTextarea } from "./ui/textarea";

export default function NoteCard() {
  const { activeNote, noteModalOpen, setNoteModalOpen } = useNotesStore();
  const [isEditing, setIsEditing] = useState(false);
  const [body, setBody] = useState("");
  const router = useRouter();

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
            <AutosizeTextarea
              autoFocus
              name="body"
              value={body}
              maxHeight={200}
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
              <Button
                onClick={() => {
                  const data = {
                    noteId: activeNote.id,
                    body,
                  };
                  updateNote({
                    data,
                  });
                  setNoteModalOpen(false);
                  router.invalidate();
                }}
              >
                Save
              </Button>
            )}

            <Button
              variant="destructive"
              onClick={() => {
                const data = {
                  noteId: activeNote.id,
                };
                deleteNote({
                  data,
                });
                setNoteModalOpen(false);
                router.invalidate();
              }}
            >
              Delete
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
