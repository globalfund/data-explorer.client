import React from "react";
import { DraggablePopper } from "app/components/draggable-popper";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { useCMSData } from "app/hooks/useCMSData";
import { getCMSDataField } from "app/utils/getCMSDataField";

export const ReportBuilderPageNotes: React.FC<{
  clicked: boolean;
  anchorEl: null | HTMLElement;
  setClicked: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ anchorEl, clicked, setClicked }) => {
  const cmsData = useCMSData({ returnData: true });
  const value = useStoreState((state) => state.RBReportNotesState.value);
  const setValue = useStoreActions(
    (actions) => actions.RBReportNotesState.setValue,
  );

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <DraggablePopper
      id="report-builder-notes"
      resizable
      width={500}
      title={getCMSDataField(
        cmsData,
        "pagesReportBuilderBuilder.notesTitle",
        "Notes",
      )}
      open={clicked}
      anchorEl={anchorEl}
      setOpen={setClicked}
    >
      <textarea
        autoFocus
        value={value}
        onChange={handleNoteChange}
        placeholder={getCMSDataField(
          cmsData,
          "pagesReportBuilderBuilder.notesPlaceholder",
          "Add notes and comments for this report. These are for internal use and won't appear in the final report.",
        )}
        style={{
          width: "100%",
          border: "none",
          resize: "none",
          height: "500px",
          outline: "none",
          fontSize: "14px",
        }}
      />
    </DraggablePopper>
  );
};
