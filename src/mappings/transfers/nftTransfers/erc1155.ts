import * as erc1155 from "../../../abi/erc1155";
import * as utils from "../../utils";
import { ContractStandard, TransferDirection } from "../../../model";

export async function handleErc1155TransferSingle(): Promise<void> {
  const log = utils.common.blockContextManager.getCurrentLog();

  const {
    operator,
    from,
    to,
    id: tokenId,
    value: amount,
  } = erc1155.events.TransferSingle.decode(log);

  const transfer = await utils.entity.nftTransferManager.getOrCreate({
    contractStandard: ContractStandard.ERC1155,
    isBatch: false,
    amount,
    tokenId,
    from,
    to,
    operator,
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

export async function handleErc1155TransferBatch(): Promise<void> {
  const log = utils.common.blockContextManager.getCurrentLog();

  const { operator, from, to, ids, values } =
    erc1155.events.TransferBatch.decode(log);

  //未完成
  const valuesIterator = values();
  for (let i = 0; i < ids.length; i++) {
    const transfer = await utils.entity.nftTransferManager.getOrCreate({
      contractStandard: ContractStandard.ERC1155,
      isBatch: true,
      amount: valuesIterator.next().value,
      tokenId: ids[i],
      from,
      to,
      operator,
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
}
