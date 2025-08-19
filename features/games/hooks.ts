import { useCallback, useEffect, useState } from "react";
import { GameModel } from "./model";

export function useGame(gameId: number) {
  const [model, setModel] = useState<GameModel | null>(null);

  useEffect(() => {
    async function setupGameModel() {
      const gameModel = new GameModel(gameId);
      await gameModel.init();
      setModel(gameModel);
    }

    if (model === null || model.gameId !== gameId) {
      setModel(null);
      setupGameModel();
    }
  }, []);

  const handleCommand = useCallback(
    (command: string) => {
      if (model == null) {
        throw new Error("No model found");
      }
      const result = model.run(command);
      if (!result.success) {
        throw new Error(result.message);
      }
    },
    [model]
  );

  return { handleCommand, model };
}
