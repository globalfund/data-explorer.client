import {
  flushPendingChartEdits,
  trackPendingChartEdits,
} from "./pending-edits";

test("flushing writes every tracked chart's edits until it's untracked", () => {
  const first = { flush: jest.fn() };
  const second = { flush: jest.fn() };
  const untrackFirst = trackPendingChartEdits(first);
  const untrackSecond = trackPendingChartEdits(second);

  flushPendingChartEdits();
  expect(first.flush).toHaveBeenCalledTimes(1);
  expect(second.flush).toHaveBeenCalledTimes(1);

  untrackFirst();
  flushPendingChartEdits();
  expect(first.flush).toHaveBeenCalledTimes(1);
  expect(second.flush).toHaveBeenCalledTimes(2);
  untrackSecond();
});
