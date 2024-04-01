import { Button } from "@/components/ui/button";
import { SignIn } from "@clerk/nextjs";
import { ArrowLeftIcon, HomeIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function Page() {
  return (
    <div className="m-auto space-y-2 ">
      <Button>
        <Link
          href="/"
          className="flex items-center gap-1"
        >
          <ArrowLeftIcon />
          Home
        </Link>
      </Button>
      <SignIn />
    </div>
  );
}
