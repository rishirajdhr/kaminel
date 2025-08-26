"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Game } from "@/features/games/types";
import { Room } from "@/features/rooms/types";
import { updateGameStartRoom } from "@/features/games/actions";
import { LoaderCircle } from "lucide-react";

export function StartRoomBadge(props: { game: Game; room: Room }) {
  const [isMarking, setIsMarking] = useState(false);

  async function handleClick() {
    setIsMarking(true);
    const updatedGame = await updateGameStartRoom(props.game.id, props.room.id);
    if (updatedGame === undefined) {
      console.error("Could not update game start room.");
      setIsMarking(false);
    }
  }

  return props.game.startRoomId === props.room.id ? (
    <Button
      variant="secondary"
      className="rounded-full bg-green-100 text-sm text-green-800 hover:bg-green-100"
      asChild
    >
      <span>Starting Room</span>
    </Button>
  ) : (
    <Button
      disabled={isMarking}
      onClick={handleClick}
      className="rounded-full"
      variant="outline"
    >
      {isMarking ? (
        <span className="flex flex-row items-center gap-2">
          <LoaderCircle className="text-muted-foreground size-4 animate-spin" />
          <span>Marking...</span>
        </span>
      ) : (
        <span>Mark as Start Room</span>
      )}
    </Button>
  );
}
