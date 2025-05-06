import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SortOption = 'price' | 'rating';

interface ProductStore {
  favorites: number[];
  selectedCategory: string | null;
  sortBy: SortOption;
  setCategory: (category: string | null) => void;
  toggleFavorite: (productId: number) => void;
  setSortBy: (sort: SortOption) => void;
  isFavorite: (productId: number) => boolean;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      selectedCategory: null,
      sortBy: 'price',

      setCategory: (category) => set({ selectedCategory: category }),

      toggleFavorite: (productId) => {
        const { favorites } = get();
        const updated = favorites.includes(productId)
          ? favorites.filter((id) => id !== productId)
          : [...favorites, productId];
        set({ favorites: updated });
      },

      setSortBy: (sort) => set({ sortBy: sort }),

      isFavorite: (productId) => get().favorites.includes(productId),
    }),
    {
      name: 'product-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
