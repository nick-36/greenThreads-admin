"use client";
import { ComponentProps } from "react";
// import formatDistanceToNow from "date-fns/formatDistanceToNow";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { notifications } from "@/lib/utils/constants";
import { Input } from "@/components/ui/input";

// import { useMail } from "@/app/(app)/examples/mail/use-mail";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search } from "lucide-react";

interface MailListProps {
  items: any[];
}

export default function NotificationList({ items }: MailListProps) {
  //   const [mail, setMail] = useMail();

  return (
    <Card x-chunk="dashboard-05-chunk-3" className="border-none">
      <CardContent>
        <div className="flex flex-col space-y-3 md:flex-row  items-center justify-between p-6 px-2 md:px-7">
          <div
            x-chunk="dashboard-05-chunk-3"
            className="flex flex-1 justify-between border-none"
          >
            <CardHeader className="p-0">
              <CardTitle>Notification</CardTitle>
              <CardDescription>Recent notifications</CardDescription>
            </CardHeader>
          </div>
          <div className="relative md:ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
        </div>
        <ScrollArea className="h-screen">
          <div className="flex flex-col gap-2 md:p-4 pt-0">
            {items.map((item) => (
              <button
                key={item.id}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent"
                  //   mail.selected === item.id && "bg-muted"
                )}
                onClick={
                  () => {}
                  //   setMail({
                  //     ...mail,
                  //     selected: item.id,
                  //   })
                }
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{item.name}</div>
                      {!item.read && (
                        <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                    {/* <div
                  className={cn(
                    "ml-auto text-xs",
                    mail.selected === item.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {formatDistanceToNow(new Date(item.date), {
                    addSuffix: true,
                  })}
                </div> */}
                  </div>
                  <div className="text-xs font-medium">{item.subject}</div>
                </div>
                <div className="line-clamp-2 text-xs text-muted-foreground">
                  {item.text.substring(0, 300)}
                </div>
                {item.labels.length ? (
                  <div className="flex items-center gap-2">
                    {item.labels.map((label: any) => (
                      <Badge
                        key={label}
                        variant={getBadgeVariantFromLabel(label)}
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default";
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "secondary";
}
