"use client";
import React, { useState, useRef } from "react";
import { Button, Dialog, DialogPanel } from "@headlessui/react";
import { CircleX } from "lucide-react";

export default function ZoomImage({ zoom, selectImage, handleClose }) {
  const [magnify, setMagnify] = useState({ x: 0, y: 0, zoom: false });
  const imgRef = useRef(null);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    if (x >= 0 && y >= 0 && x <= width && y <= height) {
      setMagnify({ x, y, zoom: true });
    } else {
      setMagnify({ ...magnify, zoom: false });
    }
  };

  return (
    <div>
      <Dialog
        open={zoom}
        as="div"
        className="relative z-[9999] focus:outline-none"
        onClose={handleClose}
      >
        <div className="fixed inset-0 z-[9998] w-screen overflow-y-auto backdrop-blur-lg">
          <div className="flex h-full items-center justify-center p-4">
            <DialogPanel
              className="relative z-[9997] w-full h-full rounded-xl bg-black p-6 backdrop-blur-2xl"
            >
              <div
                className="relative max-w-full min-h-full h-[calc(100vh-100px)] w-[calc(100vw-48px)] overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setMagnify({ ...magnify, zoom: false })}
              >
                <img
                  ref={imgRef}
                  src={selectImage}
                  alt="Zoomable"
                  className="rounded-md h-[calc(100vh-48px)] w-[calc(100vw-48px)] object-contain"
                />
                {magnify.zoom && (
                  <div
                    className="absolute rounded-full border-4 border-gray-300"
                    style={{
                      left: magnify.x - 50,
                      top: magnify.y - 50,
                      width: 100,
                      height: 100,
                      backgroundImage: `url(${selectImage})`,
                      backgroundSize: `${imgRef.current.offsetWidth * 2}px ${imgRef.current.offsetHeight * 2}px`,
                      backgroundPosition: `-${magnify.x * 2 - 50}px -${magnify.y * 2 - 50}px`,
                      pointerEvents: "none",
                    }}
                  />
                )}
              </div>
              <Button
                className="absolute top-2 left-2 inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm font-semibold text-white shadow-inner hover:bg-gray-600 focus:outline-none"
                onClick={handleClose}
              >
                <CircleX /> Close
              </Button>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
