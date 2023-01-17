/* eslint-disable import/namespace */
import { CommandModule } from "yargs";
import * as transform from "./transform";

export const commands: CommandModule[] = [transform as CommandModule];
