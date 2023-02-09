import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  deZeroX,
  IPBFT,
  ITransaction,
  PbftEntity,
  toChecksumAddress,
  TransactionEntity,
  zeroX,
} from '@taraxa_project/explorer-shared';
import { IGQLTransaction } from 'src/types';
import { Repository } from 'typeorm';
import { toBN } from 'web3-utils';

@Injectable()
export default class TransactionService {
  private readonly logger: Logger = new Logger(TransactionService.name);
  private isRedisConnected: boolean;
  constructor(
    @InjectRepository(TransactionEntity)
    private txRepository: Repository<TransactionEntity>
  ) {
    this.txRepository = txRepository;
    this.isRedisConnected = true;
  }

  public getRedisConnectionState() {
    return this.isRedisConnected;
  }

  public setRedisConnectionState(state: boolean) {
    this.isRedisConnected = state;
  }

  public async deleteTransactions(transactions: TransactionEntity[]) {
    return await this.txRepository.remove(transactions);
  }

  public populateTransactionWithPBFT(tx: ITransaction, block: IPBFT) {
    tx.block = block;
    return tx;
  }

  public gQLToITransaction(gqlTx: IGQLTransaction): ITransaction {
    const iTx: ITransaction = {
      hash: gqlTx.hash,
      nonce: Number(gqlTx.nonce || null),
      index: Number(gqlTx.index),
      value: gqlTx.value,
      gasPrice: gqlTx.gasPrice,
      gas: gqlTx.gas,
      gasUsed: gqlTx.gas,
      cumulativeGasUsed: gqlTx.cumulativeGasUsed,
      inputData: zeroX(gqlTx.inputData),
      status: gqlTx.status,
      from: zeroX(gqlTx.from?.address),
      to: zeroX(gqlTx.to?.address),
      v: gqlTx.v,
      r: gqlTx.r,
      s: gqlTx.s,
      blockHash: zeroX(gqlTx.block?.hash),
      blockNumber: gqlTx.block?.number,
      blockTimestamp: +gqlTx.block?.timestamp,
    };
    return iTx;
  }

  public async clearTransactionData() {
    await this.txRepository.query(
      `DELETE FROM "${this.txRepository.metadata.tableName}"`
    );
  }

  public async findTransactionsByHashesOrFill(transactions: ITransaction[]) {
    if (!(transactions?.length > 0)) {
      return [];
    }
    const newTransactions: TransactionEntity[] = [];
    await Promise.all(
      transactions.map(async (transaction) => {
        const tx = await this.safeSaveEmptyTx(transaction);
        newTransactions.push(tx);
      })
    );
    return newTransactions;
  }

  public async updateTransaction(tx: ITransaction) {
    let foundTx = await this.txRepository.findOne({
      where: {
        hash: tx.hash,
      },
    });
    if (!foundTx) {
      foundTx = this.txRepository.create();
      foundTx.hash = tx.hash;
    }
    foundTx.nonce = tx.nonce;
    foundTx.index = tx.index;
    foundTx.value = tx.value;
    foundTx.gas = tx.gas;
    foundTx.gasPrice = tx.gasPrice;
    foundTx.gasUsed = tx.gasUsed;
    foundTx.cumulativeGasUsed = tx.cumulativeGasUsed;
    foundTx.inputData = tx.inputData;
    foundTx.status = tx.status;
    foundTx.from = tx.from;
    foundTx.to = tx.to;
    foundTx.v = tx.v;
    foundTx.r = tx.r;
    foundTx.s = tx.s;
    foundTx.blockHash = tx.blockHash;
    foundTx.blockNumber = tx.blockNumber;
    foundTx.blockTimestamp = tx.blockTimestamp;
    return await this.txRepository.save(foundTx);
  }

  public async safeSaveEmptyTx(transaction: ITransaction) {
    if (!transaction) {
      return;
    }
    transaction.hash = zeroX(transaction.hash);

    const tx = await this.txRepository.findOne({
      where: {
        hash: transaction.hash,
      },
    });

    if (!tx) {
      try {
        const transactionEntity = new TransactionEntity({
          ...transaction,
          index: Number(transaction.index || 0),
        });
        if (transaction.from) {
          transactionEntity.from = toChecksumAddress(transaction.from);
        }
        if (transaction.to) {
          transactionEntity.to = toChecksumAddress(transaction.to);
        }
        if (transaction?.block) {
          transactionEntity.block = {
            id: transaction?.block?.id,
            hash: transaction.block?.hash,
            number: transaction.block?.number,
            timestamp: transaction.block?.timestamp,
          } as PbftEntity;
        }
        const newTx = this.txRepository.create(transactionEntity);

        const saved = await this.txRepository
          .createQueryBuilder()
          .insert()
          .into(TransactionEntity)
          .values(newTx)
          .orIgnore(false)
          .returning('*')
          .execute();

        return saved.raw[0];
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
    return tx;
  }

  public createSyntheticTransaction(
    address: string,
    value: string,
    block: IPBFT
  ): ITransaction {
    const hash = `GENESIS_${deZeroX(address)}`;
    return {
      hash,
      value: toBN(value).toString(),
      from: 'GENESIS',
      to: address,
      block,
      gas: '0',
      gasPrice: '0',
      gasUsed: '0',
      cumulativeGasUsed: 0,
      status: 1,
      blockNumber: 0,
      blockTimestamp: 0,
    };
  }
}
