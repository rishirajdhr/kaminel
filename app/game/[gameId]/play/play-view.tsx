"use client";

import { useState } from "react";
import { Direction, Exit, Room } from "@/features/rooms/types";
import { getRoom } from "@/features/rooms/api";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function PlayView(props: { startRoom: Room }) {
  const [room, setRoom] = useState<Room>(props.startRoom);
  const [command, setCommand] = useState("");

  async function handleMove(direction: Direction) {
    if (room === null) return;
    const exit: Exit = `${direction}Exit`;
    if (room[exit] === null) {
      alert(`There is no room to the ${direction}!`);
    } else {
      try {
        const nextRoom = await getRoom(room.gameId, room[exit]);
        setRoom(nextRoom);
      } catch (error) {
        alert((error as Error).message);
      }
    }
  }

  function handleCommand(command: string) {
    if (room === null) return;

    const normalizedCommand = command.toLowerCase();
    switch (normalizedCommand) {
      case "move north":
        handleMove("north");
        break;
      case "move south":
        handleMove("south");
        break;
      case "move east":
        handleMove("east");
        break;
      case "move west":
        handleMove("west");
        break;
    }
  }

  function handleRun() {
    handleCommand(command);
    setCommand("");
  }

  return (
    <div className="grid h-full w-full place-items-center">
      <div className="relative flex w-xl flex-col items-start gap-4 overflow-hidden rounded-md p-4 pl-6 shadow before:absolute before:top-0 before:left-0 before:h-full before:w-2 before:bg-emerald-600">
        <div className="text-2xl font-semibold tracking-tight">Play Game</div>
        <div>You are in: {room.name}</div>
        <div>
          <Label className="pb-2" htmlFor="command">
            Enter command
          </Label>
          <span className="flex flex-row gap-2">
            <Input
              id="command"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
            />
            <Button onClick={handleRun}>Run</Button>
          </span>
        </div>
      </div>
    </div>
  );
}
