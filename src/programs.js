import { APP_DEFINITIONS } from "./apps/manifest.js";

const PROGRAM_FIELDS = ["type", "title", "width", "height", "icon", "label"];

export const PROGRAMS = APP_DEFINITIONS
  .filter(({ showInProgramManager }) => showInProgramManager !== false)
  .map((definition) => Object.fromEntries(
    PROGRAM_FIELDS.map((field) => [field, definition[field]])
  ));
