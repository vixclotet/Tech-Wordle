import { cn } from "@/lib/utils"

interface AnnouncementsProps {
  message: string
  type: "success" | "error" | "info"
}

export function Announcements({ message, type }: AnnouncementsProps) {
  return (
    <div
      className={cn(
        "fixed top-20 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg text-white text-center min-w-[200px]",
        type === "success" && "bg-green-500",
        type === "error" && "bg-red-500",
        type === "info" && "bg-blue-500",
      )}
    >
      {message}
    </div>
  )
}

