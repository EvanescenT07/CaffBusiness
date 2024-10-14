"use client";

import { cn } from "@/lib/utils";
import { BriefcaseBusinessIcon, Check } from "lucide-react";

interface BusinessProps {
  label: string;
  value: string;
}

interface BusinessItemsProps {
  business: BusinessProps;
  onSelect: (business: BusinessProps) => void;
  isChecked: boolean;
}

export const BusinessItems = ({
  business,
  onSelect,
  isChecked,
}: BusinessItemsProps) => {
  return (
    <div
      className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-50 text-muted-background hover:text-color-primary"
      onClick={() => onSelect(business)}
    >
      <BriefcaseBusinessIcon className="mr-2 h-5 w-5" />
      <p className="w-full truncate text-sm whitespace-nowrap">
        {business.label}
      </p>
      <Check
        className={cn(
          "ml-auto w-4 h-4",
          isChecked ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
};
