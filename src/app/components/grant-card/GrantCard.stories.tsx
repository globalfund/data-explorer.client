import type { Meta, StoryObj } from "@storybook/react";

import { GrantCard } from "app/components/grant-card";

const meta = {
  title: "Components/Grant card",
  component: GrantCard,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof GrantCard>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {
  args: {
    status: "Active",
    location: "Afghanistan",
    rating: "B1",
    component: "HIV",
    number: "AZE-M-MOH",
    principalRecipient: "Ministry of Health Ghana",
    startDate: "12.02.2021",
    endDate: "12.02.2023",
    title:
      "Scaling up the response to the HIV epidemic through strengthening national capacities, prevention and treatment services for most at risk population and maintaining access to and quality of essential MDR/XDR TB services in the Republic of Azerbaijan",
    signed: 1000000,
    disbursed: 1000000,
    percentage: 80.5,
  },
};
