"use client";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Business } from "@/types-db";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";


type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;
interface BusinessSwitcherProps extends PopoverTriggerProps {
    businessList : Business[]
}

export const BusinessSwitcher = ({businessList} :  BusinessSwitcherProps) => {
    const params = useParams();
    const router = useRouter();

    const formatBusiness = businessList.map(business => ({
        label : business.name,
        value: business.id
    }));

    const currentBusiness = formatBusiness?.find(
        business => business.value === params.businessId
        );
    const [businessValue, setBusinessValue] = useState(false);

    const onBusinessSelect = (business : {value : string, label : string}) => {
        setBusinessValue(false)
        router.push(`/${business.value}`)
    }

    return(
    <Popover open={businessValue} onOpenChange={setBusinessValue}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={businessValue}
          className="w-[200px] justify-between"
        >
          {currentBusiness?.value
            ? formatBusiness.find((framework) => framework.value === currentBusiness.value)?.label
            : "Select Business"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Your Business..." />
          <CommandList>
            <CommandEmpty>No Business found</CommandEmpty>
            <CommandGroup>
              {formatBusiness?.map((business) => (
                <CommandItem
                  key={business.value}
                  value={business.value}
                  onSelect={(currentValue) => {
                    // setValue(currentValue === value ? "" : currentValue)
                    setBusinessValue(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentBusiness?.value === business.value ? "opacity-100" : "opacity-0"
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
    )
}