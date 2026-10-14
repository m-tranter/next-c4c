import Canvas from "@/components/Canvas";

type PromotionalProps = {
  data: any;
};

function BreakoutCanvas({ data }: PromotionalProps) {
  return (
    <div className="w-full mx-auto">
      <div
        className="pt-8 pb-3 text-center"
        style={{
          color: data?.textColour,
          backgroundColor: `#${data.backgroundColour.backgroundColour}`,
        }}
      >
        {data.canvas && (
          <Canvas noWrap={true} key={data.id} data={data.canvas} />
        )}
      </div>
    </div>
  );
}

export default BreakoutCanvas;
