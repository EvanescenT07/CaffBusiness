"use client";

import { Badge, BadgeProps } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface apiComponentProps {
    title: string;
    description: string;
    variant: "public" | "admin";
}

const textMap : Record<apiComponentProps["variant"], string> = {
    public: "Public API",
    admin: "Admin API",
}

const variantMap : Record<apiComponentProps["variant"], BadgeProps["variant"]> = {
    public: "secondary",
    admin: "destructive",
}

export const ApiComponent = ({title, description, variant = "public"} : apiComponentProps) => {

    const handleCopy = () => {
        navigator.clipboard.writeText(description)
        toast.success("Copied to clipboard")
    }

  return (
    <Alert>
        <Server className="h-4 w-4" /> 
        <AlertTitle className="flex items-center gap-x-2">
            {title}
            <Badge variant={variantMap[variant]}> {textMap[variant]} </Badge>
        </AlertTitle>
        <AlertDescription className="mt-4 flex items-center justify-between">
            <code className="relative rounded-md bg-muted px-[0.3rem py-[0.2rem] font-mono font-semibold">
                {description}
            </code>
            <Button variant={"secondary"} size={"icon"} onClick={handleCopy} >
                <Copy className="h-4 w-4" />
            </Button>
        </AlertDescription>
    </Alert>
  )
}