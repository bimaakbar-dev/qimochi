import { defineMdastPlugin } from "satteri";

const VALID_TYPES = new Set([
  "note",
  "info",
  "tip",
  "warning",
  "danger",
  "important",
  "caution",
]);

export const satteriCallout = defineMdastPlugin({
  name: "satteri-callout",
  containerDirective(node, ctx) {
    const type = node.name;
    if (!VALID_TYPES.has(type)) return;

    const component: any = {
      type: "mdxJsxFlowElement",
      name: "Callout",
      attributes: [{ type: "mdxJsxAttribute", name: "type", value: type }],
      children: node.children,
    };

    ctx.replaceNode(node, component);
  },
});
