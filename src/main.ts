import { TypeormDatabase } from "@subsquid/typeorm-store";
import * as erc721 from "./abi/erc721";
import * as erc1155 from "./abi/erc1155";
//AstarIndexerのmappingsフォルダを移植した
import * as modules from "./mappings";
import * as utils from "./mappings/utils";
import { processor } from "./processor";

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  utils.entity.initAllEntityManagers(ctx);
  await utils.entity.prefetchEntities(ctx);

  let data_cnt = 1;

  for (const block of ctx.blocks) {
    if (block.header.height % 1000 == 0) {
      console.log(block.header.height);
    }
    for (let log of block.logs) {
      if (log.topics[0] == erc721.events.Transfer.topic) {
        if (log.topics.length == 4) {
          // EIP-721
          utils.common.blockContextManager.init(block.header, log);
          try {
            //console.log(block.header.height, log.logIndex);
            await modules.handleErc721Transfer();
          } catch (error) {
            console.log(error);
          }
          data_cnt += 1;
        } else {
          // EIP-20
          continue;
        }
      }
      // else if (log.topics[0] == erc1155.events.TransferBatch.topic) {
      //   utils.common.blockContextManager.init(block.header, log);
      //   try {
      //     await modules.handleErc1155TransferBatch();
      //   } catch (error) {
      //     console.log(error);
      //   }
      //   data_cnt += 1;
      // } else if (log.topics[0] == erc1155.events.TransferBatch.topic) {
      //   utils.common.blockContextManager.init(block.header, log);
      //   try {
      //     await modules.handleErc1155TransferSingle();
      //   } catch (error) {
      //     console.log(error);
      //   }
      //   data_cnt += 1;
      // }

      //定期的にsave
      if (data_cnt % 10 == 0) {
        await utils.entity.saveAllEntities();
      }

      utils.common.blockContextManager.resetBlockContext();
    }
  }

  await utils.entity.saveAllEntities();
});
