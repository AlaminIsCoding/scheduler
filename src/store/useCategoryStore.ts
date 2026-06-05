import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_CATEGORIES } from '../lib/constants';
import type { Category } from '../types';

type CategoryInput = Omit<Category, 'id'>;
type CategoryUpdate = Partial<Omit<Category, 'id'>>;

interface CategoryStore {
  categories: Category[];
  addCategory: (category: CategoryInput) => Category;
  updateCategory: (id: string, category: CategoryUpdate) => void;
  deleteCategory: (id: string) => void;
  replaceCategories: (categories: Category[]) => void;
}

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set) => ({
      categories: DEFAULT_CATEGORIES,
      addCategory: (category) => {
        const newCategory: Category = {
          ...category,
          id: nanoid(),
        };

        set((state) => ({ categories: [...state.categories, newCategory] }));

        return newCategory;
      },
      updateCategory: (id, category) => {
        set((state) => ({
          categories: state.categories.map((item) =>
            item.id === id ? { ...item, ...category } : item,
          ),
        }));
      },
      deleteCategory: (id) => {
        set((state) => ({ categories: state.categories.filter((category) => category.id !== id) }));
      },
      replaceCategories: (categories) => {
        set({ categories });
      },
    }),
    {
      name: 'scheduler-categories',
      version: 1,
      partialize: (state) => ({ categories: state.categories }),
    },
  ),
);
