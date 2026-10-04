import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import EditableTitle from "./editable-title";

test("commits trimmed title on blur and signals editing state", () => {
  const onTitleChange = jest.fn();
  const setEditing = jest.fn();
  const ControlledTitle = () => {
    const [title, setTitle] = React.useState("Original");
    return (
      <EditableTitle
        title={title}
        onTitleChange={(value) => {
          onTitleChange(value);
          setTitle(value);
        }}
        setEditing={setEditing}
      />
    );
  };
  render(<ControlledTitle />);
  const input = screen.getByRole("textbox", { name: "Edit title" });
  fireEvent.focus(input);
  expect(setEditing).toHaveBeenLastCalledWith(true);
  input.textContent = "  New title  ";
  fireEvent.blur(input);
  expect(onTitleChange).toHaveBeenLastCalledWith("New title");
  expect(input).toHaveTextContent("New title");
  expect(setEditing).toHaveBeenLastCalledWith(false);
});
test("Enter saves without inserting a newline", () => {
  const onTitleChange = jest.fn();
  render(<EditableTitle title="Original" onTitleChange={onTitleChange} />);
  const input = screen.getByRole("textbox");
  fireEvent.focus(input);
  input.textContent = "New title";
  fireEvent.keyDown(input, { key: "Enter" });
  expect(onTitleChange).toHaveBeenCalledWith("New title");
});
test("Escape restores the original title", () => {
  const onTitleChange = jest.fn();
  render(<EditableTitle title="Original" onTitleChange={onTitleChange} />);
  const input = screen.getByRole("textbox");
  fireEvent.focus(input);
  input.textContent = "Unsaved";
  fireEvent.keyDown(input, { key: "Escape" });
  expect(input).toHaveTextContent("Original");
  expect(onTitleChange).not.toHaveBeenCalledWith("Unsaved");
});
test("blank titles fall back to the previous title", () => {
  const onTitleChange = jest.fn();
  render(<EditableTitle title="Original" onTitleChange={onTitleChange} />);
  const input = screen.getByRole("textbox");
  fireEvent.focus(input);
  input.textContent = "   ";
  fireEvent.blur(input);
  expect(onTitleChange).toHaveBeenCalledWith("Original");
});
test("reflects external title updates and disables editing in read-only mode", () => {
  const onTitleChange = jest.fn();
  const { rerender } = render(
    <EditableTitle title="Original" onTitleChange={onTitleChange} disabled />,
  );
  expect(screen.getByRole("textbox")).toHaveAttribute(
    "contenteditable",
    "false",
  );
  rerender(
    <EditableTitle title="Updated" onTitleChange={onTitleChange} disabled />,
  );
  expect(screen.getByRole("textbox")).toHaveTextContent("Updated");
});
