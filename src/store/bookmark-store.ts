import { create } from "zustand";

interface BookmarkState {
  ids: Set<string>;
  seed: (ids: string[]) => void;
  add: (id: string) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  ids: new Set(),
  seed: (ids) => set({ ids: new Set(ids) }),
  add: (id) => {
    const next = new Set(get().ids);
    next.add(id);
    set({ ids: next });
  },
  remove: (id) => {
    const next = new Set(get().ids);
    next.delete(id);
    set({ ids: next });
  },
  has: (id) => get().ids.has(id),
}));
