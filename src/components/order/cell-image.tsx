"use cient";

import Image from "next/image";

interface CellImageProps {
  data: string[];
}

export const CellImage = ({ data }: CellImageProps) => {
  return (
    <>
      {data.map((url, index) => (
        <div
          key={index}
          className="overflow-hidden w-16 h-16 min-h-16 min-w-16 aspect-square flex items-center justify-center"
        >
          <Image alt="image" fill className="object-contain" src={url} />
        </div>
      ))}
    </>
  );
};
