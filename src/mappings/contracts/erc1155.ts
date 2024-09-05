import { Contract as Erc1155Contract } from "../../abi/erc1155";
import { DataHandlerContext } from "@subsquid/evm-processor";
import { Store } from "@subsquid/typeorm-store";
import * as utils from "../utils";

export function getContractErc1155({
  ctx,
  contractAddress,
}: {
  ctx: DataHandlerContext<Store>;
  contractAddress: string;
}): Erc1155Contract {
  const header = utils.common.blockContextManager.getCurrentBlockHeader();
  return new Erc1155Contract(
    { _chain: ctx._chain, block: { height: header.height } },
    contractAddress
  );
}
