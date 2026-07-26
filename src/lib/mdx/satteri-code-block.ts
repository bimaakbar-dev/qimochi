// src/lib/mdx/satteri-code-block.ts
import { defineMdastPlugin } from "satteri";

export const satteriCodeBlock = defineMdastPlugin({
  name: "satteri-code-block",

  containerDirective(node: any, ctx: any) {
    if (node.name !== "code") return;

    const codeNode = (node.children ?? []).find((c: any) => c.type === "code");
    if (!codeNode) return;

    let title = "";

    for (const child of node.children ?? []) {
      const directives =
        child.type === "textDirective"
          ? [child]
          : child.type === "paragraph"
            ? (child.children ?? []).filter(
                (c: any) => c.type === "textDirective",
              )
            : [];

      for (const d of directives) {
        if (d.name === "title") {
          title = (d.children ?? [])
            .map((c: any) => c.value ?? "")
            .join("")
            .trim();
        }
      }
    }

    node.children = (node.children ?? []).filter((child: any) => {
      if (child.type === "textDirective") return false;
      if (child.type === "paragraph") {
        const onlyDirectives = (child.children ?? []).every(
          (c: any) => c.type === "textDirective",
        );
        return !onlyDirectives;
      }
      return true;
    });

    const attributes = [
      title && { type: "mdxJsxAttribute", name: "title", value: title },
    ].filter(Boolean);

    const component = {
      type: "mdxJsxFlowElement",
      name: "Code",
      attributes,
      children: [codeNode],
    };

    ctx.replaceNode(node, component);
  },
});
