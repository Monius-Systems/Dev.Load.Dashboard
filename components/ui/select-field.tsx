'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type SelectOption = { value: string; label: string };

/**
 * Dashboard-styled replacement for a native <select> with string values. The
 * open list is drawn by the app, so it matches the theme instead of the OS.
 */
export function SelectField({
  id,
  value,
  options,
  onValueChange,
  disabled,
  className,
  'aria-describedby': describedBy,
}: {
  id?: string;
  value: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  'aria-describedby'?: string;
}) {
  // A value that is not in the list (for example text read off a ticket) is
  // added as its own option and kept after the user picks something else. The
  // select tracks items by position, so dropping it at the moment of a pick
  // would reset the choice.
  const [extras, setExtras] = useState<string[]>([]);
  const listed = (candidate: string) =>
    options.some((option) => option.value === candidate);
  if (value && !listed(value) && !extras.includes(value)) {
    setExtras([...extras, value]);
  }
  const items = [
    ...options,
    ...extras
      .filter((extra) => !listed(extra))
      .map((extra) => ({ value: extra, label: extra })),
  ];
  return (
    // Non-modal: no page scroll lock or backdrop under the pointer, so the
    // smooth cursor is not replaced by the system cursor when the list opens.
    <Select
      modal={false}
      items={items}
      value={value}
      disabled={disabled}
      onValueChange={(next) => onValueChange(next ?? '')}
    >
      <SelectTrigger
        id={id}
        aria-describedby={describedBy}
        className={cn('ld-select', className)}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="start" alignItemWithTrigger={false}>
        {items.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
