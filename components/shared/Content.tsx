import React from "react";
import type { Block } from "@contensis/canvas-react";

const decorators = {
  abbreviation: { name: "abbr" },
  code: { name: "code" },
  emphasis: { name: "em" },
  keyboard: { name: "kbd" },
  strikethrough: { name: "s" },
  strong: { name: "strong" },
  subscript: { name: "sub" },
  superscript: { name: "sup" },
  underline: { name: "u" },
  variable: { name: "var" },
} as const;

const tagMap = {
  _listItem: "li",
  _paragraph: "p",
  _table: "table",
  _tableBody: "tbody",
  _tableCaption: "caption",
  _tableCell: "td",
  _tableHeader: "thead",
  _tableHeaderCell: "th",
  _tableRow: "tr",
  _link: "a",
  _image: "img",
};

type DecoratorKey = keyof typeof decorators;
type TagKey = keyof typeof tagMap;

type LooseProperties = {
  decorators?: DecoratorKey[];
  id?: string;
  [key: string]: unknown;
};

type Tag = {
  name?: string;
  attr?: Record<string, unknown>;
};

const attrMap: Record<string, string> = { class: "className", for: "htmlFor" };

const toReactProps = (
  attr?: Record<string, unknown> | null,
): Record<string, unknown> | null => {
  if (!attr) return null;
  return Object.fromEntries(
    Object.entries(attr).map(([k, v]) => [attrMap[k] ?? k, v]),
  );
};

let id: string | undefined = undefined;

const renderObj = (obj: Block, key?: number | string): React.ReactNode => {
  if (!obj) return null;
  let tag: Tag = { name: tagMap[obj.type as TagKey] };
  switch (obj.type) {
    case "_heading":
      tag.name = `h${obj.properties?.level}`;
      break;
    case "_paragraph":
      if (obj.properties?.paragraphType) {
        tag.attr = { class: "lead" };
      }
      break;
    case "_list":
      tag.name = obj.properties?.listType === "unordered" ? "ul" : "ol";
      break;

    case "_image":
      id = obj.id;
      tag.attr = {
        alt: obj.value?.altText || obj.value?.asset?.entryTitle,
        src: obj.value?.asset?.sys?.uri ?? "",
      };
      break;
    case "_anchor":
      id = obj.properties?.id;
      break;
    case "_link":
      tag.attr = { href: obj.properties?.link?.sys?.uri ?? "" };
      break;
    case "_divider":
      return React.createElement("hr", { key });
    case "_tableHeaderCell":
      tag.attr = { scope: "col" };
      break;
    case "_tableCaption":
      tag.attr = { class: "visually-hidden" };
      break;
    default:
  }

  const children =
    typeof obj.value === "string"
      ? obj.value
      : Array.isArray(obj.value)
        ? obj.value.map((child, i) => renderObj(child as Block, i))
        : renderObj(obj.value as Block);

  const props = obj.properties as LooseProperties | undefined;
  const decs = props?.decorators ?? [];

  const baseTags =
    tag.name === "table"
      ? [{ name: "div", attr: { className: "overflow-x-auto" } }, tag]
      : [tag];

  const tags = decs.reduce<Tag[]>(
    (acc, dec) => [
      ...acc,
      {
        ...(decorators[dec] || { name: "span" }),
        attr: props?.[dec] as Record<string, unknown> | undefined,
      },
    ],
    tag.name ? baseTags : [],
  );

  if (!tags.length) return children;
  if (id) {
    tags[0].attr = { ...tags[0]?.attr, id };
    id = undefined;
  }

  return tags.reduceRight<React.ReactNode>(
    (inner, t, i) =>
      React.createElement(
        t.name!,
        { ...toReactProps(t.attr), key: i === 0 ? key : undefined },
        inner,
      ),
    children,
  );
};

type ContentProps = {
  data: Block;
  $className?: string;
};

export default function Content({ data, $className }: ContentProps) {
  return $className ? (
    <div className={$className}>{renderObj(data)}</div>
  ) : (
    <>{renderObj(data)}</>
  );
}
