/* eslint-disable @typescript-eslint/no-unused-vars */
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
      href: `/${params.businessId}/catalog`,
      label: "Catalog",
      active: path === `${params.businessId}/catalog`,
    },
    {
      href: `/${params.businessId}/categories`,
      label: "Category",
      active: path === `${params.businessId}/categories`,
    },
    {
      href: `/${params.businessId}/option`,
      label: "Option",
      active: path === `${params.businessId}/option`
    },
    {
      href: `/${params.businessId}/detail`,
      label: "Detail",
      active: path === `${params.businessId}/detail`
    },
    {
      href: `/${params.businessId}/region`,
      label: "Region",
      active: path === `${params.businessId}/region`
    },
    {
      href: `/${params.businessId}/product`,
      label: "Product",
      active: path === `${params.businessId}/product`
    },
    {
      href: `/${params.businessId}/orders`,
      label: "Order",
      active: path === `${params.businessId}/orders`
    },
    {
      href: `/${params.businessId}/settings`,
      label: "Settings",
      active: path === `${params.businessId}/settings`,
    },
  ];
  return (
    <div className={cn("flex items-center space-x-4 lg:space-x-8 pl-6")}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-base font-medium transition-colors hover:text-color-dark dark:hover:text-white",
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
