import assert from "assert";
import { ContractStandard } from "../../model";
import { DataHandlerContext } from "@subsquid/evm-processor";
import { addTimeout } from "@subsquid/util-timeout";
import { contractCallTimeout } from "../../config";
import { TokenDetails } from "../../common/types";

import * as contracts from "../contracts";
import { Store } from "@subsquid/typeorm-store";

function clearNullBytes(rawStr: string): string {
  /**
   * We need replace null byte in string value to prevent error:
   * "QueryFailedError: invalid byte sequence for encoding \"UTF8\": 0x00\n    at PostgresQueryRunner.query ..."
   */
  return rawStr ? rawStr.replace(/\0/g, "") : rawStr;
}

function getDecoratedCallResult(rawValue: string | null): string | null {
  const decoratedValue: string | null = rawValue;

  if (!rawValue || typeof rawValue !== "string") return null;

  const regex = new RegExp(/^\d{10}\.[\d|\w]{4}$/);

  /**
   * This test is required for contract call results
   * like this - "0006648936.1ec7" which must be saved as null
   */
  if (regex.test(rawValue)) return null;

  return decoratedValue ? clearNullBytes(decoratedValue) : decoratedValue;
}

export async function getTokenDetails({
  tokenId = null,
  contractAddress,
  contractStandard,
  ctx,
}: {
  tokenId?: bigint | null;
  contractAddress: string;
  contractStandard: ContractStandard;
  ctx: DataHandlerContext<Store>;
}): Promise<TokenDetails> {
  let contractInst = null;
  switch (contractStandard) {
    case ContractStandard.ERC721:
      contractInst = contracts.getContractErc721({
        contractAddress,
        ctx,
      });
      break;
    case ContractStandard.ERC1155:
      contractInst = contracts.getContractErc1155({
        contractAddress,
        ctx,
      });
      break;
    default:
  }

  if (!contractInst) throw new Error("contractInst is null");

  let name: string | null = null;
  let symbol: string | null = null;
  let uri: string | null = null;

  try {
    name =
      "name" in contractInst
        ? await addTimeout(contractInst.name(), contractCallTimeout)
        : null;
  } catch (e) {
    console.log(e);
  }
  try {
    symbol =
      "symbol" in contractInst
        ? await addTimeout(contractInst.symbol(), contractCallTimeout)
        : null;
  } catch (e) {
    console.log(e);
  }
  try {
    if ("uri" in contractInst && tokenId) {
      uri = clearNullBytes(
        await addTimeout(contractInst.uri(tokenId), contractCallTimeout)
      );
    } else if ("tokenURI" in contractInst && tokenId) {
      uri = clearNullBytes(
        await addTimeout(contractInst.tokenURI(tokenId), contractCallTimeout)
      );
    }
  } catch (e) {
    console.log(e);
  }

  return {
    symbol: getDecoratedCallResult(symbol),
    name: getDecoratedCallResult(name),
    uri,
  };
}

export async function getTokenBalanceOf({
  tokenId,
  accountAddress,
  contractAddress,
  contractStandard,
  ctx,
}: {
  tokenId?: bigint;
  accountAddress: string;
  contractAddress: string;
  contractStandard: ContractStandard;
  ctx: DataHandlerContext<Store>;
}): Promise<bigint> {
  let contractInst = null;
  let balance = null;

  switch (contractStandard) {
    case ContractStandard.ERC721:
      contractInst = contracts.getContractErc721({
        contractAddress,
        ctx,
      });
      balance = await addTimeout(
        contractInst.balanceOf(accountAddress),
        contractCallTimeout
      );
      break;
    case ContractStandard.ERC1155:
      contractInst = contracts.getContractErc1155({
        contractAddress,
        ctx,
      });
      balance = tokenId
        ? await addTimeout(
            contractInst.balanceOf(accountAddress, tokenId),
            contractCallTimeout
          )
        : null;
      break;
    default:
  }

  assert(balance, "balance is not available");

  return BigInt(balance.toString());
}
