"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Game } from "@/game/types";
import { Room } from "@/features/rooms/types";
import { updateGameStartRoom } from "@/features/games/actions";
import { Check, DoorOpen, LoaderCircle } from "lucide-react";

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

  return props.room.navigable.isEntryPoint ? (
    <Button variant="outline" asChild>
      <span>
        <Check />
        <span>Starting Room</span>
      </span>
    </Button>
  ) : (
    <Button
      className="cursor-pointer"
      disabled={isMarking}
      onClick={handleClick}
      variant="outline"
    >
      <span className="flex flex-row items-center gap-2">
        {isMarking ? (
          <>
            <LoaderCircle className="text-muted-foreground size-4 animate-spin" />
            <span>Marking...</span>
          </>
        ) : (
          <>
            <DoorOpen />
            <span>Mark as Start Room</span>
          </>
        )}
      </span>
    </Button>
  );
}
