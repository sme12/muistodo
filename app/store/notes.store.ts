import { create } from "zustand";

interface NoteListItem {
  body: string;
  id: string;
  date: string | null;
}

interface StoreState {
  isReady: boolean;
  noteListItems: NoteListItem[];
  selectedDate: string;
  isNewNoteActive: boolean;
}

interface StoreActions {
  setIsReady: (value: boolean) => void;
  setIsNewNoteActive: (value: boolean) => void;
  setNoteListItems: (value: NoteListItem[]) => void;
  setSelectedDate: (value: string) => void;
}

const useNotesStore = create<StoreState & StoreActions>((set) => ({
  isReady: false,
  noteListItems: [],
  selectedDate: "",
  isNewNoteActive: false,
  setIsReady: (value: boolean) => set({ isReady: value }),
  setNoteListItems: (value: NoteListItem[]) => set({ noteListItems: value }),
  setSelectedDate: (value: string) => set({ selectedDate: value }),
  setIsNewNoteActive: (value: boolean) => set({ isNewNoteActive: value }),
}));

export default useNotesStore;
