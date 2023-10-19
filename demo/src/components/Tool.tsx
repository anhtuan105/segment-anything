// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

import React, { useContext, useEffect, useState } from "react";
import AppContext from "./hooks/createContext";
import { ToolProps } from "./helpers/Interfaces";
import * as _ from "underscore";

const Tool = ({ handleMouseMove }: ToolProps) => {
  const {
    image: [image],
    maskImg: [maskImg, setMaskImg],
    apply: [apply, setApply],
  } = useContext(AppContext)!;

  const [maskImages, setMaskImages] = useState<(HTMLImageElement | null)[]>([]);
  const [maskIndex, setMaskIndex] = useState(0);

  // Determine if we should shrink or grow the images to match the
  // width or the height of the page and setup a ResizeObserver to
  // monitor changes in the size of the page
  const [shouldFitToWidth, setShouldFitToWidth] = useState(true);
  const [isPause, setIsPause] = useState(false);
  const bodyEl = document.body;
  const fitToPage = () => {
    if (!image) return;
    const imageAspectRatio = image.width / image.height;
    const screenAspectRatio = window.innerWidth / window.innerHeight;
    setShouldFitToWidth(imageAspectRatio > screenAspectRatio);
  };
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === bodyEl) {
        fitToPage();
      }
    }
  });
  useEffect(() => {
    fitToPage();
    resizeObserver.observe(bodyEl);
    return () => {
      resizeObserver.unobserve(bodyEl);
    };
  }, [image]);

  const imageClasses = "";
  const maskImageClasses = `absolute opacity-80 pointer-events-none`;

  useEffect(() => {
    if (apply) {
      if (isPause) {
        setMaskImages([...maskImages, maskImg]);
        setMaskIndex((pre) => pre + 1);
        setApply(false);
        setMaskImg(null);
      }
    }
  }, [apply, maskImg]);

  // Render the image and the predicted mask image on top
  return (
    <>
      <>
        {image && (
          <img
            onMouseMove={(e) => {
              if (isPause) {
                return;
              }
              handleMouseMove(e);
            }}
            // onMouseOut={() => _.defer(() => setMaskImg(null))}
            onTouchStart={handleMouseMove}
            onClick={() => {
              setIsPause((pre) => !pre);
            }}
            src={image.src}
            className={`${
              shouldFitToWidth ? "w-full" : "h-full"
            } ${imageClasses}`}
          ></img>
        )}
        {maskImages.length > 0 &&
          maskImages.map((maskImg, index) => (
            <img
              src={maskImg?.src}
              className={`${
                shouldFitToWidth ? "w-full" : "h-full"
              } ${maskImageClasses}`}
              key={index}
            ></img>
          ))}
        {maskImg && (
          <img
            src={maskImg.src}
            className={`${
              shouldFitToWidth ? "w-full" : "h-full"
            } ${maskImageClasses}`}
          ></img>
        )}
      </>
    </>
  );
};

export default Tool;

// {maskImg && (
// <img
//   src={maskImg.src}
//   className={`${
//     shouldFitToWidth ? "w-full" : "h-full"
//   } ${maskImageClasses}`}
// ></img>
// )}
