import { InjectGraphQLClient } from '@golevelup/nestjs-graphql-request';
import { Injectable } from '@nestjs/common';
import { gql, GraphQLClient } from 'graphql-request';
import { IGQLPBFT } from '../pbft';

@Injectable()
export class GraphQLConnector {
  constructor(
    @InjectGraphQLClient()
    private readonly graphQLClient: GraphQLClient
  ) {}

  public async getPBFTBlocksByNumberFromTo(
    from: number,
    to: number
  ): Promise<IGQLPBFT[]> {
    return (
      await this.graphQLClient.request(
        gql`
          query get_pbfts_from($from: Long!, $to: Long!) {
            blocks(from: $from, to: $to) {
              number
              hash
              stateRoot
              gasLimit
              gasUsed
              timestamp
              transactionCount
              parent {
                hash
              }
              difficulty
              totalDifficulty
              miner {
                address
              }
              transactionsRoot
              extraData
              logsBloom
              mixHash
              receiptsRoot
              ommerHash
              nonce
              stateRoot
              transactions {
                block {
                  hash
                  number
                }
                hash
                nonce
                status
                from {
                  address
                }
                to {
                  address
                }
                gas
                gasUsed
                cumulativeGasUsed
                gasPrice
                inputData
                r
                v
                s
                index
                value
              }
            }
          }
        `,
        {
          from,
          to,
        }
      )
    )?.blocks;
  }
  public async getPBFTBlockHashForNumber(number: number) {
    return (
      await this.graphQLClient.request(
        gql`
          query block_query($number: Long, $hash: Bytes32) {
            block(number: $number, hash: $hash) {
              hash
            }
          }
        `,
        {
          number,
        }
      )
    )?.block;
  }

  /**
   * @note If no parameter is given for neither number or hash the last block is returned.
   * @param hash The PBFT block's hash that should be fetched.
   * @returns Block object containing number and parent object of the sought hash
   */
  public async getPBFTBlockNumberAndParentForHash(hash?: string) {
    return (
      await this.graphQLClient.request(
        gql`
          query block_query($number: Long, $hash: Bytes32) {
            block(number: $number, hash: $hash) {
              number
              parent {
                hash
              }
            }
          }
        `,
        {
          hash,
        }
      )
    )?.block;
  }

  public async getDagBlockByHash(hash?: string) {
    return (
      await this.graphQLClient.request(
        gql`
          query dag_block_query($hash: Bytes32) {
            dagBlock(hash: $hash) {
              hash
              level
              pbftPeriod
            }
          }
        `,
        {
          hash,
        }
      )
    )?.dagBlock;
  }
}
