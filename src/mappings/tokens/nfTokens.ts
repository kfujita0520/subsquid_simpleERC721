import { ContractStandard, NfToken, Account } from "../../model";
import { DataHandlerContext } from "@subsquid/evm-processor";
import * as utils from "../utils";

import { getTokenDetails } from "./utils";
import { Store } from "@subsquid/typeorm-store";

export async function createNfToken({
  id,
  nativeId,
  contractAddress,
  contractStandard,
  owner,
  ctx,
}: {
  id: string;
  nativeId: bigint;
  contractAddress: string;
  contractStandard: ContractStandard;
  owner: Account;
  ctx: DataHandlerContext<Store>;
}): Promise<NfToken> {
  const { name, symbol, uri } = await getTokenDetails({
    tokenId: nativeId,
    contractAddress,
    contractStandard,
    ctx,
  });

  const collection = await utils.entity.collectionManager.getOrCreate({
    id: contractAddress,
    contractStandard,
  });

  return new NfToken({
    nativeId: nativeId.toString(),
    currentOwner: owner,
    isBurned: false,
    amount: BigInt(0),
    id,
    name,
    symbol,
    uri,
    collection,
  });
}
