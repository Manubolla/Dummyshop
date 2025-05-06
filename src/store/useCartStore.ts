import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProductModel } from '@/src/data/mappers/product.mappers';

interface CartItem {
  product: ProductModel;
  quantity: number;
}

interface CartState {
  items: Record<number, CartItem>;
  addItem: (product: ProductModel) => void;
  removeItem: (productId: number) => void;
  getQuantity: (productId: number) => number;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: {},

      addItem: (product) => {
        set((state) => {
          const existing = state.items[product.id];
          const currentQty = existing?.quantity ?? 0;
          if (currentQty >= product.stock) return state;

          return {
            items: {
              ...state.items,
              [product.id]: {
                product,
                quantity: currentQty + 1,
              },
            },
          };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const existing = state.items[productId];
          if (!existing) return state;
          const newQty = existing.quantity - 1;

          const newItems = { ...state.items };
          if (newQty <= 0) {
            delete newItems[productId];
          } else {
            newItems[productId] = {
              product: existing.product,
              quantity: newQty,
            };
          }

          return { items: newItems };
        });
      },

      getQuantity: (productId) => {
        return get().items[productId]?.quantity ?? 0;
      },

      clearCart: () => set({ items: {} }),
    }),
    {
      name: 'cart-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
