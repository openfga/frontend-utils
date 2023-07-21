import { AuthorizationModel as OpenFGAAuthorizationModel } from "@openfga/sdk";

export type AuthorizationModel = Required<Omit<OpenFGAAuthorizationModel, "id">>