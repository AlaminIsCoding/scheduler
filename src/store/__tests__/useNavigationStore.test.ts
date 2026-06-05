import { beforeEach, describe, expect, it } from 'vitest';
import { useNavigationStore } from '../useNavigationStore';

describe('useNavigationStore', () => {
  beforeEach(() => {
    useNavigationStore.setState({ activePage: 'today' });
  });

  it('starts on the today page', () => {
    expect(useNavigationStore.getState().activePage).toBe('today');
  });

  it('sets the active page', () => {
    useNavigationStore.getState().setActivePage('weekly');

    expect(useNavigationStore.getState().activePage).toBe('weekly');
  });
});
