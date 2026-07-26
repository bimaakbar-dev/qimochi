// src/components/layout/MDXComponents.ts

import H1 from "@/components/mdx/H1.astro";
import H2 from "@/components/mdx/H2.astro";
import H3 from "@/components/mdx/H3.astro";
import H4 from "@/components/mdx/H4.astro";
import H5 from "@/components/mdx/H5.astro";
import H6 from "@/components/mdx/H6.astro";
import Blockquote from "./Blockquote.astro";
import Callout from "./Callout.astro";
import Changelog from "./Changelog.astro";
import Code from "./Code.astro";
import Details from "./Details.astro";
import Figure from "./Figure.astro";
import FileTree from "./FileTree.astro";
import Footnotes from "./Footnotes.astro";
import Kbd from "./KBD.astro";
import Link from "./Link.astro";
import Steps from "./Steps.astro";
import Table from "./Table.astro";
import Video from "./Video.astro";
import LinkCard from "./LinkCard.astro";
import Tabs from "./Tabs.astro";
import CardGrid from "./CardGrid.astro";

export const components = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  Callout,
  Details,
  ChangelogContainer: Changelog,
  ChangelogItem: Changelog,
  Steps,
  a: Link,
  FileTree,
  Code,
  footnotes: Footnotes,
  Footnotes,
  Kbd,
  Video,
  table: Table,
  Blockquote,
  Figure,
  LinkCard,
  TabsContainer: Tabs, 
  TabItem: Tabs ,
  CardGrid,
};

export type MDXComponents = typeof components;
