import styles from "./Promotional.module.css";
import type { Block } from "@contensis/canvas-react";
import Content from "@/components/shared/Content";
import Container from "@/components/shared/Container";

type PromotionalProps = {
  data: any;
};

type Col = {
  centerText: Boolean;
  canvas: Block[];
};

export default function PromotionalColumns({ data }: PromotionalProps) {
  return (
    <div className={`full-bleed ${styles.promotional}`}>
      <Container>
        <div className="my-10 px-6 xl:px-0 gap-8 flex flex-col md:flex-row md:flex-wrap ">
          {data.canvasComponent &&
            data.canvasComponent.map((col: Col, i: number) => {
              const isSingle = data.canvasComponent.length === 1;
              return (
                <div
                  className={`${styles.cols}  ${
                    isSingle ? "w-full md:max-w-md mx-auto" : "flex-1"
                  }`}
                  key={i}
                >
                  {col &&
                    col.canvas.map((value: Block) => (
                      <Content
                        $className={col.centerText ? "text-center" : ""}
                        key={value.id}
                        data={value}
                      />
                    ))}
                </div>
              );
            })}
        </div>
      </Container>
    </div>
  );
}
