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
  activeNote: NoteListItem | null;
  noteModalOpen: boolean;
}

interface StoreActions {
  setIsReady: (value: boolean) => void;
  setIsNewNoteActive: (value: boolean) => void;
  setNoteListItems: (value: NoteListItem[]) => void;
  setSelectedDate: (value: string) => void;
  setActiveNote: (value: NoteListItem) => void;
  setNoteModalOpen: (value: boolean) => void;
}

const useNotesStore = create<StoreState & StoreActions>((set) => ({
  isReady: false,
  noteListItems: [],
  selectedDate: "",
  isNewNoteActive: false,
  activeNote: null,
  noteModalOpen: false,
  setIsReady: (value: boolean) => set({ isReady: value }),
  setNoteListItems: (value: NoteListItem[]) => set({ noteListItems: value }),
  setSelectedDate: (value: string) => set({ selectedDate: value }),
  setIsNewNoteActive: (value: boolean) => set({ isNewNoteActive: value }),
  setActiveNote: (value: NoteListItem) => set({ activeNote: value }),
  setNoteModalOpen: (value: boolean) => set({ noteModalOpen: value }),
}));

export default useNotesStore;
