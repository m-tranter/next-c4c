import Content from "@/components/shared/Content";
import type { Block } from "@contensis/canvas-react";
import styles from "@/components/Canvas.module.css";

type Field = {
  id: string;
  name?: { "en-GB": string };
  dataFormat?: string;
  dataType?: string;
};

type Entry = {
  sys?: { id: string };
  [key: string]: any;
};

type Props = {
  caption: string;
  fields: Field[];
  entries: Entry[];
  fullBleed?: boolean;
};

const makeTd = (data: any, dataType: string) => {
  if (data === null || data === undefined) return "";
  if (dataType === "entry") {
    return data.entryTitle;
  }
  if (dataType === "dateTimeArray") {
    return (
      <ul>
        {data.map((li: string, i: number) => (
          <li key={i}>{new Date(li).toLocaleDateString("en-gb")}</li>
        ))}
      </ul>
    );
  }
  if (dataType.startsWith("component")) {
    return dataType.replace("component.", "");
  }
  if (dataType === "image") {
    return (
      <img
        className="border-rounded"
        src={data?.asset?.sys?.uri}
        alt={data?.asset?.altText ?? ""}
      />
    );
  }

  if (dataType === "canvas") {
    return data.map((e: Block) => <Content key={e.id} data={e} />);
  }

  if (dataType === "stringArray") {
    return (
      <ul>
        {data.map((li: string, i: number) => (
          <li key={i}>{li}</li>
        ))}
      </ul>
    );
  }
  if (typeof data === "number") {
    return <>{dataType === "decimal" ? data.toFixed(2) : data}</>;
  }

  if (typeof data === "string") {
    switch (dataType) {
      case "dateTime":
        return <>{new Date(data).toLocaleDateString("en-GB")}</>;
      case "email":
        return <a href={`mailto:${data}`}>{data}</a>;
      case "html":
        return <div dangerouslySetInnerHTML={{ __html: data }} />;
      case "url":
        return <a href={data}>{data}</a>;
      default:
        return <>{data}</>;
    }
  }
  // Catch-all: prevents objects leaking as React children
  return <>{JSON.stringify(data)}</>;
};

function GenericTable({ caption, fields, entries, fullBleed }: Props) {
  const ths = fields.map((e) => (
    <th scope="col" key={e.id}>
      {e.name?.["en-GB"] || e.id}
    </th>
  ));

  const rows = entries.slice(0, 5).map((row) => {
    return (
      <tr key={row.sys?.id}>
        {fields.map((e) => (
          <td key={e.id}>
            {makeTd(row[e.id], e.dataFormat || e.dataType || "")}
          </td>
        ))}
      </tr>
    );
  });

  return (
    <div className={`${fullBleed ? "breakout-wrapper" : ""}`}>
      <div className={`${fullBleed ? "breakout" : ""}`}>
        <div className={styles["table-wrap"]}>
          <table>
            <caption className="visually-hidden">{caption}</caption>
            <thead>
              <tr>{ths}</tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GenericTable;
