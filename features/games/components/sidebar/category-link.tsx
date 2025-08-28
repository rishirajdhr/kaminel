"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Category } from "./types";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const linkVariants = cva(
  "flex h-[72px] w-[74px] flex-col items-center gap-1 p-2 pl-2.5 relative transition-colors",
  {
    variants: {
      state: {
        active:
          "text-[#333333] before:absolute before:left-0.5 before:top-0 before:h-full before:w-1 before:bg-[#333333]",
        default: "text-[#646464] hover:bg-white hover:text-[#454545]",
      },
    },
  }
);

export function CategoryLink(props: { category: Category }) {
  const { href, icon: Icon } = props.category;
  const path = usePathname();
  const categoryPath = typeof href === "string" ? href : (href.pathname ?? "");
  const state = path.startsWith(categoryPath) ? "active" : "default";

  return (
    <Link className={cn(linkVariants({ state }))} href={href}>
      <span>
        <Icon className="size-6" />
      </span>
      <span className="text-sm font-medium">{props.category.label}</span>
    </Link>
  );
}
