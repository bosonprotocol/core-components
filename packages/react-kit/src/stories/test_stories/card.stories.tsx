import { ComponentStory, ComponentMeta } from "@storybook/react";

import Card from "../../components/card/card";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Sample Stories/Card",
  component: Card
} as ComponentMeta<typeof Card>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Card> = (args) => <Card {...args} />;

export const Primary: ComponentStory<typeof Card> = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  title: "card title",
  image:
    "https://images.unsplash.com/photo-1636718282214-0b4162a154f0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=302&q=80",
  link: "/#",
  price: "1.4",
  onBuy: () => {
    console.log("buy");
  }
};
