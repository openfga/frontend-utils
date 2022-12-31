/* eslint-disable import/namespace */
import { CommandModule } from "yargs";
import * as dslToJSON from "./dslJson";
import * as jsonToDSL from "./jsonDsl";

export const commands: CommandModule[] = [
  dslToJSON as CommandModule,
  jsonToDSL as CommandModule,
];
