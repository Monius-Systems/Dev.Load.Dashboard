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
  placeholder,
  wide = false,
  'aria-describedby': describedBy,
}: {
  id?: string;
  value: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  /**
   * Shown on the trigger while nothing is chosen, in place of listing an empty
   * option among the real ones. For a list of things to pick, where "none of
   * these" is a state and not a choice.
   */
  placeholder?: string;
  /**
   * The open list may be wider than the trigger, and long labels wrap. For
   * options such as addresses, which do not fit a form column and were cut
   * off at its edge.
   */
  wide?: boolean;
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
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        align="start"
        alignItemWithTrigger={false}
        className={cn(
          wide &&
            'w-auto min-w-(--anchor-width) max-w-[min(36rem,calc(100vw-2rem))] [&_[data-slot=select-item]_span:first-child]:whitespace-normal',
        )}
      >
        {items.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
