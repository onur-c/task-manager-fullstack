"use client";
import { CreateTaskFormDialog } from "@/components/create-task-button";
import TaskCard from "@/components/task-card";
import { TaskDataType } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";

export default function Home() {
  const { isSignedIn } = useAuth();
  const getTasks = async () => {
    return axios.get("/api/tasks");
  };

  const taskQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  return (
    <>
      {isSignedIn && (
        <div className="mt-auto w-full relative ">
          <div className="absolute bottom-16 right-16">
            <CreateTaskFormDialog />
          </div>
          <h1 className="ml-8 text-5xl font-extrabold">All Tasks</h1>
          <main className=" shadow-xl m-8  border border-border p-6  rounded flex flex-wrap gap-3 overflow-y-auto h-[calc(100vh-150px)] bg-background ">
            {taskQuery.isSuccess && !!taskQuery.data?.data.length ? (
              taskQuery.data.data.map((task: TaskDataType) => (
                <TaskCard
                  task={task}
                  key={task.id}
                />
              ))
            ) : (
              <EmptyTaskList />
            )}
          </main>
        </div>
      )}
    </>
  );
}

const EmptyTaskList = () => {
  return (
    <div className="flex flex-col w-full justify-center items-center h-full overflow-hidden">
      <p className="opacity-70 italic">
        There are no tasks created yet. Start by creating tasks.
      </p>
      <div className="h-72 w-72  relative ">
        <Image
          src={"/9264822.webp"}
          className=" object-contain p-6"
          fill={true}
          alt="a"
        />
        <div className="absolute w-full bottom-0 flex justify-center text-xs opacity-60 hover:opacity-70">
          <a href="https://www.vecteezy.com/free-vector/empty">
            Empty Vectors by Vecteezy
          </a>
        </div>
      </div>
    </div>
  );
};
