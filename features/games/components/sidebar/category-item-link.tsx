"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CategoryItem } from "./types";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const linkVariants = cva(
  "h-12 w-48 flex items-center justify-center text-sm transition-colors",
  {
    variants: {
      state: {
        active: "text-[#333333] bg-[#ededed]",
        default: "text-[#646464] hover:bg-white hover:text-[#454545]",
      },
    },
  }
);

export function CategoryItemLink(props: { item: CategoryItem }) {
  const { href } = props.item;
  const path = usePathname();
  const categoryPath = typeof href === "string" ? href : (href.pathname ?? "");
  const state = path === categoryPath ? "active" : "default";

  return (
    <Link className={cn(linkVariants({ state }))} href={href}>
      <span>{props.item.label}</span>
    </Link>
  );
}
