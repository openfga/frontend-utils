import type { AuthorizationModel as ApiAuthorizationModel, TypeDefinition } from "@openfga/sdk";

type AuthorizationModel = {
  schema_version: Required<ApiAuthorizationModel["schema_version"]>;
  type_definitions: TypeDefinition[];
};

const entitlements = import("./entitlements.json") as unknown as Promise<AuthorizationModel>;
const expenses = import("./expenses.json") as any as Promise<AuthorizationModel>;
const gdrive = import("./gdrive.json") as unknown as Promise<AuthorizationModel>;
const generic = import("./generic.json") as unknown as Promise<AuthorizationModel>;
const github = import("./github.json") as unknown as Promise<AuthorizationModel>;
const iot = import("./iot.json") as Promise<AuthorizationModel>;
const slack = import("./slack.json") as unknown as Promise<AuthorizationModel>;
const customRoles = import("./custom-roles.json") as unknown as Promise<AuthorizationModel>;

const sampleAuthorizationModels: Record<string, Promise<Required<Omit<AuthorizationModel, "id">>>> = {
  entitlements,
  expenses,
  gdrive,
  generic,
  github,
  iot,
  slack,
  customRoles,
};

export default sampleAuthorizationModels;
