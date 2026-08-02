import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * Combobox — searchable select dropdown.
 *
 * Props:
 *   options    – [{ value: string, label: string }]
 *   value      – selected value (string)
 *   onChange   – (value: string) => void
 *   placeholder – placeholder text
 *   emptyText  – text when no match found
 *   className  – extra classes for trigger
 */
export function Combobox({
  options = [],
  value,
  onChange,
  placeholder = "Pilih...",
  emptyText = "Tidak ditemukan",
  className,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return options;
    const q = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  const selected = options.find((o) => o.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            type="button"
            className={cn(
              "w-full justify-between h-11 rounded-[10px] font-normal text-left",
              !selected && "text-ink-muted",
              className
            )}
          />
        }
      >
        {selected ? selected.label : placeholder}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[--anchor-width] p-0" align="start">
        <div className="p-2">
          <input
            type="text"
            placeholder="Cari..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-9 w-full rounded-[8px] border border-line bg-white px-3 py-1 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-brand-600"
            autoFocus
          />
        </div>
        <div className="max-h-60 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <p className="px-3 py-2 text-sm text-ink-muted">{emptyText}</p>
          ) : (
            filtered.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "relative flex w-full cursor-pointer select-none items-center rounded-[8px] py-2 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-surface hover:text-ink focus:bg-surface focus:text-ink",
                  value === option.value && "bg-surface text-ink font-medium"
                )}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                  setSearch("");
                }}
              >
                {value === option.value && (
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <Check className="h-4 w-4" />
                  </span>
                )}
                {option.label}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}