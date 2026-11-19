import React from "react";
import { colors } from "app/theme";
import Box from "@mui/material/Box";
import { styled } from "styled-components";
import { Dropdown } from "app/components/dropdown";
import { NavLink, useParams } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { HEADER_HEIGHT } from "app/components/header-menu/data";
import { DetailPageTabsProps } from "app/components/detail-page-tabs/data";

const ButtonTab = styled(NavLink)`
  font-size: 14px;
  font-weight: 400;
  padding: 5px 24px;
  border-radius: 4px;
  letter-spacing: 0.5px;
  text-decoration: none;
  color: ${({ theme }) => (theme.active ? "#fff" : "#000")};
  background: ${({ theme }) => (theme.active ? "#000" : "#fff")};
  border: 1px solid ${({ theme }) => (theme.active ? "#000" : "#DFE3E5")};

  @media (max-width: 920px) {
    padding: 5px 12px;
  }

  &:hover {
    color: #fff;
    background: #000;
  }
`;

export const DetailPageTabs: React.FC<DetailPageTabsProps> = (
  props: DetailPageTabsProps,
) => {
  const mobile = useMediaQuery("(max-width:767px)");
  const params = useParams<{ id: string; tab: string }>();

  return (
    <Box
      zIndex="100"
      width="100%"
      display="flex"
      padding="20px 0"
      position="sticky"
      top={HEADER_HEIGHT}
      bgcolor={colors.primary.white}
      justifyContent="space-between"
      sx={{
        "> button": {
          width: "fit-content",
        },
        "@media (max-width: 767px)": {
          flexWrap: "wrap",
        },
      }}
    >
      {props.dropdown && (
        <Box
          sx={{
            "@media (max-width: 767px)": {
              width: "100%",
              marginBottom: "10px",
              "> button": {
                minWidth: "calc(100vw - 32px)",
              },
            },
          }}
        >
          <Dropdown
            dropdownItems={props.dropdown.dropdownItems}
            dropdownSelected={props.dropdown.dropdownSelected}
            handleDropdownChange={props.dropdown.handleDropdownChange}
            width={
              !mobile ? (props.dropdown.width ?? 223) : window.innerWidth - 32
            }
          />
        </Box>
      )}
      <Box
        gap="10px"
        display="flex"
        sx={{
          "@media (max-width: 767px)": {
            flexWrap: "wrap",
          },
        }}
      >
        {props.tabs.map((tab) => (
          <ButtonTab
            key={tab.label}
            to={`${props.baseRoute}/${params.id}${tab.link}`}
            theme={{
              active: props.activeTab === tab.link.replace("/", ""),
            }}
            data-cy="page-tab-button"
          >
            {tab.label}
          </ButtonTab>
        ))}
      </Box>
    </Box>
  );
};
