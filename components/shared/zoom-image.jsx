"use client";
import React, { useState, useRef } from "react";
import { Button, Dialog, DialogPanel } from "@headlessui/react";
import { CircleX } from "lucide-react";

export default function ZoomImage({ zoom, selectImage, handleClose }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("center center");
  const imgRef = useRef(null);

  const handleImageClick = (e) => {
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100; // X coordinate as a percentage
    const y = ((e.clientY - top) / height) * 100; // Y coordinate as a percentage

    // Set the transform origin to where the user clicked
    setTransformOrigin(`${x}% ${y}%`);

    // Toggle zoom
    setIsZoomed((prevZoom) => !prevZoom);
  };

  return (
    <div>
      <Dialog
        open={zoom}
        as="div"
        className="relative z-[9999] focus:outline-none"
        onClose={handleClose}
      >
        <div className="fixed inset-0 z-[9998] w-screen overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex h-full items-center justify-center p-4">
            <DialogPanel className="relative z-[9997] w-full h-full rounded-xl p-6">
              <div
                className="relative max-w-full min-h-full h-[calc(100vh-100px)] w-[calc(100vw-48px)] overflow-hidden"
              >
                <img
                  ref={imgRef}
                  src={selectImage}
                  alt="Zoomable"
                  className={`rounded-md w-full h-full object-contain transition-transform duration-300 ${
                    isZoomed ? "scale-150" : "scale-100"
                  }`}
                  onClick={handleImageClick}
                  style={{
                    transformOrigin: transformOrigin,
                    cursor: "zoom-in",
                  }}
                />
              </div>
              <Button
                className="absolute top-2 right-2 inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm font-semibold text-white shadow-inner hover:bg-gray-600 focus:outline-none"
                onClick={handleClose}
              >
                <CircleX />
              </Button>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
