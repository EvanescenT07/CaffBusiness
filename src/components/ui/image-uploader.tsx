"use client";

import { storage } from "@/lib/firebase";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PuffLoader } from "react-spinners";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUploader = ({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploaderProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUpload = async (event: any) => {
    const file = event.target.files[0];
    setIsLoading(true);
    const uploadFile = uploadBytesResumable(
      ref(storage, `Image/${Date.now()}-${file.name}`),
      file,
      { contentType: file.type }
    );

    uploadFile.on(
      "state_changed",
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        toast.error(error.message);
      },
      () => {
        getDownloadURL(uploadFile.snapshot.ref).then((downloadURL) => {
          onChange(downloadURL);
          setIsLoading(false);
          console.log("File available at", downloadURL);
        });
      }
    );
  };

  const onDelete = (url : string) => {
    onRemove(url)
    deleteObject(ref(storage, url)).then(() => {
        toast.success("Image successfully deleted");
    })
  }

  return (
    <div>
      {value && value.length > 0 ? (
        <>
          <div className="mb-4 flex items-center gap-4">
            {value.map((url) => (
              <div
                className="relative w-52 h-52 rounded-md overflow-hidden"
                key={url}
              >
                <Image
                  fill
                  src={url}
                  alt="Catalog Image"
                  className="object-cover"
                />
                <div className="absolute z10 top-2 right-2">
                  <Button
                    type="button"
                    onClick={() => onDelete(url)}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center flex-col gap-3 w-52 h-52 rounded-md overflow-hidden border border-dashed border-gray-200">
          {isLoading ? (
            <>
              <PuffLoader size={30} color="#000000" />
              <p> {`${progress.toFixed(2)}%`} </p>
            </>
          ) : (
            <>
              <label>
                <div className="w-full h-full flex flex-col gap-2 items-center justify-center cursor-pointer">
                  <ImagePlus className="h-4 w-4" />
                  <p>Upload an Image</p>
                </div>
                <input
                  type="file"
                  onChange={onUpload}
                  accept="image/jpg, image/jpeg, image/png"
                  className="w-0 h-0"
                />
              </label>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
