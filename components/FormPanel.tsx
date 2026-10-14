"use client";
import dynamic from "next/dynamic";

const ContensisForm = dynamic(
  () => import("@contensis/forms").then((m) => m.ContensisForm),
  { ssr: false },
);
import Container from "./shared/Container";
import styles from "./Form.module.css";

type Props = {
  projectId: string;
  formId: string;
  url: string;
};

function FormPanel({ url, formId, projectId }: Props) {
  if (!formId) return null;

  return (
    <Container className={`${styles.outer}`}>
      {/* To fix accessibility error */}
      <label className="sr-only" htmlFor="g-recaptcha-response-100000">
        Recaptcha
      </label>
      <ContensisForm
        projectId={projectId}
        formId={formId}
        onPopulate={(defaultValue, form) => {
          return form.fields.find((x) => x.id === "pageURL")
            ? { ...defaultValue, pageURL: url }
            : defaultValue;
        }}
      ></ContensisForm>
    </Container>
  );
}

export default FormPanel;
