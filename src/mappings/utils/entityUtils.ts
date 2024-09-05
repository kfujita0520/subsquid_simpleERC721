import * as entityManagerClasses from "./classes";
import { DataHandlerContext } from "@subsquid/evm-processor";
import * as erc721 from "../../abi/erc721";
import * as erc1155 from "../../abi/erc1155";
import { getTokenEntityId } from "./common";
import {
  Account,
  AccountNftTransfer,
  Collection,
  NfToken,
  NftTransfer,
} from "../../model";
import { Store } from "@subsquid/typeorm-store";

export function initAllEntityManagers(ctx: DataHandlerContext<Store>): void {
  accountsManager.init(ctx);
  collectionManager.init(ctx);
  nfTokenManager.init(ctx);
  nftTransferManager.init(ctx);
  accountsNftTransferManager.init(ctx);
}

export async function saveAllEntities(): Promise<void> {
  await accountsManager.saveAll();
  await collectionManager.saveAll();
  await nfTokenManager.saveAll();
  await nftTransferManager.saveAll();
  await accountsNftTransferManager.saveAll();
}

export const accountsManager = new entityManagerClasses.AccountsManager(
  Account
);
export const nfTokenManager = new entityManagerClasses.NfTokenManager(NfToken);
export const nftTransferManager = new entityManagerClasses.NftTransferManager(
  NftTransfer
);
export const collectionManager = new entityManagerClasses.CollectionManager(
  Collection
);
export const accountsNftTransferManager =
  new entityManagerClasses.AccountsNftTransferManager(AccountNftTransfer);

export async function prefetchEntities(
  ctx: DataHandlerContext<Store>
): Promise<void> {
  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      let decodedEvent = null;
      switch (log.topics[0]) {
        /**
         * ===================================================================
         */
        case erc721.events.Transfer.topic:
          try {
            decodedEvent = erc721.events.Transfer.decode(log);
            accountsManager.addPrefetchItemId([
              decodedEvent.from,
              decodedEvent.to,
            ]);
            nfTokenManager.addPrefetchItemId(
              getTokenEntityId(
                log.address.toString(),
                decodedEvent.tokenId.toString()
              )
            );
            collectionManager.addPrefetchItemId(log.address.toString());
          } catch (err) {}

          break;
        /**
         * ===================================================================
         */
        case erc1155.events.TransferBatch.topic:
          decodedEvent = erc1155.events.TransferBatch.decode(log);
          accountsManager.addPrefetchItemId([
            decodedEvent.operator,
            decodedEvent.from,
            decodedEvent.to,
          ]);
          nfTokenManager.addPrefetchItemId(
            decodedEvent.ids.map((id) =>
              getTokenEntityId(log.address.toString(), id.toString())
            )
          );
          collectionManager.addPrefetchItemId(log.address.toString());
          break;
        /**
         * ===================================================================
         */
        case erc1155.events.TransferSingle.topic:
          decodedEvent = erc1155.events.TransferSingle.decode(log);
          accountsManager.addPrefetchItemId([
            decodedEvent.operator,
            decodedEvent.from,
            decodedEvent.to,
          ]);
          nfTokenManager.addPrefetchItemId(
            getTokenEntityId(log.address.toString(), decodedEvent.id.toString())
          );
          collectionManager.addPrefetchItemId(log.address.toString());
          break;

        default:
      }
    }
  }
  await accountsManager.prefetchEntities();
  await nfTokenManager.prefetchEntities({
    currentOwner: true,
    collection: true,
  });
}
