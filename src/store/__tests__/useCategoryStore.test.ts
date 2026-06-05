import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_CATEGORIES } from '../../lib/constants';
import { useCategoryStore } from '../useCategoryStore';

describe('useCategoryStore', () => {
  beforeEach(() => {
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
});
