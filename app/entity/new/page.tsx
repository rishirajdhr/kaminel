"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useState } from "react";
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
import { newEntitySchema } from "@/features/entities/schema";
import { NewEntity } from "@/features/entities/types";
import { addEntity } from "@/features/entities/actions";

export default function AddEntity() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<NewEntity>({
    resolver: zodResolver(newEntitySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

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
            ></FormField>
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
