import { useRouter } from "@tanstack/react-router";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { postNewNote } from "~/functions/create-new-note";
import useNotesStore from "~/store/notes.store";

import { Button } from "./ui/button";
import { AutosizeTextarea } from "./ui/textarea";

export default function NewNote() {
  const { setIsNewNoteActive, selectedDate } = useNotesStore();

  const [noteBody, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsNewNoteActive(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setIsNewNoteActive]);
  return (
    <div className="border-b p-4 bg-accent rounded-md">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setIsSubmitting(true);
          const data = {
            noteBody,
            date: selectedDate,
          };
          await postNewNote({
            data,
          });
          setIsSubmitting(false);
          setIsNewNoteActive(false);
          router.invalidate();
        }}
      >
        <div className="grid w-full gap-2">
          <AutosizeTextarea
            autoFocus
            name="body"
            value={noteBody}
            maxHeight={200}
            onChange={(e) => setBody(e.target.value)}
            className="w-full bg-transparent border-0"
          />
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              variant="destructive"
              onClick={() => {
                setIsNewNoteActive(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
