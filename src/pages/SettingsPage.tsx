import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useCategoryStore } from '../store/useCategoryStore';
import { COLOR_PALETTE } from '../lib/constants';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../components/ui/dialog';
import type { Category } from '../types';

const RESOLUTION_OPTIONS = [15, 30, 60] as const;

export function SettingsPage() {
  const { settings, updateSettings } = useSettingsStore();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const [error, setError] = useState<string | null>(null);
  const [dayStart, setDayStart] = useState(String(settings.dayStart / 60));
  const [dayEnd, setDayEnd] = useState(String(settings.dayEnd / 60));

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState<string>('');

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addColor, setAddColor] = useState<string>(COLOR_PALETTE[0]);

  function handleDayStartChange(value: string) {
    setDayStart(value);
    const hours = Number(value);
    if (isNaN(hours) || hours < 0 || hours > 24) return;
    const minutes = hours * 60;
    if (minutes >= Number(dayEnd) * 60) {
      setError('Day start must be before day end.');
      return;
    }
    setError(null);
    updateSettings({ dayStart: minutes });
  }

  function handleDayEndChange(value: string) {
    setDayEnd(value);
    const hours = Number(value);
    if (isNaN(hours) || hours < 0 || hours > 24) return;
    const minutes = hours * 60;
    if (Number(dayStart) * 60 >= minutes) {
      setError('Day start must be before day end.');
      return;
    }
    setError(null);
    updateSettings({ dayEnd: minutes });
  }

  function openEditDialog(category: Category) {
    setEditingCategory(category);
    setEditName(category.name);
    setEditColor(category.color);
    setEditDialogOpen(true);
  }

  function handleEditSave() {
    if (!editingCategory || !editName.trim()) return;
    updateCategory(editingCategory.id, { name: editName.trim(), color: editColor });
    setEditDialogOpen(false);
    setEditingCategory(null);
  }

  function handleDelete(category: Category) {
    if (window.confirm(`Delete category "${category.name}"?`)) {
      deleteCategory(category.id);
    }
  }

  function openAddDialog() {
    setAddName('');
    setAddColor(COLOR_PALETTE[0]);
    setAddDialogOpen(true);
  }

  function handleAddSave() {
    if (!addName.trim()) return;
    addCategory({ name: addName.trim(), color: addColor });
    setAddDialogOpen(false);
    setAddName('');
    setAddColor(COLOR_PALETTE[0]);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure your scheduling preferences and categories.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Scheduling</CardTitle>
          <CardDescription>
            Time resolution, day bounds, and week start.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="time-resolution">Time Resolution</Label>
            <Select
              value={String(settings.timeResolution)}
              onValueChange={(value) =>
                updateSettings({ timeResolution: Number(value) as 15 | 30 | 60 })
              }
            >
              <SelectTrigger id="time-resolution">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RESOLUTION_OPTIONS.map((res) => (
                  <SelectItem key={res} value={String(res)}>
                    {res} minutes
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="day-start">Day Start (hour)</Label>
            <Input
              id="day-start"
              type="number"
              min={0}
              max={24}
              step={0.5}
              value={dayStart}
              onChange={(e) => handleDayStartChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="day-end">Day End (hour)</Label>
            <Input
              id="day-end"
              type="number"
              min={0}
              max={24}
              step={0.5}
              value={dayEnd}
              onChange={(e) => handleDayEndChange(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="space-y-2">
            <Label htmlFor="start-of-week">Start of Week</Label>
            <Select
              value={settings.startOfWeek}
              onValueChange={(value) =>
                updateSettings({ startOfWeek: value as 'mon' | 'sun' })
              }
            >
              <SelectTrigger id="start-of-week">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mon">Monday</SelectItem>
                <SelectItem value="sun">Sunday</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Manage event categories and colors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories yet.</p>
          ) : (
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEditDialog(category)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span className="sr-only">Edit {category.name}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDelete(category)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Delete {category.name}</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button variant="outline" size="sm" className="w-full" onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Change the name or color of this category.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PALETTE.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`h-8 w-8 rounded-full border-2 transition-all ${
                      editColor === color
                        ? 'border-foreground scale-110'
                        : 'border-transparent hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setEditColor(color)}
                  >
                    <span className="sr-only">{color}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Create a new category with a name and color.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="add-name">Name</Label>
              <Input
                id="add-name"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PALETTE.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`h-8 w-8 rounded-full border-2 transition-all ${
                      addColor === color
                        ? 'border-foreground scale-110'
                        : 'border-transparent hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setAddColor(color)}
                  >
                    <span className="sr-only">{color}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddSave}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
