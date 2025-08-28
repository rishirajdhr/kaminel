"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
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
import { addRoom } from "@/features/rooms/actions";
import { newRoomSchema } from "@/features/rooms/schema";
import { NewRoom } from "@/features/rooms/types";

export default function AddRoom() {
  const params = useParams<{ gameId: string }>();
  const gameId = useMemo(() => Number.parseInt(params.gameId), [params.gameId]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<NewRoom>({
    resolver: zodResolver(newRoomSchema),
    defaultValues: {
      gameId,
      describable: {
        gameId,
        name: "",
        description: "",
      },
      navigable: {
        gameId,
      },
    },
  });

  async function onSubmit(values: NewRoom) {
    console.log("submitting form...");
    setIsSubmitting(true);
    try {
      await addRoom(values);
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
      <div className="flex h-full w-full items-start justify-center overflow-y-auto p-10">
        <div className="w-2xl">
          <form
            className="flex w-full flex-col items-start gap-3.5"
            onSubmit={(e) => {
              console.log(form.watch());
              console.log("errors", form.formState.errors);
              form.handleSubmit(onSubmit)(e);
            }}
          >
            <span className="bg-black px-3 py-1.5 text-sm tracking-tight text-white">
              New Room
            </span>
            <FormField
              control={form.control}
              name="describable.name"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <Input
                        className="peer h-fit border-none px-0 py-1 font-bold tracking-tight shadow-none focus-visible:ring-0 md:text-6xl"
                        placeholder=" "
                        {...field}
                      />
                    </FormControl>
                    <FormLabel className="invisible absolute top-1/2 left-0 -translate-y-1/2 border-blue-600 text-6xl font-bold tracking-tight text-[#646464] peer-placeholder-shown:visible data-[error=true]:text-[#646464]">
                      Room Name
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="describable.description"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormControl>
                    <Textarea
                      className="peer h-fit w-full resize-none border-none px-0 py-1 text-base font-light tracking-tight shadow-none focus-visible:ring-0 md:text-base"
                      placeholder=" "
                      {...field}
                    />
                  </FormControl>
                  <FormLabel className="invisible absolute top-1 left-0 text-base font-light tracking-tight text-[#646464] peer-placeholder-shown:visible data-[error=true]:text-[#646464]">
                    Enter Room Description
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? (
                <>
                  <span>
                    <LoaderCircle className="animate-spin" />
                  </span>
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Room</span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </Form>
  );
}
