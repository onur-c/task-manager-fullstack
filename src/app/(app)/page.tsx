"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useTaskQuery } from "../../hooks/use-task-query";
import TaskCard from "@/components/task-card";
import { TaskDataType } from "@/types";

export default function Home() {
  const taskQuery = useTaskQuery();

  return (
    <>
      <div className="mt-auto w-full relative ">
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
    </>
  );
}

const EmptyTaskList = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="flex flex-col w-full justify-center items-center h-full overflow-hidden">
      <p className="opacity-70 italic">
        There are no tasks created yet. Start by creating tasks.{" "}
        {!isSignedIn && (
          <Button
            variant="outline"
            asChild
          >
            <Link href={"/sign-in"}>Sign in</Link>
          </Button>
        )}
      </p>
      <div className="h-72 w-72  relative ">
        <Image
          src={"/9264822.webp"}
          className=" object-contain p-6"
          fill={true}
          alt="a"
        />
        <div className="absolute w-full bottom-0 flex justify-center text-xs opacity-60 hover:opacity-70">
          <a
            href="https://www.vecteezy.com/free-vector/empty"
            target="_blank"
          >
            Empty Vectors by Vecteezy
          </a>
        </div>
      </div>
    </div>
  );
};
