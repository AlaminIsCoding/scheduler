import { MousePointerClick, ArrowUpDown, MoveHorizontal, Copy, Download, Undo2, Settings, LucideIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/ui/card';

interface GuideSectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  steps: string[];
}

function GuideSection({ icon: Icon, title, description, steps }: GuideSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ol className="space-y-2">
          {steps.map((step, index) => (
            <li key={index} className="flex gap-3 text-sm text-muted-foreground">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground">
                {index + 1}
              </span>
              <span className="pt-px">{step}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

export function UsageGuidePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Usage Guide</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Learn how to use Scheduler to plan and manage your routines.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <GuideSection
          icon={MousePointerClick}
          title="Creating Events"
          description="Add events to your schedule with a click."
          steps={[
            'Click on any time slot in the calendar grid.',
            'A popover will appear — enter a title for your event.',
            'Select a category and color for the event.',
            'Click "Add" to save the event to your schedule.',
          ]}
        />

        <GuideSection
          icon={MoveHorizontal}
          title="Moving Events"
          description="Drag and drop events to reschedule them."
          steps={[
            'Click and hold an event block.',
            'Drag it to a new time slot or day.',
            'Release to drop the event in the new position.',
            'The calendar will prevent overlapping events.',
          ]}
        />

        <GuideSection
          icon={Copy}
          title="Duplicating Events"
          description="Quickly copy events with Shift+drag."
          steps={[
            'Hold the Shift key on your keyboard.',
            'Click and drag an event block while still holding Shift.',
            'The original event stays in place.',
            'A clone is created and moved to the drop position.',
          ]}
        />

        <GuideSection
          icon={ArrowUpDown}
          title="Resizing Events"
          description="Adjust event duration by dragging edges."
          steps={[
            'Hover over the top or bottom edge of an event block.',
            'Click and drag to resize the event.',
            'Release to set the new start or end time.',
            'Duration snaps to your configured time resolution.',
          ]}
        />

        <GuideSection
          icon={Undo2}
          title="Undo & Redo"
          description="Revert changes with keyboard shortcuts."
          steps={[
            'Press Ctrl+Z (Cmd+Z on Mac) to undo the last action.',
            'Press Ctrl+Shift+Z (Cmd+Shift+Z) to redo.',
            'Use the undo/redo buttons in the toolbar.',
            'Up to 50 actions are stored in history.',
          ]}
        />

        <GuideSection
          icon={Download}
          title="Exporting"
          description="Save or share your schedule."
          steps={[
            'Use the export menu in the toolbar.',
            'Export as JSON for backup or sharing.',
            'Export as PDF or PNG for printing.',
            'Choose between today view or weekly layout.',
          ]}
        />

        <GuideSection
          icon={Settings}
          title="Customization"
          description="Adjust settings to match your preferences."
          steps={[
            'Go to the Settings page via the sidebar.',
            'Change time resolution (15, 30, or 60 min).',
            'Set your day start and end hours.',
            'Choose Monday or Sunday as week start.',
            'Create, edit, or delete categories and colors.',
          ]}
        />
      </div>
    </div>
  );
}
