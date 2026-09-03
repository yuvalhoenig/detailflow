"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/actions/auth";

export function UserMenu({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const initial = email.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-medium text-white"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card py-2 shadow-lg">
          <p className="truncate px-4 py-1.5 text-sm text-muted">{email}</p>
          <div className="my-1 h-px bg-border" />
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-background"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
