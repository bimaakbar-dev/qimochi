// src/lib/mdx/satteri-details.ts
import { defineMdastPlugin } from "satteri";

function extractSummaryFromChildren(children: any[]): {
  summary: string;
  newChildren: any[];
} {
  let summary = "Details";
  const newChildren: any[] = [];

  for (const child of children) {
    if (child.type === "paragraph") {
      let foundSummary = false;
      const newParagraphChildren: any[] = [];

      for (const sub of child.children) {
        if (sub.type === "textDirective" && sub.name === "summary") {
          const textNode = sub.children?.find((c: any) => c.type === "text");
          if (textNode) summary = textNode.value;
          foundSummary = true;
        } else {
          newParagraphChildren.push(sub);
        }
      }

      if (!foundSummary && newParagraphChildren.length > 0) {
        newChildren.push({ ...child, children: newParagraphChildren });
      } else if (foundSummary && newParagraphChildren.length > 0) {
        newChildren.push({ ...child, children: newParagraphChildren });
      }
    } else {
      newChildren.push(child);
    }
  }

  return { summary, newChildren };
}

export const satteriDetails = defineMdastPlugin({
  name: "satteri-details",
  containerDirective(node: any, ctx: any) {
    if (node.name !== "details") return;

    const { summary, newChildren } = extractSummaryFromChildren(
      node.children || [],
    );

    const component: any = {
      type: "mdxJsxFlowElement",
      name: "Details",
      attributes: [
        { type: "mdxJsxAttribute", name: "summary", value: summary },
      ],
      children: newChildren,
    };
    ctx.replaceNode(node, component);
  },
});
