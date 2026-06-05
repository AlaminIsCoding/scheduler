import { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { exportToJSON, importFromJSON } from '../../lib/io';
import { useEventStore } from '../../store/useEventStore';
import { useCategoryStore } from '../../store/useCategoryStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';

export function ExportMenu() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const events = useEventStore((s) => s.events);
  const categories = useCategoryStore((s) => s.categories);
  const settings = useSettingsStore((s) => s.settings);
  const replaceEvents = useEventStore((s) => s.replaceEvents);
  const replaceCategories = useCategoryStore((s) => s.replaceCategories);
  const replaceSettings = useSettingsStore((s) => s.replaceSettings);

  const handleExport = () => {
    const json = exportToJSON(events, categories, settings);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `routine-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Routine exported.');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = importFromJSON(text);
      replaceEvents(data.events);
      replaceCategories(data.categories);
      replaceSettings(data.settings);
      toast.success('Routine imported.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Import failed.';
      toast.error(message);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImport}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" title="Export / Import">
            <Download className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4" />
            Import JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
