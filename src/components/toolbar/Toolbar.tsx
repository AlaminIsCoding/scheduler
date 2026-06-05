import { useStore } from 'zustand';
import { Undo2, Redo2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { useEventStore } from '../../store/useEventStore';
import { ExportMenu } from './ExportMenu';
import { ExportMediaMenu } from './ExportMediaMenu';
import { SettingsPanel } from './SettingsPanel';

export function Toolbar() {
  const undo = useEventStore((s) => s.undo);
  const redo = useEventStore((s) => s.redo);
  const canUndo = useStore(useEventStore.temporal, (s) => s.pastStates.length > 0);
  const canRedo = useStore(useEventStore.temporal, (s) => s.futureStates.length > 0);

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-background/95 p-1 shadow-sm">
      <Button variant="ghost" size="icon" disabled={!canUndo} onClick={undo} title="Undo (Ctrl+Z)">
        <Undo2 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" disabled={!canRedo} onClick={redo} title="Redo (Ctrl+Shift+Z)">
        <Redo2 className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <SettingsPanel />
      <ExportMediaMenu />
      <ExportMenu />
    </div>
  );
}
