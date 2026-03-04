import Box from "@mui/material/Box";
import { appColors } from "app/theme";
import styled from "styled-components";
import Button from "@mui/material/Button";

interface CategoryButtonProps {
  anchorEl?: boolean;
}
export const Container = styled(Box)`
  width: 100%;
  display: flex;
  position: relative;
  border-radius: 4px;
  background: ${appColors.SEARCH.CONTAINER_BACKGROUND};
  border: 1px solid ${appColors.SEARCH.DROPDOWN_BUTTON_BORDER_COLOR};

  @media (max-width: 767px) {
    width: 100%;
  }
`;

export const MobileContainer = styled(Box)`
  width: 100%;
  display: flex;
  position: relative;
  flex-direction: row;
  background: transparent;
`;

export const Input = styled.input`
  width: 100%;
  outline: none;
  font-size: 16px;
  font-weight: 400;
  border-style: none;
  padding: 8px 12px !important;
  color: ${appColors.SEARCH.INPUT_COLOR};
  background: ${appColors.SEARCH.INPUT_BACKGROUND_COLOR};

  &:focus::placeholder {
    opacity: 0.3;
  }
`;

export const MobileBackButton = styled.span`
  top: 5px;
  left: -16px;
  position: absolute;

  > svg {
    transform: rotate(180deg) scale(1.5);
    > path {
      fill: ${appColors.COMMON.PRIMARY_COLOR_1};
    }
  }
`;

export const CategoryButton = styled(Button)<CategoryButtonProps>`
  gap: 8px;
  width: 200px;
  display: flex;
  font-size: 14px;
  padding: 9px 12px;
  border-radius: 4px;
  margin-right: 14px;
  text-transform: capitalize;
  max-width: calc(50vw - 32px);
  justify-content: space-between;
  color: ${appColors.SEARCH.DROPDOWN_BUTTON_TEXT_COLOR};
  background: ${appColors.SEARCH.DROPDOWN_BUTTON_BACKGROUND_COLOR};
  border: 1px solid
    ${(props) =>
      props.theme.anchorEl
        ? appColors.SEARCH.DROPDOWN_BUTTON_TEXT_COLOR
        : appColors.SEARCH.DROPDOWN_BUTTON_BORDER_COLOR};

  &:hover {
    border-color: ${appColors.SEARCH.DROPDOWN_BUTTON_TEXT_COLOR};
  }

  .MuiButton-label {
    justify-content: space-between;
  }

  > span {
    font-weight: 400;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  svg:nth-of-type(2) {
    transform: ${(props) => ` rotate(${props.theme.anchorEl ? -180 : 0}deg);`};
  }
`;
