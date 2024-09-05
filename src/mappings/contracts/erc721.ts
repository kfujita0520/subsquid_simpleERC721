import { Contract as Erc721Contract } from "../../abi/erc721";
import { DataHandlerContext } from "@subsquid/evm-processor";
import { Store } from "@subsquid/typeorm-store";
import * as utils from "../utils";

export function getContractErc721({
  ctx,
  contractAddress,
}: {
  ctx: DataHandlerContext<Store>;
  contractAddress: string;
}): Erc721Contract {
  const header = utils.common.blockContextManager.getCurrentBlockHeader();
  return new Erc721Contract(
    { _chain: ctx._chain, block: { height: header.height } },
    contractAddress
  );
}
