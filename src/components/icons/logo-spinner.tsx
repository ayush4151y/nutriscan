import { cn } from "@/lib/utils";
import { Logo } from "./logo";

export function LogoSpinner({ className, ...props }: React.ComponentProps<typeof Logo>) {
  return (
    <div className={cn("animate-spin", className)} {...props}>
      <Logo className="h-full w-full" />
    </div>
  )
}
