import { useCategoryStore } from '../../store/useCategoryStore';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface CategoryPickerProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function CategoryPicker({ value, onValueChange }: CategoryPickerProps) {
  const categories = useCategoryStore((state) => state.categories);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id="event-category">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
