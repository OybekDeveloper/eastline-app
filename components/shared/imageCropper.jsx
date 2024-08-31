"use client";
import React, { useState } from "react";
import Cropper from "react-easy-crop";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
// import "./imageCropper.css"

const ImageCropper = ({ image, onCropDone, onCropCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(4 / 3);
  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };
  const onAspectRatioChange = (event) => {
    setAspectRatio(event.target.value);
  };
  return (
    <div className="cropper lg:w-[60%] h-[60vh] relative flex items-end justify-center rounded-md overflow-hidden mx-auto textSmall">
      <div>
        <Cropper
          image={image}
          aspect={aspectRatio}
          crop={crop}
          zoom={zoom}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          style={{
            containerStyle: {
              width: "100%",
              height: "70%",
              zIndex: "8",
              backgroundColor: "#fff",
            },
          }}
        />
      </div>
      <div className="flex flex-col items-center gap-2 absolute bottom-0">
        <div
          className="flex gap-3 items-center flex-wrap"
          onChange={onAspectRatioChange}
        >
          <span className="flex items-center gap-1 flex-col">
            <Input
              id="1/1"
              className="w-3 h-3 md:w-4 md:h-4 accent-primary"
              type="radio"
              value={1 / 1}
              name="ratio"
            />
            <Label htmlFor="1/1">1:1</Label>
          </span>
          <span className="flex items-center gap-1 flex-col">
            <Input
              id="5/4"
              className="w-3 h-3 md:w-4 md:h-4 accent-primary"
              type="radio"
              value={5 / 4}
              name="ratio"
            />
            <Label htmlFor="5:4">5:4</Label>
          </span>
          <span className="flex items-center gap-1 flex-col">
            <Input
              id="4/3"
              className="w-3 h-3 md:w-4 md:h-4 accent-primary"
              type="radio"
              value={4 / 3}
              name="ratio"
            />
            <Label htmlFor="4:3">4:3</Label>
          </span>
          <span className="flex items-center gap-1 flex-col">
            <Input
              id="3/2"
              className="w-3 h-3 md:w-4 md:h-4 accent-primary"
              type="radio"
              value={3 / 2}
              name="ratio"
            />

            <Label htmlFor="3:2">3:2</Label>
          </span>
          <span className="flex items-center gap-1 flex-col">
            <Input
              id="5/3"
              className="w-3 h-3 md:w-4 md:h-4 accent-primary"
              type="radio"
              value={5 / 3}
              name="ratio"
            />
            <Label htmlFor="5:3">5:3</Label>
          </span>
          <span className="flex items-center gap-1 flex-col">
            <Input
              id="16/9"
              className="w-3 h-3 md:w-4 md:h-4 accent-primary"
              type="radio"
              value={16 / 9}
              name="ratio"
            />
            <Label htmlFor="16:9">16:9</Label>
          </span>
        </div>
        <div className="flex gap-3 ">
          <Button className="" onClick={onCropCancel} variant="destructive">
            Отмена
          </Button>
          <Button
            type="button"
            onClick={() => {
              onCropDone(croppedArea);
            }}
          >
            Обрезать и применить
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
