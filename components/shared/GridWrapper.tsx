import { ReactNode } from "react";
import Container from "@/components/shared/Container";

interface Props {
  children: ReactNode;
  setMax?: boolean;
  breakout?: boolean;
  className?: string;
}

export default function GridWrapper({
  children,
  setMax,
  breakout,
  className,
}: Props) {
  return (
    <div
      className={`${className ? className : ""}  mx-auto w-full grid grid-cols-12 min-w-0 ${setMax ? " max-w-(--page-max)" : ""}`}
    >
      <Container className="px-5 py-5 2xl:px-2" fullWidth={breakout}>
        {children}
      </Container>
    </div>
  );
}
