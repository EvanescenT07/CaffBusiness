"use client";

import { storage } from "@/lib/firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PuffLoader } from "react-spinners";
import { Button } from "@/components/ui/button";

interface CustomImageUploaderProps {
  disabled?: boolean;
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
  value: string[];
  maxImage: number;
}

const CustomImageUploader = ({
  onChange,
  onRemove,
  value,
  maxImage,
}: CustomImageUploaderProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(event.target.files || []);

    if (value.length + files.length > maxImage) {
      toast.error(`You can only add ${maxImage} images`);
      return;
    }

    setIsLoading(true);
    const newURLs: string[] = [];
    let counterUpload = 0;

    files.forEach((file: File) => {
      const uploadImage = uploadBytesResumable(
        ref(storage, `Images/Products/${Date.now()}-${file.name}`),
        file,
        { contentType: file.type }
      );

      uploadImage.on(
        "state_changed",
        (snapshot) => {
          setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
        (error) => {
          toast.error(error.message);
        },
        () => {
          getDownloadURL(uploadImage.snapshot.ref).then((downloadURL) => {
            newURLs.push(downloadURL);
            counterUpload++;

            if (counterUpload === files.length) {
              setIsLoading(false);
              onChange([...value, ...newURLs]);
            }
          });
        }
      );
    }); 
  };

  const onDelete = (url: string) => {
    const newValue = value.filter((imageUrl) => imageUrl !== url);
    onRemove(url);
    onChange(newValue);
    deleteObject(ref(storage, url))
      .then(() => {
        toast.success("Image successfully deleted");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="w-full">
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
                <div className="absolute z-10 top-2 right-2">
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
                  <p>Upload Product Image</p>
                </div>
                <input
                  type="file"
                  onChange={onUpload}
                  accept="image/jpg, image/jpeg, image/png"
                  className="w-0 h-0"
                  multiple
                />
              </label>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomImageUploader;
