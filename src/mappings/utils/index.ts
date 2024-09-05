import { getTokenEntityId } from "./common";
import {
  accountsManager,
  nfTokenManager,
  nftTransferManager,
  collectionManager,
  accountsNftTransferManager,
  initAllEntityManagers,
  saveAllEntities,
  prefetchEntities,
} from "./entityUtils";

import { blockContextManager } from "./blockContextUtils";

export const entity = {
  accountsManager,
  nfTokenManager,
  nftTransferManager,
  collectionManager,
  accountsNftTransferManager,
  initAllEntityManagers,
  saveAllEntities,
  prefetchEntities,
};
export const common = { getTokenEntityId, blockContextManager };
