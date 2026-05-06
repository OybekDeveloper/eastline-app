"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

const CustomImage = ({
  loadingRoot,
  loading: loadingProp,
  src,
  fill,
  alt,
  className,
  object,
}) => {
  const [loading, setLoading] = useState(true);
  const loadingStrategy = loadingProp || loadingRoot || "lazy";

  useEffect(() => {
    setLoading(true);
  }, [src]);

  const handleImageReady = () => {
    setLoading(false);
  };

  const imageClasses = cn(
    object ? object : fill ? "object-contain h-full" : "object-contain h-auto",
    "duration-700 ease-in-out group-hover:opacity-75",
    !fill && "w-full",
    loading ? "opacity-70" : "opacity-100"
  );

  if (!src) {
    return <div className={cn(className, "flex justify-center items-center")} />;
  }

  return (
    <div className={cn(className, "flex justify-center items-center")}>
      {fill ? (
        <Image
          src={src}
          alt={alt}
          loading={loadingStrategy}
          fill
          sizes="100vw"
          className={imageClasses}
          onLoad={handleImageReady}
          onError={handleImageReady}
          onLoadingComplete={handleImageReady}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          loading={loadingStrategy}
          width={100}
          height={100}
          sizes="100vw"
          quality={100}
          className={imageClasses}
          onLoad={handleImageReady}
          onError={handleImageReady}
          onLoadingComplete={handleImageReady}
        />
      )}
    </div>
  );
};

export default CustomImage;
