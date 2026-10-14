import React from "react";
import styles from "./Panel.module.css";
import Icon from "./shared/Icon";
import {
  InformationIcon,
  WarningIcon,
  EditIcon,
  TickIcon,
  CloseIcon,
} from "@/components/Icons/PanelIcons";

// Panel type to icon mapping
const panelIcons = {
  info: InformationIcon,
  warning: WarningIcon,
  note: EditIcon,
  success: TickIcon,
  error: CloseIcon,
};

export type PanelType = "info" | "warning" | "note" | "success" | "error";

type Props = {
  $value?: Record<string, unknown>;
  children?: string | React.ReactNode;
  className?: string;
};

function Panel({ $value, children, className }: Props) {
  const panelType = ($value?.panelType as PanelType) || "info";
  const IconComponent = panelIcons[panelType];

  const calloutClasses =
    `my-2 ${styles.panel} ${styles[panelType]} ${className || ""}`.trim();

  return (
    <div className={calloutClasses} role="alert">
      <Icon size="lg" className={styles.svg}>
        <IconComponent />
      </Icon>
      <div className={styles.calloutContent}>{children}</div>
    </div>
  );
}

export default Panel;
