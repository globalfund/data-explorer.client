import React from "react";
import { TitleStaticArea } from "./title-static-area";
import { TitleDragArea } from "./title-drag-area";

interface TitleAreaProps {
  position: string;
  visualOptions: Record<string, any>;
  setVisualOptions?: (value: Record<string, any>) => void;
  viewMode?: boolean;
  setIsDraggingTitle?: (dragging: boolean) => void;
}

const TitleArea: React.FC<TitleAreaProps> = (props) => {
  if (!props.visualOptions?.showChartName) {
    return null;
  }
  if (props.viewMode) {
    return <TitleStaticArea {...props} />;
  }

  return <TitleDragArea {...props} />;
};

export default TitleArea;
