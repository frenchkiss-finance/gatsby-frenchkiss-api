// List of pools + start/end block.
interface PoolObject {
  address: string;
  startBlock: number;
  endBlock: number;
}

export const pools: Array<PoolObject> = [];
