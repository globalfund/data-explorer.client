import React from "react";
import { EmptyAssetsView } from "app/pages/report-builder/main/components/all-assets-view/empty";

export const AllAssetsView: React.FC<{
  selectedView: "cards" | "list";
}> = () => {
  return <EmptyAssetsView />;
};
