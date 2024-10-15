"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const MainNav = ({
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLElement>) => {
  const path = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.businessId}/overview`,
      label: "Overview",
      active: path === `${params.businessId}/overview`,
    },
    {
      href: `/${params.businessId}/settings`,
      label: "Settings",
      active: path === `${params.businessId}/settings`,
    },
  ];
  return (
    <div className={cn("flex items-center space-x-4 lg:space-x-6 pl-6")}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-color-primary",
            route.active
              ? "text-color-dark dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </div>
  );
};

export default MainNav;
