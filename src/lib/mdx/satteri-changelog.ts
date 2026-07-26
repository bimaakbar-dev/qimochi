import { defineMdastPlugin } from "satteri";

export const satteriChangelog = defineMdastPlugin({
  name: "satteri-changelog",
  containerDirective(node, ctx) {
    if (node.name === "changelog") {
      ctx.setProperty(node, "data", {
        ...(node.data || {}),
        hName: "ChangelogContainer",
      });

      if (node.children) {
        node.children.forEach((child) => {
          if (child.type === "containerDirective" && child.name === "log") {
            let logTitle = "Update";
            let contentChildren = child.children || [];

            if (contentChildren.length > 0 && contentChildren[0].type === "paragraph") {
              const firstPara = contentChildren[0] as any;
              if (firstPara.children && firstPara.children.length > 0) {
                logTitle = firstPara.children[0].value || "Update";
                contentChildren = contentChildren.slice(1);
              }
            }

            const existingData = child.data || {};
            const existingProps = (existingData as any).hProperties || {};

            ctx.setProperty(child, "data", {
              ...existingData,
              hName: "ChangelogItem",
              hProperties: {
                ...existingProps,
                title: logTitle,
              },
            });

            ctx.setProperty(child, "children", contentChildren);
          }
        });
      }
    }
  },
});
