import { ReactElement } from "react";

type Props = {
  caption: string;
  ths: ReactElement;
  rows: ReactElement[];
  $className?: string;
};

function Table({ caption, ths, rows, $className }: Props) {
  return (
    <div className={`${$className} w-full overflow-x-auto`}>
      <table className="min-w-full">
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>{ths}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export default Table;
