import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
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

export default function NoteCard() {
  const { activeNote, noteModalOpen, setNoteModalOpen } = useNotesStore();
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === "idle") {
      setNoteModalOpen(false);
    }
  }, [fetcher.state, setNoteModalOpen]);

  if (!activeNote) return null;
  return (
    <Drawer open={noteModalOpen} onOpenChange={setNoteModalOpen}>
      <DrawerContent>
        <DrawerHeader className="sr-only">
          <DrawerTitle>Note Details</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div className="whitespace-pre py-6 max-w-96 mx-auto">
          {activeNote.body}
        </div>
        <DrawerFooter>
          <div className="flex gap-4 justify-center">
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
