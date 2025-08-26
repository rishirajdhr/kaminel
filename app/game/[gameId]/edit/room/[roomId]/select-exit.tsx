"use client";

import { LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateRoomExit } from "@/features/rooms/actions";
import type { Room } from "@/features/rooms/types";
import type { Direction } from "@/game/behaviors";

export type Props = {
  roomId: number;
  direction: Direction;
  originalDestinationId: number | null;
  optionsForDestination: Room[];
};

export function SelectExit(props: Props) {
  const params = useParams<{ gameId: string; roomId: string }>();
  const [destinationId, setDestinationId] = useState<string>(
    props.originalDestinationId?.toString() ?? ""
  );
  const [isSaving, setIsSaving] = useState(false);

  const selectConfig = useMemo(() => {
    const label =
      props.direction.slice(0, 1).toUpperCase() +
      props.direction.slice(1) +
      " Exit";
    const id = `select-${props.direction}-exit-${props.roomId}`;
    return { label, id };
  }, [props.direction, props.roomId]);

  const showSaveBtn =
    destinationId !== "" &&
    destinationId !== props.originalDestinationId?.toString();

  async function handleSave() {
    setIsSaving(true);
    const gameId = Number.parseInt(params.gameId);
    const exitId = destinationId !== "" ? Number.parseInt(destinationId) : null;
    try {
      await updateRoomExit(gameId, props.roomId, {
        direction: props.direction,
        destinationId: exitId,
      });
    } catch (error) {
      alert((error as Error).message);
    }
    setIsSaving(false);
  }

  async function handleClear() {
    const prevDestinationId = destinationId;
    setDestinationId("");
    setIsSaving(true);
    try {
      const gameId = Number.parseInt(params.gameId);
      await updateRoomExit(gameId, props.roomId, {
        direction: props.direction,
        destinationId: null,
      });
    } catch (error) {
      alert((error as Error).message);
      setDestinationId(prevDestinationId);
    }
    setIsSaving(false);
  }

  return (
    <div className="space-y-2 py-2">
      <Label htmlFor={selectConfig.id}>{selectConfig.label}</Label>
      <div className="flex flex-row gap-4">
        <Select value={destinationId} onValueChange={setDestinationId}>
          <SelectTrigger id={selectConfig.id} className="w-64">
            <SelectValue placeholder="Select a Room" />
          </SelectTrigger>
          <SelectContent>
            {props.optionsForDestination.map((room) => (
              <SelectItem key={room.id} value={room.id.toString()}>
                {room.describable.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {showSaveBtn ? (
          <Button disabled={isSaving} onClick={handleSave}>
            {isSaving ? (
              <>
                <span>
                  <LoaderCircle className="animate-spin" />
                </span>
                <span>Saving...</span>
              </>
            ) : (
              <span>Save</span>
            )}
          </Button>
        ) : (
          <Button
            disabled={isSaving || destinationId === ""}
            variant="secondary"
            onClick={handleClear}
          >
            {isSaving ? (
              <>
                <span>
                  <LoaderCircle className="animate-spin" />
                </span>
                <span>Clearing...</span>
              </>
            ) : (
              <span>Clear</span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
