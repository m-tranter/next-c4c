import styles from "./PromotionalPullColumn.module.css";
import type { MyBlock } from "@/components/Canvas";
import Canvas from "@/components/Canvas";

const bgColours: Record<string, string> = {
  green: "#AA272F",
  purple: "#6E2585",
  blue: "#2525a9",
};

type PromotionalPullColumnProps = {
  data: any;
};

function PromotionalPullColumn({ data }: PromotionalPullColumnProps) {
  const bgColour =
    bgColours[data.backgroundColour.backgroundColour] ||
    `#${data.backgroundColour.backgroundColour}`;
  const imageSrc = data.image?.asset?.sys?.uri;
  const imageAlt = data.image?.altText || "Promotional image";

  const contentColumn = (
    <div className={`${styles.column} ${styles.content}`}>
      <div className={styles.contentInner}>
        <div className={`${styles.text} px-7 `}>
          {data.canvas &&
            data.canvas.length > 0 &&
            data.canvas.map((data: MyBlock) => (
              <Canvas noWrap={true} key={data.id} data={[data]} />
            ))}
        </div>
      </div>
    </div>
  );

  const imageColumn = (
    <div className={styles.column}>
      {imageSrc && (
        <img
          className={`${styles.image} md:rounded-lg lg:rounded-none ${data.orientation === "right" ? "lg:rounded-l-lg" : "lg:rounded-r-lg"} `}
          src={imageSrc}
          alt={imageAlt}
        />
      )}
    </div>
  );

  return (
    <div
      className={`my-9 w-full  pt-0 pb-9 md:py-9 `}
      style={{ backgroundColor: bgColour }}
    >
      <div
        className={`xl:px-0 md:gap-8 flex items-center flex-col lg:flex-row lg:flex-wrap `}
      >
        {data.orientation === "right" ? (
          <>
            {contentColumn}
            {imageColumn}
          </>
        ) : (
          <>
            {imageColumn}
            {contentColumn}
          </>
        )}
      </div>
    </div>
  );
}

export default PromotionalPullColumn;
