"use client";

import { Gamepad2, MapIcon, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Category, CategoryItem } from "./types";
import { CategoryLink } from "./category-link";
import { CategoryItemLink } from "./category-item-link";
import { Button } from "@/components/ui/button";

type Props = {
  secondary: CategoryItem[];
};

export function GameSidebar(props: Props) {
  const params = useParams();
  if (!("gameId" in params)) {
    throw new Error(
      "GameSidebar cannot be rendered outside a game-specific route"
    );
  }

  const gameId = params.gameId;
  const categories: Category[] = [
    { label: "Game", icon: Gamepad2, href: `/game/${gameId}/edit/home` },
    { label: "Map", icon: MapIcon, href: `/game/${gameId}/edit/map` },
    { label: "Rooms", icon: MapPin, href: `/game/${gameId}/edit/room` },
  ];

  return (
    <aside className="flex flex-none flex-row items-stretch">
      <nav className="flex h-full w-[74px] flex-col overflow-x-hidden border-r border-[#dedede] bg-[#fafafa]">
        {categories.map((category) => (
          <CategoryLink key={category.label} category={category} />
        ))}
      </nav>
      <nav className="flex h-full w-48 flex-col overflow-x-hidden border-r border-[#dedede] bg-[#fafafa]">
        <div className="flex h-20 w-48 items-center justify-center">
          <Button asChild>
            <Link href={`/game/${gameId}/edit/room/new`}>
              <span>
                <Plus />
              </span>
              <span>New Game</span>
            </Link>
          </Button>
        </div>
        {props.secondary.map((item) => (
          <CategoryItemLink key={item.label} item={item} />
        ))}
      </nav>
    </aside>
  );
}
