import { LucideIcon } from "lucide-react";
import { LinkProps } from "next/link";

export type Category = {
  label: string;
  href: LinkProps["href"];
  icon: LucideIcon;
};

export type CategoryItem = {
  label: string;
  href: LinkProps["href"];
};
