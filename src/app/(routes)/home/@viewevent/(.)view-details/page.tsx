"use client"
import React, { useCallback, useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
function ViewDetails() {
  const router = useRouter();
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const params = useSearchParams();;
  const eventId = params.get("event-id");
  const pathName = usePathname();
  const handleSheetChange = useCallback(() => {
    setOpenSheet(false);
    router.push("/home", { scroll: false });
  }, [router]);
  useEffect(() => {
    if (pathName.startsWith("/home/view-details")) {
      return setOpenSheet(true);
    } else {
      setOpenSheet(false);
    }
  }, [pathName]);
  return (
    <Sheet onOpenChange={handleSheetChange} open={openSheet}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>View Event details</SheetTitle>
          <SheetDescription>
            Here you can view the complete details of your selected event. Use
            this panel to review event information without leaving the current
            page. Click <strong>Close</strong> when you’re done.{" "}
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4"></div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default ViewDetails;
