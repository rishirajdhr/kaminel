import { useCallback, useEffect, useState } from "react";
import { GameModel } from "./model";

type Message = { from: "player" | "system"; content: string };

export function useGame(gameId: number) {
  const [model, setModel] = useState<GameModel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    async function setupGameModel() {
      const gameModel = new GameModel(gameId);
      await gameModel.init();
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
  }, []);

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
