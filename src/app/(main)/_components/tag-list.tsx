"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DB_TagType } from "@/server/db/schema";

type TagListProps = {
  tags: DB_TagType[];
  filter: string | undefined;
};

export function TagList(props: TagListProps) {
  const { tags, filter } = props;

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(filter ?? "");

  const router = useRouter();

  React.useEffect(() => {
    setValue(filter ?? "");
  }, [filter]);

  React.useEffect(() => {
    if (!value) return;

    router.push(`/?tags=${value}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-sm justify-between"
        >
          {value
            ? tags.find((tag) => tag.name === value)?.name
            : "Select Tag..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-sm p-0">
        <Command>
          <CommandInput placeholder="Search tag..." className="h-9" />
          <CommandList>
            <CommandEmpty>No tag found.</CommandEmpty>
            <CommandGroup>
              {tags.map((tag) => (
                <CommandItem
                  key={tag.id}
                  value={tag.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {tag.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === tag.name ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
