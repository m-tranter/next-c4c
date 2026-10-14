import client from "@/lib/client";
import { Options } from "./pagedata";

export const getAncestors = async (id: string, status: string) => {
  try {
    const nodes = await client.nodes.getAncestors({
      id,
      versionStatus: status,
    } as Options);
    return nodes;
  } catch (err: any) {
    console.log(err?.data?.message || "Something went wrong in getAncestors");
    return;
  }
};
