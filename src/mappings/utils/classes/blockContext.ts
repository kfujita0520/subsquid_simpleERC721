import { BlockHeader } from "@subsquid/evm-processor";
import assert from "assert";

export class BlockContextManager {
  private block: BlockHeader | null = null;
  private log: any | null = null;

  init(block: BlockHeader, log: any) {
    this.block = block;
    this.log = log;
    return this;
  }

  getCurrentLog(): any {
    assert(this.log, "Current log is not available");
    return this.log;
  }

  getCurrentBlockHeader(): BlockHeader {
    assert(this.block, "Current block is not available");
    return this.block;
  }

  resetBlockContext(): void {
    this.block = null;
    this.log = null;
  }
}
