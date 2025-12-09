"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

export interface Option<T = any> {
  value: string;
  label: string;
  meta?: T;
}

interface GenericComboboxProps<T = any> {
  options: Option<T>[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  filterFn?: (opt: Option<T>, inputValue: string) => boolean;
  renderLabel?: (opt: Option<T>) => React.ReactNode;
}

export function GenericCombobox<T>({
  options,
  value,
  onChange,
  placeholder = "Select…",
  disabled = false,
  filterFn,
  renderLabel,
}: GenericComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = inputValue.toLowerCase().replace(/\s+/g, "");

    return options.filter(opt => {
      if (filterFn) {
        return filterFn(opt, inputValue);
      }
      const hay = opt.label.toLowerCase().replace(/\s+/g, "");
      return hay.includes(q);
    });
  }, [options, inputValue, filterFn]);

  const selectedOpt = React.useMemo(
    () => options.find(opt => opt.value == value),
    [options, value]
  );

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "w-full flex justify-between items-center border rounded-lg p-2 text-left text-sm",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          aria-expanded={open}
          disabled={disabled}
        >
          <span>
            {selectedOpt
              ? (renderLabel ? renderLabel(selectedOpt) : selectedOpt.label)
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Cari ${placeholder}...`}
            className="h-9 border-b px-2"
            value={inputValue}
            onValueChange={(val: string) => setInputValue(val)}
          />
          <CommandList className="max-h-[240px] overflow-y-auto">
            <CommandGroup>
              {/* Opsi default / kosong di paling atas */}
              <CommandItem
                key="__empty__"
                value=""
                onSelect={() => {
                  onChange("");
                  setOpen(false);
                }}
              >
                {/* Kamu bisa ganti label default sesuai kebutuhan */}
                — none / kosong —
              </CommandItem>

              {filtered.slice(0, 100).map(opt => (
                <CommandItem
                  key={opt.value}
                  value={opt.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  {renderLabel ? renderLabel(opt) : opt.label}
                  {value == opt.value && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              ))}

              {filtered.length === 0 && (
                <CommandEmpty>{placeholder} tidak ditemukan.</CommandEmpty>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
