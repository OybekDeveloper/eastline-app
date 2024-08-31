"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";

const CustomImage = ({ src, fill, alt, className }) => {
  const lazyRoot = React.useRef(null);
  const [loading, setLoading] = useState(true);
  return (
    <div
      ref={lazyRoot}
      className={cn(className, "flex justify-center items-center h-full")}
    >
      {fill ? (
        <Image
          lazyRoot={lazyRoot}
          src={src}
          alt={alt}
          fill
          className={`object-contain duration-700 ease-in-out group-hover:opacity-75 ${
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
          width={100}
          height={100}
          layout="responsive"
          quality={100}
          className={cn(
            "object-contain duration-700 ease-in-out group-hover:opacity-75 h-full w-full",
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
