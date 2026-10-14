"use server";
import type { ElectionResult } from "@/lib/electionMap";

import { getElectionById } from "@/services/election";

export async function refreshElection(
  id: string,
): Promise<ElectionResult | null> {
  return (await getElectionById(id)) ?? null;
}
