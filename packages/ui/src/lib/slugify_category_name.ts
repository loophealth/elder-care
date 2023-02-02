import slugify from "slugify";

export const slugifyCategoryName = (name: string) => {
  return slugify(name, { lower: true, strict: true, trim: true });
};
