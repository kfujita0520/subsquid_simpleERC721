import {
  Account,
  AccountNftTransfer,
  NftTransfer,
  TransferDirection,
} from "../../../model";
import { EntitiesManager } from "./common";
import { createAccountNftTransfer } from "../../accountTransfer";

export class AccountsNftTransferManager extends EntitiesManager<AccountNftTransfer> {
  constructor(entity: typeof AccountNftTransfer) {
    super({ entity });
  }

  async getOrCreate({
    id = null,
    account,
    transfer,
    direction,
  }: {
    id?: string | null;
    account: Account;
    transfer: NftTransfer;
    direction: TransferDirection;
  }): Promise<AccountNftTransfer> {
    if (!this.context) throw new Error("context is not defined");
    let accountTransfer = id ? this.entitiesMap.get(id) : null;

    if (!accountTransfer) {
      accountTransfer = id
        ? await this.context.store.get(AccountNftTransfer, id)
        : null;
      if (!accountTransfer) {
        accountTransfer = createAccountNftTransfer(
          account,
          transfer,
          direction
        );
      }
      this.add(accountTransfer);
    }

    return accountTransfer;
  }
}
