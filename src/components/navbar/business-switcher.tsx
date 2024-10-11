"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
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
import {
  BriefcaseBusinessIcon,
  Check,
  ChevronsUpDown,
  Search,
} from "lucide-react";
import { set } from "react-hook-form";
import { BusinessItems } from "@/components/ui/business-items";
import { modalHooks } from "@/hooks/modal-hooks";
import { CreateNewBusinessItem } from "../business/new-business";


type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;
interface BusinessSwitcherProps extends PopoverTriggerProps {
  items: Business[];
}

export const BusinessSwitcher = ({ items }: BusinessSwitcherProps) => {
  const params = useParams();
  const router = useRouter();
  const useModalHooks = modalHooks()
  const [open, setOpen] = useState(false);
  const [searchTerms, setSearchTerms] = useState("");
  const [filteredBusiness, setFilteredBusiness] = useState<
    { label: string; value: string }[]
  >([]);

  const formattedBusiness = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentBusiness = formattedBusiness.find(
    (item) => item.value === params.businessId
  );

  const handleSearch = (event: any) => {
    setSearchTerms(event.target.value);
    setFilteredBusiness(
      formattedBusiness.filter((items) =>
        items.label.toLowerCase().includes(searchTerms.toLowerCase())
      )
    );
  };

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
          className={cn("w-[200px] justify-between")}
        >
          <BriefcaseBusinessIcon className="mr-2 h-5 w-5" />
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
          <div className="w-full px-2 py-1 flex items-center border rounded-md border-gray-100">
            <BriefcaseBusinessIcon className="ml-2 mr-2 h-4 w-4 min-w-4" />
            <input
              type="text"
              placeholder="Search Business"
              onChange={handleSearch}
              className="flex-1 w-full outline-none"
            />
          </div>
          <CommandList>
            <CommandGroup heading="Business">
              {searchTerms === "" ? (
                formattedBusiness.map((items, index) => (
                  <BusinessItems
                    business={items}
                    key={index}
                    onSelect={onBusinessSelect}
                    isChecked={currentBusiness?.value === items.value}
                  />
                ))
              ) : filteredBusiness.length > 0 ? (
                filteredBusiness.map((items, index) => (
                  <BusinessItems
                    business={items}
                    key={index}
                    onSelect={onBusinessSelect}
                    isChecked={currentBusiness?.value === items.value}
                  />
                ))
              ) : (
                <CommandEmpty>No Business Found</CommandEmpty>
              )}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CreateNewBusinessItem
              onClick={() => {
                setOpen(false);
                useModalHooks.onOpen();
              }}
              />
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
