"use client";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import DragAndDrop from "./_local_components/DragAndDrop";
import { generateToast } from "@/app/_global_components/generateToast";
import s from "./CreateEvent.module.scss";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { EventSchema } from "@/app/api/generate-event/schema";
import { Progress } from "@/components/ui/progress";
import EventForm from "./_local_components/EventForm";
import EditEventForm from "../../_local_components/EditEventForm";
function CreateEvent() {
  const [progressValue, setProgressValue] = useState(0);
  const eventId = useSearchParams().get("event-id");
  const {
    isLoading: generatingEvent,
    object,
    clear,
    submit: createEvent,
  } = useObject({
    api: "/api/generate-event",
    schema: EventSchema,
    onFinish: () => {
      generateToast("success", "Event generated successfully");
    },
    onError: (error) => {
      generateToast("error", error.message);
    },
  });
  const pathName = usePathname();
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<File>();
  const [ocrResult, setOcrResult] = useState<string>("");
  const [ocrStatus, setOcrStatus] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const handleOpenChange = useCallback(() => {
    setOpenDrawer(false);

    router.push("/home", { scroll: false });
  }, [router]);
  const handleFile = (file: File) => {
    setUploadedImage(file);
  };
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  async function preprocessImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject("Could not get canvas context");
          return;
        }

        // Scale image to max 1000px width (to improve OCR speed/accuracy)
        const maxWidth = 1000;
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        // Draw with grayscale + higher contrast
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3; // grayscale
          const contrast = avg > 128 ? 255 : 0; // threshold binarization
          data[i] = data[i + 1] = data[i + 2] = contrast;
        }

        ctx.putImageData(imageData, 0, 0);

        resolve(canvas.toDataURL("image/png"));
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const readImageText = useCallback(async () => {
    if (!uploadedImage) {
      generateToast("error", "Ensure to upload image");
      return;
    }

    setOcrStatus(true);

    try {
      const base64 = await preprocessImage(uploadedImage);
      const res = await fetch("/api/extract-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 }),
      });
      const data = await res.json();
      setOcrResult(data);
      createEvent({ extractedText: data.text });
    } catch (error) {
      console.error(error);
      generateToast("error", "Error extracting text");
    } finally {
      setOcrStatus(false);
    }
  }, [uploadedImage]);
  console.log(ocrResult);
  useEffect(() => {
    if (pathName === "/home/create-event") {
      return setOpenDrawer(true);
    } else {
      setOpenDrawer(false);
    }
  }, [pathName]);
  useEffect(() => {
    if (ocrStatus || generatingEvent) {
      let value = 0;
      const interval = setInterval(() => {
        value += (100 - value) * 0.1;

        if (value >= 100) value = 100;
        setProgressValue(value);
      }, 300);

      return () => clearInterval(interval);
    } else {
      setProgressValue(0); // reset when done
    }
  }, [ocrStatus, generatingEvent]);

  return (
    <Drawer open={openDrawer} onOpenChange={handleOpenChange}>
      <DrawerContent className="h-[500px]">
        <DrawerHeader>
          <DrawerTitle>Create a new event</DrawerTitle>
          <DrawerDescription>
            Start by uploading your event invitation image
          </DrawerDescription>
        </DrawerHeader>
        {eventId ? (
          <EditEventForm
            id={eventId}
            clear={clear}
            closeDrawer={handleOpenChange}
          />
        ) : ocrStatus || generatingEvent ? (
          <div className="flex flex-col gap-[12px] max-w-[100%] p-[20px] md:p-[0px] md:max-w-[500px] w-full m-auto">
            <Progress color="#7a573a" value={progressValue} />
            <p className="font-[500] text-[12px] text-[#b3b3b3]">
              {ocrStatus ? "Extracting text..." : "Generating event..."}
            </p>
          </div>
        ) : object ? (
          <EventForm
            clear={() => {
              clear();
              setUploadedImage(undefined);
            }}
            closeDrawer={handleOpenChange}
            description={object?.description || ""}
            endDateTime={object?.endDateTime || ""}
            eventType={object?.eventType || ""}
            location={object?.location || ""}
            organizer={{
              name: object?.organizer?.name || "",
              email: object?.organizer?.email || "",
              phone: object?.organizer?.phone || "",
            }}
            startDateTime={object?.startDateTime || ""}
            title={object?.title || ""}
          />
        ) : (
          <DragAndDrop handleFiles={handleFile} extractText={readImageText} />
        )}
      </DrawerContent>
    </Drawer>
  );
}

export default CreateEvent;
