import { transformJSONToDSL } from "../language/pkg/js/transformer/jsontodsl";
import { AuthorizationModel } from "./authzmodel.types";

export const apiSyntaxToFriendlySyntax = (model: AuthorizationModel): string => transformJSONToDSL(model);
