"use client";
import { useState } from "react";
import type { Entry } from "contensis-delivery-api/lib/models";
import Icon from "@/components/shared/Icon";
import styles from "./Alert.module.css";
import CloseBtn from "./Icons/CloseBtn";
import Link from "next/link";

type Props = { alert: Entry };

function Alert({ alert }: Props) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  const links = alert.callToAction.map((cta: any) => (
    <Link
      className="pt-3"
      key={cta.link.sys.id}
      target="_self"
      href={cta.link?.sys?.uri || cta.link?.sys?.allUris[0] || cta.link.url}
      style={{ color: "currentColor" }}
    >
      {cta.link.title}
    </Link>
  ));
  return (
    <div
      className={`px-7 2xl:px-2 py-4 mt-0 relative z-50 ${styles[alert.type]}`}
      role="alertdialog"
      aria-labelledby="alert-title"
    >
      <div className="flex max-w-(--page-max) mx-auto py-3 px-2">
        <div
          className={`leading-6 font-normal flex flex-col  flex-1 focus:outline-none ${styles.content}`}
        >
          <p
            id="alert-title"
            className={`leading-8 pb-3 font-bold  ${styles.alertTitle}`}
          >
            {alert.entryTitle}
          </p>
          <p id="alert-desc">{alert.content}</p>
          {links?.length && links}
        </div>
        <button
          className={`${styles.button} w-10 h-10 rounded-full grid text-gray-900 bg-black/10 place-items-center`}
          onClick={() => setVisible(false)}
        >
          <span className="visually-hidden">Close</span>
          <Icon size="md">
            <CloseBtn />
          </Icon>
        </button>
      </div>
    </div>
  );
}
export default Alert;
