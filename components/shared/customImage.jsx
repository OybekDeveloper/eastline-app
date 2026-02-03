"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

const CustomImage = ({ loadingRoot, src, fill, alt, className, object }) => {
  const [loading, setLoading] = useState(true);
  return (
    <div className={cn(className, "flex justify-center items-center")}>
      {fill ? (
        <Image
          src={src}
          alt={alt}
          loading={loadingRoot ? loadingRoot : "lazy"}
          fill
          sizes="100vw"
          className={`${
            object ? `${object}` : "object-contain h-full"
          } duration-700 ease-in-out group-hover:opacity-75 ${
            loading
              ? "slice-110 blur-2xl grayscale"
              : "scale-100 blur-0 grayscale-0"
          }
        `}
          onLoad={() => setLoading(false)}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          loading={loadingRoot ? loadingRoot : "lazy"}
          width={100}
          height={100}
          sizes="100vw"
          quality={100}
          className={cn(
            `${
              object ? `${object}` : "object-contain h-auto"
            } duration-700 ease-in-out group-hover:opacity-75 w-full`,
            loading
              ? "slice-110 blur-2xl grayscale"
              : "scale-100 blur-0 grayscale-0"
          )}
          onLoad={() => setLoading(false)}
        />
      )}
    </div>
  );
};

export default CustomImage;
