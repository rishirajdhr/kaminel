"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { BadgeAlert, SendHorizonal } from "lucide-react";
import { useParams } from "next/navigation";
import { useGame } from "@/features/games/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PlayPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const game = useGame(Number.parseInt(gameId));
  const [command, setCommand] = useState("");
  const messagesBottomAnchor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesBottomAnchor.current?.scrollIntoView({ behavior: "smooth" });
  }, [game.messages]);

  if (game.model === null) {
    return <div>Model does not exist</div>;
  }

  if (game.model.status === "pending") {
    return <div>Loading...</div>;
  }

  if (game.model.currentRoom === null) {
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
    const sanitizedCommand = command.trim();
    if (sanitizedCommand === "") return;

    game.handleCommand(sanitizedCommand);
    setCommand("");
  }

  function handleEnter(e: KeyboardEvent<HTMLInputElement>) {
    if (
      e.key === "Enter" &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.metaKey &&
      !e.altKey
    ) {
      handleRun();
    }
  }

  return (
    <div className="grid h-full w-full place-items-center">
      <Card className="w-xl gap-0 py-0">
        <CardHeader className="border-b border-gray-600/20 bg-gray-50/5 pt-6">
          <CardTitle>{game.model.name}</CardTitle>
          <CardDescription>{game.model.description}</CardDescription>
        </CardHeader>
        <CardContent className="h-[672px] overflow-y-auto bg-gray-300/15 py-6 inset-shadow-xs">
          <div className="flex flex-col justify-start gap-2">
            {game.messages.map((message, index) => (
              <div
                className={cn(
                  "max-w-8/12 rounded-sm px-4 py-2 font-mono text-sm shadow-xs",
                  message.from === "system"
                    ? "self-start border border-gray-400/25 bg-white"
                    : "self-end border-gray-600/75 bg-gray-200"
                )}
                key={`${message}-${index}`}
              >
                {message.content.split("\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            ))}
            <div ref={messagesBottomAnchor} />
          </div>
        </CardContent>
        <CardFooter className="gap-2 border-t border-gray-600/20 bg-gray-50/5 pb-6">
          <Input
            id="command"
            className="font-mono"
            placeholder="Enter Command"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleEnter}
          />
          <Button onClick={handleRun}>
            <SendHorizonal />
            <span>Send</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
