import { friendlySyntaxToApiSyntax } from "./friendly-to-api";
import { apiSyntaxToFriendlySyntax } from "./api-to-friendly";

const transformer = {
  apiSyntaxToFriendlySyntax,
  friendlySyntaxToApiSyntax,
};

export default transformer;
