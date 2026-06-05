import { COLOR_PALETTE } from '../../lib/constants';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

interface ColorPickerProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function ColorPicker({ value, onValueChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLOR_PALETTE.map((color) => (
        <Button
          key={color}
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Use color ${color}`}
          aria-pressed={value === color}
          className={cn('size-8 rounded-full p-0', value === color && 'ring-2 ring-ring ring-offset-2')}
          style={{ backgroundColor: color }}
          onClick={() => onValueChange(color)}
        />
      ))}
    </div>
  );
}
