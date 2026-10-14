import styles from "./Promotional.module.css";
import type { MyBlock } from "@/components/Canvas";
import Canvas from "@/components/Canvas";

type PromotionalProps = {
  data: any;
};

function PromotionalCentralSection({ data }: PromotionalProps) {
  const bgColour = data.backgroundColour.backgroundColour
    ? `#${data.backgroundColour.backgroundColour}`
    : "#0000000";

  return (
    <div
      className={`py-0 lg:py-12 my-9 ${styles.promotional}`}
      style={{ "--promo-bg": bgColour } as React.CSSProperties}
    >
      <div
        className={`  px-4  md:px-5 lg:w-2/3 ${styles.promo} ${data.centerText ? "text-center" : ""}`}
      >
        {data.canvas &&
          data.canvas.length > 0 &&
          data.canvas.map((canvasEl: MyBlock) => (
            <Canvas noWrap={true} key={canvasEl.id} data={[canvasEl]} />
          ))}
      </div>
    </div>
  );
}

export default PromotionalCentralSection;
