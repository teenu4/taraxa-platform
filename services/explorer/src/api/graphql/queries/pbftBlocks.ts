export const blockQuery = `
  query block_query($number: Long, hash: Bytes32) {
    blocks (number: $number, hash: $hash) {
      number,
      hash,
      stateRoot,
      gasLimit,
      gasUsed,
      timestamp,
      transactions {
        status, hash, gas
      },
      account,
      estimateGas,
    }
  }
`;

export const blocksQuery = `
  query blocks_query($from: Long!, $to: Long) {
    blocks (from: $from, to: $to) {
      number,
      hash,
      stateRoot,
      gasLimit,
      gasUsed,
      timestamp,
      transactions {
        status, hash, gas
      },
      account,
      estimateGas,
    }
  }
`;
