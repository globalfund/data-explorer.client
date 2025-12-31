import React from "react";
import { Slider } from "../../common/slider";
import BorderFill from "../../common/border-fill";
import { ColorPalette } from "../../common/colorPalette";
import { Checkfield } from "../../common/checkfield";
import { RBReportItemTypes } from "app/state/api/action-reducers/report-builder/sync";

interface SliderProps {
  label: string;
  checkField?: boolean;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checkFieldLabel?: string;
}
interface BorderFillProps {
  itemType: RBReportItemTypes;
}
interface CheckfieldProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

export interface CustomiseComponentProps {
  slider?: SliderProps;
  borderFill?: BorderFillProps;
  checkfield?: CheckfieldProps;
}
export const ComponentTypes: Record<
  string,
  React.FC<CustomiseComponentProps>
> = {
  slider: Slider,
  borderFill: BorderFill,
  checkfield: Checkfield,
  // dropdown: <></>,
  colorPalette: ColorPalette,
};
const borderFill = {
  showLabel: false,
  label: "Border & Fill",
  components: [ComponentTypes.borderFill],
};
export const chartTypeCustomiseComponents = {
  bar: {
    barStyle: {
      showLabel: true,
      label: "Bar Style",
      components: [ComponentTypes.colorPalette, ComponentTypes.slider],
    },
    borderFill,
  },
  line: {
    lineStyle: {
      showLabel: true,
      label: "Line Style",
      components: [ComponentTypes.slider, ComponentTypes.borderFill],
    },
    borderFill,
  },
  pie: {
    pieStyle: {
      showLabel: false,
      label: "Pie Style",
      components: [
        ComponentTypes.slider,
        ComponentTypes.colorPalette,
        ComponentTypes.slider,
      ],
    },
    borderFill,
  },
  sankey: {
    sankeyStyle: {
      showLabel: false,
      label: "Sankey Style",
      components: [ComponentTypes.colorPalette],
    },
    borderFill,
  },
  geomap: {
    geomapStyle: {
      showLabel: false,
      label: "GeoMap Style",
      components: [ComponentTypes.colorPalette],
    },
    borderFill,
  },

  treemap: {
    treemapStyle: {
      showLabel: false,
      label: "Treemap Style",
      components: [ComponentTypes.colorPalette],
    },
    borderFill,
  },
};
