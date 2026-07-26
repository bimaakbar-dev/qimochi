import { defineMdastPlugin } from "satteri";

function extractText(node: any): string {
  if (!node) return "";
  if (typeof node.value === "string") return node.value;
  if (Array.isArray(node.children)) {
    return node.children.map(extractText).join("");
  }
  return "";
}

export const satteriTabs = defineMdastPlugin({
  name: "satteri-tabs",
  containerDirective(node, ctx) {
    if (node.name !== "tabs") return;

    ctx.setProperty(node, "data", {
      ...(node.data || {}),
      hName: "TabsContainer",
    });

    if (!node.children) return;

    node.children.forEach((child) => {
      if (child.type !== "containerDirective" || child.name !== "tab") return;

      let contentChildren = child.children || [];

      const attrLabel = (child as any).attributes?.label as string | undefined;
      let tabLabel = attrLabel?.trim();

      if (!tabLabel) {
        const firstNode = contentChildren[0] as any;
        if (firstNode?.type === "paragraph" && firstNode.data?.directiveLabel) {
          const text = extractText(firstNode).trim();
          if (text) {
            tabLabel = text;
            contentChildren = contentChildren.slice(1);
          }
        }
      }

      if (!tabLabel) tabLabel = "Tab";

      const existingData = child.data || {};
      const existingProps = (existingData as any).hProperties || {};

      ctx.setProperty(child, "data", {
        ...existingData,
        hName: "TabItem",
        hProperties: {
          ...existingProps,
          label: tabLabel,
        },
      });
      ctx.setProperty(child, "children", contentChildren);
    });
  },
});
