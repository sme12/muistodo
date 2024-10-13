import { formatISO } from "date-fns";
import { Plus } from "lucide-react";
import DatePicker from "~/components/date-picker";
import Note from "~/components/note";
import { Button } from "~/components/ui/button";
import useNotesStore from "~/store/notes.store";

import { Skeleton } from "./ui/skeleton";

export default function NotesFeed() {
  const {
    noteListItems,
    selectedDate,
    isNewNoteActive,
    isReady,
    setIsNewNoteActive,
  } = useNotesStore();

  return (
    <div className="mx-auto flex h-full w-96 flex-col gap-5 border p-5 rounded-md">
      {isReady ? (
        <>
          <DatePicker initialDate={selectedDate} />
          <div className="flex flex-col gap-2">
            {noteListItems.length === 0 ? (
              selectedDate ===
              formatISO(new Date(), { representation: "date" }) ? (
                <p className="p-4">
                  No notes for today. Have you learned something new or want to
                  add a TODO? Go on!
                </p>
              ) : (
                <p className="p-4">No notes were made on {selectedDate}</p>
              )
            ) : (
              <>
                {noteListItems.map((note) => (
                  <Note {...note} key={note.id} />
                ))}
              </>
            )}
            {isNewNoteActive ? (
              <Note isNewNote setIsNewNoteActive={setIsNewNoteActive} />
            ) : (
              <Button onClick={() => setIsNewNoteActive(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add new note
              </Button>
            )}
          </div>
        </>
      ) : (
        Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-[57px] w-full" />
        ))
      )}
    </div>
  );
}
