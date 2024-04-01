"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarIcon,
  CheckCircledIcon,
  ClockIcon,
  DotsVerticalIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { PopoverClose } from "@radix-ui/react-popover";

import { editTaskFormSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { TaskDataType } from "@/types";
import { formatDate } from "@/utils/date-format";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";

const TaskCard = ({ task }: { task: TaskDataType }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const toggleStatus = (
    payload:
      | Record<string, boolean>
      | { title: string; description: string; date: Date }
  ) => {
    return axios.put(`/api/task/${task.id}`, payload);
  };

  const deleteTask = () => {
    return axios.delete(`/api/task/${task.id}`);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      toast({
        title: "Success",
        variant: "default",
        description: "Task deleted successfully.",
        duration: 2000,
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
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

  const updateMutation = useMutation({
    mutationFn: toggleStatus,
    onSuccess: () => {
      toast({
        title: "Success",
        variant: "default",
        description: "Task updated successfully.",
        duration: 2000,
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
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

  const form = useForm<z.infer<typeof editTaskFormSchema>>({
    resolver: zodResolver(editTaskFormSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      date: new Date(task.date),
    },
  });

  async function onSubmit(values: z.infer<typeof editTaskFormSchema>) {
    updateMutation.mutate(values);
  }
  return (
    <Card
      className={cn(
        "w-[312px] h-[312px] flex flex-col border-border relative",
        task.isCompleted && "border-primary"
      )}
    >
      {/* Three Dot Button */}
      <div className="absolute top-2 right-2 ">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
            >
              <DotsVerticalIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80  border-border">
            <h4 className="text-xl font-bold">Edit Task</h4>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
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
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
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

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <PopoverClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </PopoverClose>
                <PopoverClose asChild>
                  <Button
                    type="submit"
                    className="w-full"
                  >
                    Update task
                  </Button>
                </PopoverClose>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-full "
                    >
                      Delete Task
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your task and remove your task data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className={buttonVariants({ variant: "destructive" })}
                        onClick={() => {
                          deleteMutation.mutate();
                        }}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </form>
            </Form>
          </PopoverContent>
        </Popover>
      </div>
      {/* Card Content */}
      <CardHeader>
        <CardTitle>
          <p>{task.title}</p>
        </CardTitle>
        <CardDescription className="text-xs">
          <p>Due date: {formatDate(task.date)}</p>
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-1/2 overflow-y-auto">
        <p className="text-sm">{task.description}</p>
      </CardContent>
      <CardFooter className="flex flex-col  gap-2 mt-auto items-start ">
        <div className="flex flex-wrap gap-2">
          <Badge
            className="cursor-pointer flex items-center gap-1"
            variant={task.isCompleted ? "default" : "secondary"}
            onClick={() =>
              updateMutation.mutate({
                isCompleted: !task.isCompleted,
              })
            }
          >
            <CheckCircledIcon />
            {task.isCompleted ? <p>Completed</p> : <p>Not Completed</p>}
          </Badge>
          <Badge
            className="cursor-pointer flex items-center gap-1"
            variant={task.isUrgent ? "default" : "secondary"}
            onClick={() =>
              updateMutation.mutate({
                isUrgent: !task.isUrgent,
              })
            }
          >
            <CheckCircledIcon />
            {task.isUrgent ? <p>Urgent</p> : <p>Not Urgent</p>}
          </Badge>
          <Badge
            className="cursor-pointer flex items-center gap-1"
            variant={task.isImportant ? "default" : "secondary"}
            onClick={() =>
              updateMutation.mutate({
                isImportant: !task.isImportant,
              })
            }
          >
            <CheckCircledIcon />
            {task.isImportant ? <p>Important</p> : <p>Not Important</p>}
          </Badge>
        </div>
        <div className="text-xs opacity-70">
          Created at: {formatDate(task.createdAt.toString())}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;

// {isEditable && (
//   <div className="absolute backdrop-blur-lg w-full border border-border p-2 z-50">

//   </div>
// )}
