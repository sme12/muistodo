import { useFetcher } from "@remix-run/react";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import useNotesStore from "~/store/notes.store";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export default function NewNote() {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const { setIsNewNoteActive } = useNotesStore();

  const [body, setBody] = useState("");

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setIsNewNoteActive(false);
      setBody("");
    }
  }, [fetcher.data, fetcher.state, setIsNewNoteActive]);

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
  }, [fetcher, setIsNewNoteActive]);
  return (
    <div className="border-b p-4 bg-accent rounded-md">
      <fetcher.Form action="api/new" method="post">
        <div className="grid w-full gap-2">
          <Textarea
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            name="body"
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full bg-transparent border-0 focus:"
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
      </fetcher.Form>
    </div>
  );
}
