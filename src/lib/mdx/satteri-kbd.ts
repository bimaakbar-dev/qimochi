// src/lib/mdx/satteri-kbd.ts
import { defineMdastPlugin } from "satteri";

export const satteriKbd = defineMdastPlugin({
  name: "satteri-kbd",
  textDirective(node: any, ctx: any) {
    if (node.name !== "kbd") return;

    let keys = "";
    if (node.children && node.children[0] && node.children[0].type === "text") {
      keys = node.children[0].value;
    }

    const component: any = {
      type: "mdxJsxTextElement",
      name: "Kbd",
      attributes: [{ type: "mdxJsxAttribute", name: "keys", value: keys }],
      children: [],
    };
    ctx.replaceNode(node, component);
  },
});
