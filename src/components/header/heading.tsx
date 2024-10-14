"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface HeadingProps {
  title: string;
  description: string;
}

export const Heading = ({ title, description }: HeadingProps) => {
  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold tracking-tight"> {title} </h2>
      <p className="text-lg text-muted-foreground"> {description} </p>
    </div>
  );
};
