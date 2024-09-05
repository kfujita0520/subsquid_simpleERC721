import {
  AccountNftTransfer,
  TransferDirection,
  Account,
  NftTransfer,
} from "../../model";
import { getAccountTransferEntityId } from "../utils/common";

export function createAccountNftTransfer(
  account: Account,
  transfer: NftTransfer,
  direction: TransferDirection
): AccountNftTransfer {
  return new AccountNftTransfer({
    id: getAccountTransferEntityId(account.id, transfer.id),
    transfer,
    account,
    direction,
  });
}
