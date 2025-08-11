"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
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
import { createRoom } from "./actions";
import { useState } from "react";
import { AddRoomFormData, addRoomFormSchema } from "./addRoomSchema";
import { LoaderCircle } from "lucide-react";
import { redirect } from "next/navigation";

export default function AddRoom(props: {
  onSubmit: SubmitHandler<AddRoomFormData>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<AddRoomFormData>({
    resolver: zodResolver(addRoomFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: AddRoomFormData) {
    setIsSubmitting(true);
    const response = await createRoom(values);
    setIsSubmitting(false);
    if (response.success) {
      redirect(response.roomHref);
    }
  }

  return (
    <Form {...form}>
      <section className="grid h-full w-full place-items-center">
        <div className="relative w-md items-start overflow-hidden rounded-md p-4 pl-6 shadow before:absolute before:top-0 before:left-0 before:h-full before:w-2 before:bg-indigo-600">
          <form
            className="w-full space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter room name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter room description" {...field} />
                  </FormControl>
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
