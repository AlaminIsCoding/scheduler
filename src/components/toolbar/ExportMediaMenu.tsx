import { useState, useRef, useEffect } from 'react';
import { FileDown, FileText, Image } from 'lucide-react';
import { toast } from 'sonner';
import { exportPdf } from '../../lib/pdf';
import { exportPng } from '../../lib/imageExport';
import { PrintCalendarView } from '../print/PrintCalendarView';
import { PrintTableView } from '../print/PrintTableView';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';

type Layout = 'calendar' | 'table';
type ExportType = 'pdf' | 'png';

const offscreenBase: React.CSSProperties = {
  position: 'fixed',
  left: '-9999px',
  top: 0,
  width: 1200,
  pointerEvents: 'none',
};

export function ExportMediaMenu() {
  const [action, setAction] = useState<{ layout: Layout; type: ExportType } | null>(null);
  const calRef = useRef<HTMLDivElement>(null);
  const tblRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!action) return;

    const el = action.layout === 'calendar' ? calRef.current : tblRef.current;
    if (!el) return;

    const timer = setTimeout(async () => {
      try {
        if (action.type === 'pdf') {
          await exportPdf({ element: el, filename: `routine-${action.layout}.pdf` });
        } else {
          await exportPng({ element: el, filename: `routine-${action.layout}.png` });
        }
        toast.success(`Exported as ${action.type.toUpperCase()}`);
      } catch {
        toast.error('Export failed');
      }
      setAction(null);
    }, 200);

    return () => clearTimeout(timer);
  }, [action]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" title="Export PDF or PNG">
            <FileDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FileText className="h-4 w-4" />
              PDF
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setAction({ layout: 'calendar', type: 'pdf' })}>
                Calendar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAction({ layout: 'table', type: 'pdf' })}>
                Table
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Image className="h-4 w-4" />
              PNG
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setAction({ layout: 'calendar', type: 'png' })}>
                Calendar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAction({ layout: 'table', type: 'png' })}>
                Table
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="print-content" style={offscreenBase}>
        <div
          ref={calRef}
          style={{ padding: '2rem', height: Math.floor(1200 * 297 / 210), position: 'relative' }}
        >
          <PrintCalendarView />
          <div
            style={{
              position: 'absolute',
              bottom: '0.75rem',
              left: 0,
              right: 0,
              textAlign: 'center',
              fontSize: '9px',
              color: '#999',
            }}
          >
            scheduler.alamin.work
          </div>
        </div>
      </div>

      <div className="print-content" style={offscreenBase}>
        <div ref={tblRef} style={{ padding: '2rem' }}>
          <PrintTableView />
          <div style={{ textAlign: 'center', fontSize: '9px', color: '#999', marginTop: '0.75rem' }}>
            scheduler.alamin.work
          </div>
        </div>
      </div>
    </>
  );
}
