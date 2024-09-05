import * as erc721 from "../../../abi/erc721";
import { ContractStandard, TransferDirection } from "../../../model";
import * as utils from "../../utils";

export async function handleErc721Transfer(): Promise<void> {
  const log = utils.common.blockContextManager.getCurrentLog();
  const { from, to, tokenId } = erc721.events.Transfer.decode(log);

  const transfer = await utils.entity.nftTransferManager.getOrCreate({
    amount: BigInt("1"),
    contractStandard: ContractStandard.ERC721,
    isBatch: false,
    tokenId,
    from,
    to,
  });

  await utils.entity.accountsNftTransferManager.getOrCreate({
    account: transfer.from,
    direction: TransferDirection.From,
    transfer,
  });

  await utils.entity.accountsNftTransferManager.getOrCreate({
    account: transfer.to,
    direction: TransferDirection.To,
    transfer,
  });
}
