import { useCallback, useEffect, useState } from "react";
import { GameModel } from "@/game/model";
import { getGameGraph } from "./api";

type Message = { from: "player" | "system"; content: string };

export function useGame(gameId: number) {
  const [model, setModel] = useState<GameModel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    async function setupGameModel() {
      const graph = await getGameGraph(gameId);
      const gameModel = new GameModel(graph);
      setModel(gameModel);
      return gameModel;
    }

    if (model === null || model.gameId !== gameId) {
      setModel(null);
      setupGameModel().then((gameModel) => {
        // Execute a LOOK command on load so player knows where they are
        const result = gameModel.run("look");
        setMessages((prevMessages) => [
          ...prevMessages,
          { from: "system", content: result.message },
        ]);
      });
    }
  }, [gameId]);

  const handleCommand = useCallback(
    (command: string) => {
      if (model == null) {
        throw new Error("No model found");
      }
      const sanitizedCommand = command.trim();
      if (sanitizedCommand === "") {
        throw new Error("Received blank string as command");
      }
      const result = model.run(sanitizedCommand);
      setMessages((prevMessages) => [
        ...prevMessages,
        { from: "player", content: sanitizedCommand },
        { from: "system", content: result.message },
      ]);
      return result;
    },
    [model]
  );

  return { handleCommand, messages, model };
}
