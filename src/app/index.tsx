import React from "react";
import Router from "app/router";
import { useCMSData } from "./hooks/useCMSData";
import { useCMSCollections } from "./hooks/useCMSCollections";

export default function App() {
  useCMSData({ loadData: true });
  useCMSCollections({ loadData: true });
  return <Router />;
}
