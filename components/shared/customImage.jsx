"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";

const CustomImage = ({loadingRoot, src, fill, alt, className, object }) => {
  const lazyRoot = React.useRef(null);
  const [loading, setLoading] = useState(true);
  return (
    <div
      ref={lazyRoot}
      className={cn(className, "flex justify-center items-center")}
    >
      {fill ? (
        <Image
          lazyRoot={lazyRoot}
          src={src}
          alt={alt}
          loading={loadingRoot ? loadingRoot : "lazy"}
          fill
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
          lazyRoot={lazyRoot}
          src={src}
          alt={alt}
          loading={loadingRoot ? loadingRoot : "lazy"}
          width={100}
          height={100}
          layout="responsive"
          quality={100}
          className={cn(
            `${
              object ? `${object}` : "object-contain h-full"
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
