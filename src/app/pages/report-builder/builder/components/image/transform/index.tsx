import { ReportItemOf } from "app/state/api/action-reducers/report-builder/sync";
import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type SavedTransform = {
  scale: number;
  positionX: number;
  positionY: number;
};

const DEFAULT_TRANSFORM: SavedTransform = {
  scale: 1,
  positionX: 0,
  positionY: 0,
};

const PanComponent: React.FC<{
  handleChangeTransformCoordinates: (coordinates: SavedTransform) => void;
  viewMode?: boolean;
  imageSrc: string;
  selectedItem: ReportItemOf<"image">;
  imgStyle:
    | {
        opacity?: number;
      }
    | undefined;
}> = ({
  handleChangeTransformCoordinates,
  viewMode,
  imageSrc,
  selectedItem,
  imgStyle,
}) => {
  const [transform, setTransform] =
    React.useState<SavedTransform>(DEFAULT_TRANSFORM);

  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    if (!selectedItem) return;
    setTransform({
      scale:
        selectedItem?.data?.transformCoordinates?.scale ||
        DEFAULT_TRANSFORM.scale,
      positionX:
        selectedItem?.data?.transformCoordinates?.positionX ||
        DEFAULT_TRANSFORM.positionX,
      positionY:
        selectedItem?.data?.transformCoordinates?.positionY ||
        DEFAULT_TRANSFORM.positionY,
    });
    setIsReady(true);
  }, [selectedItem?.id]);

  if (!isReady) {
    return null;
  }

  return (
    <TransformWrapper
      disabled={viewMode}
      initialScale={transform.scale}
      initialPositionX={transform.positionX}
      initialPositionY={transform.positionY}
      minScale={1}
      maxScale={4}
      limitToBounds
      centerZoomedOut
      disablePadding
      doubleClick={{ disabled: true }}
      panning={{ velocityDisabled: true }}
      onTransformed={(_, state) => {
        const nextValue: SavedTransform = {
          scale: state.scale,
          positionX: state.positionX,
          positionY: state.positionY,
        };
        if (isReady) {
          setTransform(nextValue);
          handleChangeTransformCoordinates(nextValue);
        }
      }}
    >
      <TransformComponent
        wrapperStyle={{
          ...(imgStyle || {}),
          width: "100%",
          height: "100%",
        }}
        contentStyle={{
          width: "100%",
        }}
      >
        <img
          src={imageSrc}
          alt="zoomable"
          draggable={false}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      </TransformComponent>
    </TransformWrapper>
  );
};

export default PanComponent;
