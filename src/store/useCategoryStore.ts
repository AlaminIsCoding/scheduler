import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { DEFAULT_CATEGORIES } from '../lib/constants';
import type { Category } from '../types';

type CategoryInput = Omit<Category, 'id'>;
type CategoryUpdate = Partial<Omit<Category, 'id'>>;

interface CategoryStore {
  categories: Category[];
  addCategory: (category: CategoryInput) => Category;
  updateCategory: (id: string, category: CategoryUpdate) => void;
  deleteCategory: (id: string) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
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
}));
