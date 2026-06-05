import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_CATEGORIES } from '../../lib/constants';
import { useCategoryStore } from '../useCategoryStore';

describe('useCategoryStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useCategoryStore.setState({ categories: DEFAULT_CATEGORIES });
  });

  it('starts with default categories', () => {
    expect(useCategoryStore.getState().categories).toEqual(DEFAULT_CATEGORIES);
  });

  it('adds a category', () => {
    const category = useCategoryStore.getState().addCategory({
      name: 'Chores',
      color: '#14b8a6',
    });

    expect(category).toMatchObject({ name: 'Chores', color: '#14b8a6' });
    expect(category.id).toEqual(expect.any(String));
    expect(useCategoryStore.getState().categories).toEqual([...DEFAULT_CATEGORIES, category]);
  });

  it('updates a category', () => {
    useCategoryStore.getState().updateCategory('study', {
      name: 'Deep Study',
      color: '#a855f7',
    });

    expect(useCategoryStore.getState().categories.find((category) => category.id === 'study')).toEqual({
      id: 'study',
      name: 'Deep Study',
      color: '#a855f7',
    });
  });

  it('deletes a category', () => {
    useCategoryStore.getState().deleteCategory('work');

    expect(useCategoryStore.getState().categories).toEqual(
      DEFAULT_CATEGORIES.filter((category) => category.id !== 'work'),
    );
  });

  it('replaces all categories', () => {
    const replacement = [
      { id: 'new-cat', name: 'Replaced', color: '#ff0000' },
    ];

    useCategoryStore.getState().replaceCategories(replacement);

    expect(useCategoryStore.getState().categories).toEqual(replacement);
  });

  it('replaces categories with empty array', () => {
    useCategoryStore.getState().replaceCategories([]);

    expect(useCategoryStore.getState().categories).toEqual([]);
  });

  it('persists categories to localStorage', () => {
    useCategoryStore.getState().addCategory({ name: 'Chores', color: '#14b8a6' });

    const stored = JSON.parse(localStorage.getItem('routine-categories')!);
    expect(stored.state.categories).toHaveLength(DEFAULT_CATEGORIES.length + 1);
    expect(stored.state.categories[stored.state.categories.length - 1].name).toBe('Chores');
    expect(stored.version).toBe(1);
  });

  it('does not persist action functions', () => {
    useCategoryStore.getState().addCategory({ name: 'Chores', color: '#14b8a6' });

    const stored = JSON.parse(localStorage.getItem('routine-categories')!);
    expect(stored.state.addCategory).toBeUndefined();
  });
});

describe('useCategoryStore hydration', () => {
  beforeEach(() => {
    localStorage.clear();
    useCategoryStore.setState({ categories: DEFAULT_CATEGORIES });
  });

  it('hydrates from saved state in localStorage', () => {
    const saved = [
      { id: 'a', name: 'Saved Cat 1', color: '#ff0000' },
      { id: 'b', name: 'Saved Cat 2', color: '#00ff00' },
    ];
    localStorage.setItem('routine-categories', JSON.stringify({ state: { categories: saved }, version: 1 }));

    (useCategoryStore as any).persist.rehydrate();

    expect(useCategoryStore.getState().categories).toEqual(saved);
  });

  it('falls back to defaults when localStorage has malformed JSON', () => {
    localStorage.setItem('routine-categories', 'not-json');

    (useCategoryStore as any).persist.rehydrate();

    expect(useCategoryStore.getState().categories).toEqual(DEFAULT_CATEGORIES);
  });
});
