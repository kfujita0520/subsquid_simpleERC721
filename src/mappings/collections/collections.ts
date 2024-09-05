import { Collection, ContractStandard } from "../../model";
import * as utils from "../utils";

export function createCollection({
  id,
  contractStandard,
}: {
  id: string;
  contractStandard: ContractStandard;
}): Collection {
  const header = utils.common.blockContextManager.getCurrentBlockHeader();

  return new Collection({
    id,
    collectionType: contractStandard,
    createdAtBlock: BigInt(header.height),
    createdAt: new Date(header.timestamp),
  });
}
