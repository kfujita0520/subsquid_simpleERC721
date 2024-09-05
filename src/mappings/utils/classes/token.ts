import { Account, Collection, ContractStandard, NfToken } from "../../../model";
import { createNfToken } from "../../tokens";
import { getTokenEntityId } from "../common";
import { EntitiesManager } from "./common";
import { getTokenDetails } from "../../tokens/utils";

/**
 * ::::::::::::: ERC721/ERC1155 TOKEN :::::::::::::
 */
export class NfTokenManager extends EntitiesManager<NfToken> {
  constructor(entity: typeof NfToken) {
    super({ entity });
  }

  async getOrCreate({
    id,
    contractAddress,
    contractStandard,
    owner,
  }: {
    id: bigint;
    contractAddress: string;
    contractStandard: ContractStandard;
    owner: Account;
  }): Promise<NfToken> {
    if (!this.context) throw new Error("context is not defined");

    const tokenEntityId = getTokenEntityId(contractAddress, id.toString());
    let token = await this.get(tokenEntityId, {
      currentOwner: true,
      collection: true,
    });

    token = await createNfToken({
      id: tokenEntityId,
      nativeId: id,
      ctx: this.context,
      contractAddress,
      contractStandard,
      owner,
    });

    // if (!token || (token && (!token.name || !token.symbol))) {
    //   token = await createNfToken({
    //     id: tokenEntityId,
    //     nativeId: id,
    //     ctx: this.context,
    //     contractAddress,
    //     contractStandard,
    //     owner
    //   });
    // }

    this.add(token);

    return token;
  }
}
