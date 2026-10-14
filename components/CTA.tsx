import styles from "./CTA.module.css";
import Link from "next/link";
import Button from "@/components/shared/Button";

type LinkValue = {
  url?: string;
  sys?: {
    uri?: string;
  };
  entryTitle?: string;
  title?: string;
};

type CTAValue = {
  link?: LinkValue;
  title?: string;
};

type Props = {
  id?: string;
  data: CTAValue;
};

const CTA = ({ data }: Props) => {
  const href = data?.link?.url || data?.link?.sys?.uri || "";
  const label = data?.title || data?.link?.title || "Read more";
  return (
    <div className={styles.ctaContent}>
      <Link target="_self" href={href}>
        <Button $variant="2">
          <>{label}</>
        </Button>
      </Link>
    </div>
  );
};

export default CTA;
