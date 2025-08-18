"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { newEntitySchema } from "@/features/entities/schema";
import { NewEntity } from "@/features/entities/types";
import { addEntity } from "@/features/entities/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Room } from "@/features/rooms/types";
import { getRooms } from "@/features/rooms/api";

type EntityRoomId = z.infer<typeof newEntitySchema.shape.roomId>;

const transformRoomId = {
  fromSelect: (value: string): EntityRoomId =>
    value !== "" ? Number.parseInt(value) : null,
  toSelect: (id: EntityRoomId): string => id?.toString() ?? "",
};

export default function AddEntity() {
  const params = useParams<{ gameId: string }>();
  const gameId = useMemo(() => Number.parseInt(params.gameId), [params.gameId]);
  const [isFetchingRooms, setIsFetchingRooms] = useState(false);
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<NewEntity>({
    resolver: zodResolver(newEntitySchema),
    defaultValues: {
      name: "",
      description: "",
      roomId: null,
      gameId: gameId,
    },
  });

  useEffect(() => {
    async function fetchAllRooms() {
      setIsFetchingRooms(true);
      const gameRooms = await getRooms(gameId);
      setAllRooms(gameRooms);
      setIsFetchingRooms(false);
    }

    fetchAllRooms();
  }, [gameId]);

  async function onSubmit(values: NewEntity) {
    setIsSubmitting(true);
    try {
      await addEntity(values);
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      } else {
        console.error((error as Error).message);
        setIsSubmitting(false);
      }
    }
  }

  return (
    <Form {...form}>
      <section className="grid h-full w-full place-items-center">
        <div className="relative w-md items-start overflow-hidden rounded-md p-4 pl-6 shadow before:absolute before:top-0 before:left-0 before:h-full before:w-2 before:bg-orange-600">
          <form
            className="w-full space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entity Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter entity name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entity Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter entity description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(transformRoomId.fromSelect(value))
                    }
                    value={transformRoomId.toSelect(field.value)}
                  >
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <SelectTrigger>
                          <SelectValue placeholder="Select entity location" />
                        </SelectTrigger>
                        {isFetchingRooms && (
                          <LoaderCircle className="text-muted-foreground h-4 w-4 animate-spin" />
                        )}
                      </div>
                    </FormControl>
                    <SelectContent>
                      {allRooms.map((room) => (
                        <SelectItem
                          key={room.id}
                          value={transformRoomId.toSelect(room.id)}
                        >
                          {room.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? (
                <>
                  <span>
                    <LoaderCircle className="animate-spin" />
                  </span>
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit</span>
              )}
            </Button>
          </form>
        </div>
      </section>
    </Form>
  );
}
