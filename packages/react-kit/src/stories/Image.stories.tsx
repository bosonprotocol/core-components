import React from "react";
import { ComponentStory, ComponentMeta, Story } from "@storybook/react";

import { Image as ImageComponent } from "../components/image/Image";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/Image",
  component: ImageComponent
} as ComponentMeta<typeof ImageComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ImageComponent> = (args) => (
  <ImageComponent {...args} />
);

export const Image: ComponentStory<typeof ImageComponent> = Template.bind({});
export const ImageLoading: ComponentStory<typeof ImageComponent> =
  Template.bind({});
export const ImageError: ComponentStory<typeof ImageComponent> = Template.bind(
  {}
);

const wrapper = (Story: Story) => (
  <div style={{ width: "22.75rem" }}>
    <Story />
  </div>
);

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Image.args = {
  src: "https://images.unsplash.com/photo-1613771404721-1f92d799e49f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cG9rZW1vbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
  alt: "image success"
};
Image.decorators = [(Story) => wrapper(Story)];
ImageLoading.args = {
  src: "",
  alt: "image loading"
};
ImageLoading.decorators = [(Story) => wrapper(Story)];
ImageError.args = {
  src: "",
  alt: "image loading",
  errorConfig: {
    errorImageText: "IMAGE NOT AVAILABLE",
    errorIcon: (
      <div
        style={{
          fontSize: "3rem"
        }}
      >
        🤷🏻
      </div>
    )
  }
};
ImageError.decorators = [(Story) => wrapper(Story)];
