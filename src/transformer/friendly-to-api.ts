import transformDslToJSON from "../language/pkg/js/transformer/dsltojson";
import { AuthorizationModel } from "./authzmodel.types";

export const friendlySyntaxToApiSyntax = (dsl: string): AuthorizationModel =>
    transformDslToJSON(dsl) as AuthorizationModel;
