import { type SchemaTypeDefinition } from "sanity";

import { blockContent } from "./blockContent";
import { categoryType } from "./categoryType";
import { postType } from "./postType";
import { authorType } from "./authorType";
import { legalPageType } from "./legalPageType";
import { jobPostingType } from "./jobPostingType";
import { helpCenterCategoryType } from "./helpCenterCategoryType";
import { helpArticleType } from "./helpArticleType";
import { callout } from "./callout";
import { youtube } from "./youtube";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContent,
    categoryType,
    postType,
    authorType,
    helpCenterCategoryType,
    helpArticleType,
    legalPageType,
    jobPostingType,
    callout,
    youtube,
  ],
};
