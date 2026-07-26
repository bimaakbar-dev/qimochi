import { defineMdastPlugin } from "satteri";

export const satteriSteps = defineMdastPlugin({
  name: "satteri-steps",
  containerDirective(node, ctx) {
    if (node.name !== "steps") return;

    const component: any = {
      type: "mdxJsxFlowElement",
      name: "Steps",
      attributes: [],
      children: node.children,
    };
    ctx.replaceNode(node, component);
  },
});
