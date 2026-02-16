import React from "react";

export const useAutosave = (
  callback: () => void,
  delay: number,
  autoSave: boolean,
  haschangesBeenMade: boolean,
  deps: any,
) => {
  const savedCallback = React.useRef<() => void>(); // to save the current "fresh" callback

  // keep callback ref up to date
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // create the interval
  React.useEffect(() => {
    // function to call the callback
    function runCallback() {
      savedCallback.current?.();
    }

    if (autoSave && haschangesBeenMade) {
      // run the interval
      const timeout = setTimeout(runCallback, delay);
      // clean up on unmount or dependency change
      return () => clearTimeout(timeout);
    }
  }, [autoSave, haschangesBeenMade, ...deps]);
};
