// src/lib/mdx/satteri-quote.ts
import { defineMdastPlugin } from "satteri";

function extractDirectives(children: any[]) {
  let author = "";
  let citeUrl = "";
  let citeLabel = "";
  const cleanedChildren: any[] = [];

  for (const child of children) {
    if (child.type === "paragraph") {
      const newParaChildren: any[] = [];

      for (const sub of child.children) {
        if (sub.type === "textDirective") {
          if (sub.name === "author") {
            const textNode = sub.children?.find((c: any) => c.type === "text");
            if (textNode) author = textNode.value;
          } else if (sub.name === "cite") {
            let rawText = "";
            const extractText = (nodes: any[]) => {
              for (const n of nodes) {
                if (n.type === "text") rawText += n.value;
                else if (n.children) extractText(n.children);
              }
            };

            extractText(sub.children || []);

            if (rawText) {
              if (rawText.includes("|")) {
                const parts = rawText.split("|");
                citeLabel = parts[0].trim();
                citeUrl = parts.slice(1).join("|").trim();
              } else if (
                rawText.startsWith("http://") ||
                rawText.startsWith("https://")
              ) {
                citeUrl = rawText.trim();
                citeLabel = "Sumber";
              } else {
                citeLabel = rawText.trim();
              }
            }
          }
        } else {
          newParaChildren.push(sub);
        }
      }

      if (newParaChildren.length > 0) {
        cleanedChildren.push({ ...child, children: newParaChildren });
      }
    } else {
      cleanedChildren.push(child);
    }
  }
  return { author, citeUrl, citeLabel, cleanedChildren };
}

export const satteriQuote = defineMdastPlugin({
  name: "satteri-quote",
  containerDirective(node: any, ctx: any) {
    if (node.name !== "quote") return;

    const { author, citeUrl, citeLabel, cleanedChildren } = extractDirectives(
      node.children || [],
    );

    const component: any = {
      type: "mdxJsxFlowElement",
      name: "Blockquote",
      attributes: [],
      children: cleanedChildren,
    };

    if (author)
      component.attributes.push({
        type: "mdxJsxAttribute",
        name: "authorSlug",
        value: author,
      });
    if (citeUrl)
      component.attributes.push({
        type: "mdxJsxAttribute",
        name: "cite",
        value: citeUrl,
      });
    if (citeLabel)
      component.attributes.push({
        type: "mdxJsxAttribute",
        name: "citeLabel",
        value: citeLabel,
      });

    ctx.replaceNode(node, component);
  },
});
