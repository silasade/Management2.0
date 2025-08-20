import { XIcon } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import s from "./DragAndDrop.module.scss";
type PropType = {
  handleFiles: (files: File) => void;
  extractText: () => void;
};
function DragAndDrop({ handleFiles, extractText }: PropType) {
  const [files, setFiles] = useState<File[]>();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp"],
    },
  });
  useEffect(() => {
    if (files) {
      handleFiles(files[0]);
    }
  }, [files, handleFiles]);
  return (
    <div className={s.wrapper}>
      <div
        {...getRootProps({
          className: s.dragBox,
        })}
      >
        <input {...getInputProps()} />
        <Image
          width={24}
          height={24}
          src={"/imgs/upload.webp"}
          alt="Upload icon"
        />
        <p className={s.helperText}>Drag your file to start uploading</p>
        <p className={s.divider}>OR</p>
        <div className="relative">
          <input
            {...getInputProps()}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <p className="w-fit h-fit border-[#1849D6] p-2 rounded-sm border-2 flex justify-center items-center font-[600] text-[12px] text-[#1849D6] cursor-pointer">
            Browse files
          </p>
        </div>
      </div>
      <p className="font-[400] text-[14px] text-[#6D6D6D]">
        Only support .jpg, .png and .webp files
      </p>
      {/* {file preview and rejection} */}
      {files && files?.length > 0 && (
        <div className="flex flex-col gap-3">
          {files?.map((item, index) => (
            <div
              key={index}
              className="flex flex-row justify-between shadow-1 items-center h-[60px] p-[10px] border border-[#E7E7E7] rounded-[9px] w-full"
            >
              <div className="flex flex-row items-center gap-3">
                <Image
                  width={40}
                  height={40}
                  src={URL.createObjectURL(item)}
                  alt={item.name}
                />
                <div className="flex flex-col gap-1">
                  <p className="text-[14px] font-[600] text-[#0B0B0B]">
                    {item.name}
                  </p>

                  <p className="text-[#6D6D6D] text-[12px] font-[400]">
                    {(item.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <span
                onClick={() =>
                  setFiles((prevFiles) =>
                    prevFiles?.filter((_, i) => i !== index)
                  )
                }
                className="w-[20px] rounded-[100%] border-[2px] bg-[#858585] flex justify-center items-center cursor-pointer border-[#858585] h-[20px]"
              >
                <XIcon color="#fff" width={15} height={15} />
              </span>
            </div>
          ))}
        </div>
      )}
      <button className={s.extractBtn} onClick={extractText}>
        Extract text
      </button>
    </div>
  );
}

export default DragAndDrop;
