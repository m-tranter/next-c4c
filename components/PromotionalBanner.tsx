import styles from "./Promotional.module.css";

import type { Asset } from "@/lib/seo";
type PromotionalProps = {
  data: {
    bannerImage: Asset;
    name: string;
    html?: string;
    text?: string;
    textBackground?: { backgroundColour: string };
  };
};

export default function PromotionalBanner({ data }: PromotionalProps) {
  const bgColor = data?.textBackground?.backgroundColour
    ? `#${data.textBackground.backgroundColour}`
    : "#000";
  return (
    <div className={`relative full-bleed ${styles.promotional}`}>
      <img
        alt={data.bannerImage.altText || "banner"}
        src={data.bannerImage.asset.sys.uri}
        className="w-full h-100 object-cover"
      />
      <div className="lg:absolute lg:inset-0  lg:flex lg:items-center w-full lg:w-auto lg:justify-center">
        <div
          className="bg-(--color-s2-bg) lg:w-fit text-white lg:rounded-lg lg:mx-auto  lg:max-w-[80vw] p-4 lg:my-4"
          style={{
            backgroundColor: bgColor,
          }}
        >
          <p className={styles.promo_p}>{data.text}</p>
        </div>
      </div>
    </div>
  );
}
