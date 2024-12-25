import assert from 'assert'
import {
    BlockHeader,
    DataHandlerContext,
    EvmBatchProcessor,
    EvmBatchProcessorFields,
    Log as _Log,
    Transaction as _Transaction,
} from '@subsquid/evm-processor'
import * as erc721 from './abi/erc721'
import * as erc20 from './abi/erc20'

assert(erc20.events.Transfer.topic===erc721.events.Transfer.topic, 'ERC20 and ERC721 topics are expected to be the same in the TS ABI and they are not')

export const processor = new EvmBatchProcessor()
    .setGateway('https://v2.archive.subsquid.io/network/astar-mainnet')
    .setRpcEndpoint({
        url: process.env.ASTAR_RPC_ENDPOINT || 'https://astar-rpc.dwellir.com', 
        rateLimit: 50 // requests per second
    })
    // According to ChatGPT, For high-value or sensitive transactions of GRANDPA consensus algorithm, 
    // a buffer of 100-120 blocks (~20 minutes) ensures added safety and virtually eliminates any risk of re-org issues.
    .setFinalityConfirmation(100)
    .setFields({
        log: {
            address: true,
            data: true,
            topics: true,
            transactionHash: true,
        },
    })
    .setBlockRange({
        from: 1_725_245, //43_817_299,  Starting point where the first Sushitop NFT is created.
    })
    .addLog({
        topic0: [erc721.events.Transfer.topic]
    })

export type Fields = EvmBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>
