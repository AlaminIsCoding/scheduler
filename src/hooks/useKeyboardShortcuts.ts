import { useEffect } from 'react';
import { useEventStore } from '../store/useEventStore';

export function useKeyboardShortcuts() {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!(e.metaKey || e.ctrlKey)) return;
      if (e.key.toLowerCase() !== 'z') return;

      e.preventDefault();

      if (e.shiftKey) {
        useEventStore.getState().redo();
      } else {
        useEventStore.getState().undo();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}
