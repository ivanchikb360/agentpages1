import React from "react"
import { Bell } from "lucide-react"
import { Button } from "../components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"

interface Notification {
  id: number
  message: string
  date: string
}

export function NotificationCenter() {
  const [notifications, setNotifications] = React.useState<Notification[]>([
    { id: 1, message: "New lead acquired!", date: "2023-06-15" },
    { id: 2, message: "Conversion rate increased by 5%", date: "2023-06-14" },
    { id: 3, message: "Weekly report available", date: "2023-06-13" },
  ])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <h4 className="font-medium leading-none">Notifications</h4>
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start gap-4">
              <Bell className="mt-0.5 h-4 w-4" />
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">{notification.message}</p>
                <p className="text-sm text-muted-foreground">{notification.date}</p>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

