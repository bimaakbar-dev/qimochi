// src/lib/mdx/satteri-filetree.ts
import { defineMdastPlugin } from "satteri";

export const satteriFileTree = defineMdastPlugin({
  name: "satteri-filetree",
  containerDirective(node: any, ctx: any) {
    if (node.name !== "filetree") return;
    const component: any = {
      type: "mdxJsxFlowElement",
      name: "FileTree",
      attributes: [],
      children: node.children || [],
    };
    ctx.replaceNode(node, component);
  },
});
