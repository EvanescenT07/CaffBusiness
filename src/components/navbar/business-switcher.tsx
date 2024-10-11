"use client";

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
import { Business } from "@/types-db";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;
interface BusinessSwitcherProps extends PopoverTriggerProps {
  items: Business[];
}

export const BusinessSwitcher = ({
  items,
  className,
}: BusinessSwitcherProps) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const formattedBusiness = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentBusiness = formattedBusiness.find(
    (item) => item.value === params.businessId
  );

  const onBusinessSelect = (business: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${business.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          {currentBusiness?.value
            ? formattedBusiness.find(
                (business) => business.value === currentBusiness.value
              )?.label
            : "Select business..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Your Business..." />
          <CommandList>
            <CommandEmpty>No Business found</CommandEmpty>
            <CommandGroup>
              {formattedBusiness.map((business) => (
                <CommandItem
                  key={business.value}
                  onSelect={() => onBusinessSelect(business)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentBusiness?.value === business.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {business.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
