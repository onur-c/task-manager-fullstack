"use client";
import { UserButton, UserProfile, useAuth, useUser } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import {
  CheckCircledIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  Half2Icon,
  HomeIcon,
  LockClosedIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./dark-mode-toggler";
import { Button, buttonVariants } from "./ui/button";

const links = [
  {
    route: "/",
    label: "All tasks",
    icon: <HomeIcon />,
  },
  {
    route: "/important",
    label: "Important",
    icon: <ExclamationTriangleIcon />,
  },
  {
    route: "/urgent",
    label: "Urgent",
    icon: <ClockIcon />,
  },
  {
    route: "/completed",
    label: "Completed",
    icon: <CheckCircledIcon />,
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  return (
    <header className="w-[85px] sm:w-[200px] border border-border m-8 mr-0 flex flex-col rounded gap-4 shadow-xl bg-background">
      <Button
        variant={"default"}
        asChild
        className="mx-auto mt-4 p-2"
      >
        <Link
          href={"/"}
          className="space-x-2"
        >
          <Half2Icon className="size-6" />
          <p className="hidden sm:inline-block">Taskdash.</p>
        </Link>
      </Button>
      <div className="flex flex-col items-center">
        <div
          className={cn(
            buttonVariants({
              variant: "ghost",
            }),
            "flex gap-1 items-center h-12 "
          )}
        >
          <UserButton afterSignOutUrl="/" />
          {!!user && (
            <div className="hidden sm:inline-block">
              <p className="text-sm">{user.fullName}</p>
              <p className="truncate w-[12ch] text-xs opacity-80">
                {user.primaryEmailAddress?.toString()}
              </p>
            </div>
          )}
        </div>
        {!isSignedIn && (
          <Button
            className="w-2/3"
            variant="outline"
            asChild
          >
            <Link href={"/sign-in"}>Sign in</Link>
          </Button>
        )}
      </div>

      {/* Desktop */}
      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-2 my-auto">
          {links.map((link) => {
            return (
              <Button
                key={link.label}
                variant="ghost"
                className={cn(
                  "rounded-none border-x-0",
                  `${
                    pathname === link.route
                      ? "border-r-8 border-r-primary bg-primary/10"
                      : ""
                  }`
                )}
              >
                <Link
                  href={link.route}
                  className="flex items-center w-full "
                >
                  <div className="sm:mr-3">{link.icon}</div>
                  <p className="hidden sm:inline-block">{link.label}</p>
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
      <div className="mx-auto pb-3">
        <ModeToggle />
      </div>
    </header>
  );
};

export default Sidebar;
