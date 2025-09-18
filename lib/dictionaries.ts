import { Locale } from "@/types";

const dictionaries = {
  "zh-CN": () => import("@/dictionaries/zh-CN.json").then((module) => module.default),
  "en-US": () => import("@/dictionaries/en-US.json").then((module) => module.default),
  "ja-JP": () => import("@/dictionaries/ja-JP.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
