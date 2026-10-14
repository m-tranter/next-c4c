import React, { useState } from "react";
import Button from "./shared/Button";
import Content from "@/components/shared/Content";
import styles from "./Accordion.module.css";
import Icon from "@/components/shared/Icon";
import MinusIcon from "@/components/Icons/MinusIcon";
import PlusIcon from "@/components/Icons/PlusIcon";
import type { Block } from "@contensis/canvas-react";

// Check if title has {openAll} trigger
const hasOpenAllTrigger = (title?: string) =>
  !!title && title.includes("{openAll}");

// Type for accordion item data
type AccordionItemData = {
  id?: string;
  title: string;
  value?: unknown[]; // Canvas data from canvas component
  accordionContent?: React.ReactElement | Block[] | { __html: string };
};

// Props for Accordion component
type AccordionProps = {
  data: {
    items?: AccordionItemData[];
    title?: string;
  };
  id?: string;
};

const Accordion = ({ data, id }: AccordionProps) => {
  const items = (data?.items as AccordionItemData[]) ?? [];

  // Initialize all items as closed (false)
  const [openState, setOpenState] = useState<boolean[]>(() =>
    items.map(() => false),
  );

  const showExpandAll = data?.title && hasOpenAllTrigger(data.title);
  const allOpen = openState.every(Boolean) && items.length > 0;
  const btnState = allOpen ? "Close all" : "Open all";

  const toggleOne = (index: number) => {
    setOpenState((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleToggleAll = () => {
    setOpenState(items.map(() => !allOpen));
  };

  // Display title without {openAll} trigger
  const displayTitle = data?.title?.replace("{openAll}", "").trim();

  // Determine how to render content
  const renderContent = (item: AccordionItemData) => {
    // Case 1: accordionContent is a React element (from ListingPlaceholder)
    if (React.isValidElement(item.accordionContent)) {
      return item.accordionContent;
    }

    // Case 2: From canvas component - accordionContent contains Block[] data
    if (item.accordionContent && Array.isArray(item.accordionContent)) {
      return item.accordionContent.map((data) => {
        return <Content key={data.id} data={data} />;
      });
    }

    return null;
  };

  return (
    <>
      {displayTitle?.length && <h2>{displayTitle}</h2>}
      <div className={styles.accordionWrapper}>
        {showExpandAll && (
          <div className={styles.expandAllBtn}>
            <Button
              $variant="2"
              className={styles.accordionToggle}
              onClick={handleToggleAll}
            >
              <> {btnState}</>
            </Button>
          </div>
        )}
        <div className={styles.accordionItems}>
          {items.map((item, index) => {
            const contentId = item.id || `${id}_${index}`;
            const isOpen = openState[index];

            return (
              <details
                className={styles.accordionItem}
                key={contentId}
                open={isOpen}
              >
                <summary
                  className={styles.accordionItemButton}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleOne(index);
                  }}
                >
                  <h2 className="accordion-item__title">
                    {item.title.replace("{openAll}", "").trim()}
                  </h2>
                  <span className={styles.accordionIcon}>
                    <Icon size="md">
                      {isOpen ? <MinusIcon /> : <PlusIcon />}
                    </Icon>
                  </span>
                </summary>
                <div
                  className={`my-2 ${styles.accordionItemContentContainer}`}
                  data-open={isOpen}
                >
                  {Array.isArray(item.accordionContent) ||
                  React.isValidElement(item.accordionContent) ? (
                    <div className={styles.accordionItemContent}>
                      {renderContent(item)}
                    </div>
                  ) : (
                    <div dangerouslySetInnerHTML={item.accordionContent} />
                  )}
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Accordion;
