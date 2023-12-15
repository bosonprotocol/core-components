import { ComponentMeta, ComponentStory, Story } from "@storybook/react";
import React from "react";

import { ProductCardSkeleton as _ProductCardSkeleton } from "../components/skeleton/ProductCardSkeleton";
import { CollectionsCardSkeleton as _CollectionsCardSkeleton } from "../components/skeleton/CollectionsCardSkeleton";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/SkeletonCards",
  component: _ProductCardSkeleton
} as ComponentMeta<typeof _ProductCardSkeleton>;

const wrapper = (Story: Story) => (
  <div
    style={{
      height: "500px",
      display: "grid",
      gridTemplateColumns: "18.0625rem"
    }}
  >
    <Story />
  </div>
);

export const ProductCardSkeleton: ComponentStory<typeof _ProductCardSkeleton> =
  _ProductCardSkeleton;

// More on args: https://storybook.js.org/docs/react/writing-stories/args
ProductCardSkeleton.args = {
  withBottomText: true
};

ProductCardSkeleton.decorators = [(Story) => wrapper(Story)];

export const CollectionsCardSkeleton: ComponentStory<typeof _CollectionsCardSkeleton> =
  _CollectionsCardSkeleton;

// // More on args: https://storybook.js.org/docs/react/writing-stories/args
// CollectionsCardSkeleton.args = {
//   withBottomText: true
// };

CollectionsCardSkeleton.decorators = [(Story) => wrapper(Story)];