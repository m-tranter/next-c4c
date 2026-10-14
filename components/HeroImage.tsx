import type { Asset } from "@/lib/seo";

type Props = {
  heroImage: Asset;
};

function HeroImage({ heroImage }: Props) {
  return (
    <img
      src={heroImage.asset.sys.uri}
      alt={heroImage.altText ?? ""}
      className="block object-cover w-full h-full"
    />
  );
}

export default HeroImage;

