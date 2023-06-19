import pkg from "@@/package.json" assert { type: "json" };

import { program } from "@/program";
import { ProgramOptions } from "@/types";

export const getVersion = () => pkg.version;

export const getName = () => pkg.name;

export const getProgramOptions = () => program.opts() as ProgramOptions;
