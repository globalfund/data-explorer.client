import React from "react";
import { TitleStaticArea } from "./title-static-area";
import { TitleDragArea } from "./title-drag-area";

interface TitleAreaProps {
  index: number;
  visualOptions: Record<string, any>;
  /** The title to show: the author's, or the one from the chart's data. */
  title: string;
  onTitleChange?: (value: string) => void;
  viewMode?: boolean;
  setIsDraggingTitle?: (dragging: boolean) => void;
}

const TitleArea: React.FC<TitleAreaProps> = (props) => {
  if (!props.visualOptions?.showChartName) {
    return null;
  }
  if (props.viewMode) {
    // The editor asks for a missing title; readers just don't get a heading.
    return props.title ? (
      <TitleStaticArea
        visualOptions={props.visualOptions}
        title={props.title}
      />
    ) : null;
  }

  return <TitleDragArea {...props} />;
};

export default TitleArea;
