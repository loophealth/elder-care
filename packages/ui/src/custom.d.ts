/**
 * This doesn't actually do anything. None of the files in this project are
 * processed by TypeScript. Instead, they are processed by the build pipeline
 * that imports the code from this project.
 *
 * This is just here to tell VS Code to stop throwing errors when it sees an SVG
 * import inside this project.
 */
declare module "*.svg" {
  import * as React from "react";

  const content: string;
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  export default content;
}
