import { ContractStandard, NftTransfer, TransferType } from "../../../model";
import { accountsManager, nfTokenManager } from "../entityUtils";
import { EntitiesManager } from "./common";
import {
  getNftTransferEntityId,
  getTokenTotalSupply,
  getTokenBurnedStatus,
  getTransferType,
} from "../common";
import * as utils from "../index";

/**
 * ::::::::::::: TRANSFERS ERC721/ERC1155 TOKEN :::::::::::::
 */
export class NftTransferManager extends EntitiesManager<NftTransfer> {
  constructor(entity: typeof NftTransfer) {
    super({ entity });
  }

  async getOrCreate({
    from,
    to,
    operator,
    amount,
    tokenId,
    isBatch,
    contractStandard,
  }: {
    from: string;
    to: string;
    operator?: string;
    amount: bigint;
    tokenId: bigint;
    isBatch: boolean;
    contractStandard: ContractStandard;
  }): Promise<NftTransfer> {
    const header = utils.common.blockContextManager.getCurrentBlockHeader();
    const log = utils.common.blockContextManager.getCurrentLog();

    const fromAccount = await accountsManager.getOrCreate(from);
    const toAccount = await accountsManager.getOrCreate(to);
    const operatorAccount = operator
      ? await accountsManager.getOrCreate(operator)
      : null;
    const token = await nfTokenManager.getOrCreate({
      id: tokenId,
      contractAddress: log.address,
      owner: toAccount,
      contractStandard,
    });
    const transferType = getTransferType(from, to);

    token.amount = getTokenTotalSupply(
      token.amount,
      BigInt(amount.toString()),
      transferType
    );
    token.isBurned =
      contractStandard === ContractStandard.ERC721
        ? transferType === TransferType.BURN
        : getTokenBurnedStatus(token.amount);

    nfTokenManager.add(token);

    const transfer = new NftTransfer({
      id: getNftTransferEntityId(log.id, tokenId.toString()),
      blockNumber: BigInt(header.height),
      timestamp: new Date(header.timestamp),
      eventIndex: log.logIndex,
      txnHash: log.transaction.hash,
      amount: BigInt(amount.toString()),
      from: fromAccount,
      to: toAccount,
      operator: operatorAccount,
      transferType,
      token,
      isBatch,
    });

    this.add(transfer);

    return transfer;
  }
}
