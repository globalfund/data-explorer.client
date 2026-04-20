import React, { useRef } from "react";
import { Cropper, CropperRef } from "react-advanced-cropper";
import "./style.css";
import { debounce } from "lodash";

type Coords = { left: number; top: number; width: number; height: number };

export const CropComponent: React.FC<{
  image: string;
  width?: string;
  height?: string;
  cropMode?: boolean;
  cropCoordinates?: Coords;
  onCropChange?: (coordinates: Coords) => void;
  imgStyle:
    | {
        opacity?: number;
      }
    | undefined;
}> = ({
  image,
  width,
  height,
  cropMode,
  onCropChange,
  cropCoordinates,
  imgStyle,
}) => {
  const [isReady, setIsReady] = React.useState<boolean>(false);
  const [loaded, setLoaded] = React.useState<any>(false);
  const [previewSrc, setPreviewSrc] = React.useState<string>("");
  const cropperRef = useRef<CropperRef>(null);

  const getImageSrc = (cRef: CropperRef | null) => {
    if (cRef) {
      const canvas = cRef.getCanvas();
      if (!canvas) return image;
      return canvas.toDataURL();
    }
    return image;
  };

  React.useEffect(() => {
    if (!isReady) return;
    if (!cropCoordinates) return;

    cropperRef.current?.setCoordinates(cropCoordinates);
    setPreviewSrc(getImageSrc(cropperRef.current));
    setLoaded(true);
  }, [isReady, cropCoordinates]);

  // Stable debounced callback
  const debouncedOnCropChange = React.useMemo(() => {
    const fn = debounce((coords: Coords) => onCropChange?.(coords), 500);
    return fn;
  }, [onCropChange]);

  // Cleanup debounce on unmount / change
  React.useEffect(() => {
    return () => {
      debouncedOnCropChange.cancel();
    };
  }, [debouncedOnCropChange]);

  const fullyReady = isReady && loaded;

  return (
    <>
      <Cropper
        key={`${image}-${width}-${height}`}
        ref={cropperRef}
        src={image}
        onReady={() => setIsReady(true)}
        onChange={(cRef) => {
          const coords = cRef.getCoordinates();
          if (coords && loaded) {
            debouncedOnCropChange?.(coords);
          }
        }}
        style={
          fullyReady
            ? {
                display: cropMode ? "flex" : "none",
              }
            : {}
        }
      />

      <img
        src={previewSrc}
        alt="random"
        style={{
          ...imgStyle,
          objectFit: "contain",
          maxHeight: "100%",
          width: "100%",
        }}
        hidden={cropMode || !fullyReady}
      />
    </>
  );
};
