export enum QueueJobs {
  NEW_PBFT_BLOCKS = 'NEW_PBFT_BLOCKS',
  NEW_DAG_BLOCKS = 'NEW_DAG_BLOCKS',
  STALE_TRANSACTIONS = 'STALE_TRANSACTIONS',
}

export enum Queues {
  NEW_PBFTS = 'new_pbfts',
  NEW_DAGS = 'new_dags',
  STALE_TRANSACTIONS = 'stale_transactions',
}

export enum SyncTypes {
  LIVE = 'liveSync',
  HISTORICAL = 'historicalSync',
}
export interface QueueData {
  pbftPeriod: number;
  type: SyncTypes;
}

export interface TxQueueData {
  hash: string;
  type: SyncTypes;
}
