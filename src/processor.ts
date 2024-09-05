import { lookupArchive } from "@subsquid/archive-registry";
import {
  BlockHeader,
  DataHandlerContext,
  EvmBatchProcessor,
  EvmBatchProcessorFields,
  Log as _Log,
  Transaction as _Transaction,
} from "@subsquid/evm-processor";
import * as erc721 from "./abi/erc721";
import * as erc1155 from "./abi/erc1155";

export const processor = new EvmBatchProcessor()
  .setDataSource({
    // Change the Archive endpoints for run the squid
    // against the other EVM networks
    // For a full list of supported networks and config options
    // see https://docs.subsquid.io/evm-indexing/
    //archive: lookupArchive('eth-mainnet'),
    archive: lookupArchive("astar", { type: "EVM" }),

    // Must be set for RPC ingestion (https://docs.subsquid.io/evm-indexing/evm-processor/)
    // OR to enable contract state queries (https://docs.subsquid.io/evm-indexing/query-state/)
    // chain: 'https://rpc.ankr.com/eth',
    //chain: "https://astar.stmnode.com/",
    //chain: "wss://astar.public.blastapi.io",
    chain: "wss://astar.api.onfinality.io/public-ws",
  })
  .setFinalityConfirmation(10)
  // .setBlockRange({
  //   from: 0,
  //   to: 10000,
  // })
  .addLog({
    topic0: [
      erc721.events.Transfer.topic, //EIP-20のtransferイベントと同じ値
      //erc1155.events.TransferBatch.topic, //未実装
      //erc1155.events.TransferSingle.topic, //未実装
    ],
    transaction: true,
  });

export type Fields = EvmBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
