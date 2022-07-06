import { ComponentStory, ComponentMeta } from "@storybook/react";

import ConnectWallet from "../../components/connectWallet";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/Buttons/ConnectWallet",
  component: ConnectWallet
} as ComponentMeta<typeof ConnectWallet>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ConnectWallet> = () => <ConnectWallet />;

export const Primary: ComponentStory<typeof ConnectWallet> = Template.bind({});
