import { SVGProps } from "react";

export type Locale = "zh-CN" | "en-US" | "ja-JP";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
