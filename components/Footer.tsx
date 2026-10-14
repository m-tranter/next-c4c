"use client";
import FormPanel from "./FormPanel";
import { useState } from "react";
import styles from "./Footer.module.css";
import CloseBtn from "./Icons/CloseBtn";
import Container from "./shared/Container";
import Icon from "@/components/shared/Icon";
import GridWrapper from "./shared/GridWrapper";

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  children: React.ReactNode; // FooterInner
  feedbackTitle?: string;
  url: string;
  formId: string;
};

// ─── Component ────────────────────────────────────────────────────────────────

function Footer({
  children,
  feedbackTitle = "How can we improve this page?",
  formId,
  url,
}: Props) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <>
      <div className={styles.pageFeedbackHeader}>
        <GridWrapper setMax={true} breakout={true}>
          <div className={styles.pageFeedbackInner}>
            <p className={styles.pageFeedbackTitle}>{feedbackTitle}</p>
            <button
              className={`${styles.pageFeedbackToggle} ${feedbackOpen ? styles.pageFeedbackToggleOpen : ""}`}
              aria-controls="page-feedback-form"
              aria-expanded={feedbackOpen}
              onClick={() => setFeedbackOpen((o) => !o)}
            >
              {feedbackOpen ? (
                <>
                  <Icon size="lg">
                    <CloseBtn />
                  </Icon>
                  <span className="visually-hidden">Close feedback form</span>
                </>
              ) : (
                "Let us know"
              )}
            </button>
          </div>
        </GridWrapper>
      </div>

      <GridWrapper setMax={true} breakout={true}>
        <div
          className={`${styles.feedbackForm} ${feedbackOpen ? styles.feedbackFormOpen : ""}`}
        >
          <div
            className={styles.feedbackFormInner}
            id={formId}
            aria-hidden={!feedbackOpen}
          >
            <FormPanel url={url} formId="pageFeedback" projectId="website" />
          </div>
        </div>
      </GridWrapper>

      <GridWrapper setMax={true} breakout={true}>
        <footer className={` my-9 ${styles.footerOuter} print:hidden`}>
          {children}
        </footer>
      </GridWrapper>
    </>
  );
}

export default Footer;
