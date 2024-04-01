"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "./ui/calendar";
import { Checkbox } from "./ui/checkbox";
import { useToast } from "./ui/use-toast";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "@/components/ui/input";
import { CalendarIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { formSchema } from "@/lib/schema";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function CreateTaskFormDialog() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      isCompleted: false,
      isImportant: false,
      isUrgent: false,
    },
  });

  const postTask = async (values: z.infer<typeof formSchema>) => {
    return axios.post("/api/task/create", values);
  };

  const mutation = useMutation({
    mutationFn: postTask,
    onSuccess: () => {
      toast({
        title: "Success",
        variant: "default",
        description: "Task created successfully.",
        duration: 2000,
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      form.reset();
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Please try again later.",
        duration: 2000,
      });
    },
  });

  const { isSignedIn } = useAuth();
  if (!isSignedIn) {
    return;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={() => setIsDialogOpen(!isDialogOpen)}
    >
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusCircledIcon className="mr-2 size-5" />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-border">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="This is your task&lsquo;s title."
                        {...field}
                      />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="This is your task&lsquo;s description."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isCompleted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center p-4 space-x-3 space-y-0 border rounded-md shadow border-border">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Is it completed?</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isUrgent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center p-4 space-x-3 space-y-0 border rounded-md shadow border-border">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Is it urgent?</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isImportant"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center p-4 space-x-3 space-y-0 border rounded-md shadow border-border">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Is it important?</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {/* <FormDescription>
                      Your date of birth is used to calculate your age.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
              >
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
