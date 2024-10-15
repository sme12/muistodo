import { UserButton } from "@clerk/remix";
import { Link, Outlet } from "@remix-run/react";
import { buttonVariants } from "~/components/ui/button";

export default function NotesPage() {
  return (
    <div className="flex flex-col">
      <header className="items-center flex justify-between gap-4 p-4 text-white">
        <h1 className="text-xl lg:text-3xl font-bold whitespace-nowrap">
          <Link to=".">🐭 MuisTODO</Link>
        </h1>
        <div className="flex gap-4">
          <Link to="todos" className={buttonVariants({ variant: "outline" })}>
            ✅ Todos
          </Link>
          <UserButton />
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
