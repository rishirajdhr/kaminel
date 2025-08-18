"use client";

import { useState } from "react";
import { BadgeAlert } from "lucide-react";
import { useParams } from "next/navigation";
import { useGame } from "@/features/games/hooks";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PlayPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const game = useGame(Number.parseInt(gameId));
  const [command, setCommand] = useState("");

  if (!game.isReady) {
    return <div>Loading...</div>;
  }

  if (game.currentRoom === null) {
    return (
      <div className="grid h-full w-full place-items-center">
        <div className="relative flex w-xl flex-col items-start gap-4 overflow-hidden rounded-md p-4 pl-6 shadow before:absolute before:top-0 before:left-0 before:h-full before:w-2 before:bg-emerald-600">
          <div className="text-4xl font-bold tracking-tight">Play Game</div>
          <div className="relative flex flex-row items-center gap-2 overflow-hidden rounded-sm bg-amber-200 p-2 pl-4 before:absolute before:left-0 before:h-full before:w-2 before:bg-amber-400">
            <BadgeAlert className="size-7 text-amber-500" />
            <span className="font-medium">No start room has been set!</span>
          </div>
        </div>
      </div>
    );
  }

  function handleRun() {
    setCommand("");
    try {
      game.handleCommand(command);
    } catch (error) {
      alert((error as Error).message);
    }
  }

  return (
    <div className="grid h-full w-full place-items-center">
      <div className="relative flex w-xl flex-col items-start gap-4 overflow-hidden rounded-md p-4 pl-6 shadow before:absolute before:top-0 before:left-0 before:h-full before:w-2 before:bg-emerald-600">
        <div className="text-2xl font-semibold tracking-tight">Play Game</div>
        <div>You are in: {game.currentRoom.name}</div>
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
