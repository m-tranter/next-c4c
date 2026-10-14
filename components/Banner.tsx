import CTA from "./CTA";
import styles from "@/components/Banner.module.css";

const defaultOpts: Intl.DateTimeFormatOptions = {
  month: "long",
  day: "numeric",
};

const fullOpts: Intl.DateTimeFormatOptions = {
  month: "long",
  day: "numeric",
  year: "numeric",
};

export default function Banner({ data }: any) {
  const from: Date = data.date.length && new Date(data.date[0].from);
  const to: Date = data.date.length && new Date(data.date[0].to);
  const thisYear = new Date().getFullYear();
  const fromYear = from.getFullYear();
  const toYear = to.getFullYear();
  const options =
    toYear !== thisYear || fromYear !== thisYear ? fullOpts : defaultOpts;
  let dateString = from.toLocaleDateString("en-GB", options);
  let toDateString = to.toLocaleDateString("en-GB", options);
  if (dateString !== toDateString) {
    dateString = `${dateString} - ${toDateString}`;
  }
  return (
    <div className={styles.banner}>
      <div className={`${styles.banner__content}`}>
        <div className={styles.banner__date}>{dateString}</div>
        <h2 className={styles.banner__title}>{data.title}</h2>
        {data.description && (
          <p className={styles.banner__description}>{data.description}</p>
        )}
        {data.callToAction.length && <CTA data={data.callToAction[0]} />}
      </div>
      <div className={styles["banner__image-wrap"]}>
        {data.image && (
          <img
            className={styles.banner__image}
            src={data.image.asset.sys.uri}
          />
        )}
      </div>
      <div className={styles.banner__overlay}></div>
    </div>
  );
}
