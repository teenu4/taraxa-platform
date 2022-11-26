import * as ethers from 'ethers';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockchainService {
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor(
    endpoint: string,
    walletKey: string,
    private defaultDelegationAmount: ethers.BigNumber,
    private ownNodes: string[],
  ) {
    this.provider = new ethers.providers.JsonRpcProvider({
      url: endpoint,
      timeout: 2000,
    });

    this.wallet = new ethers.Wallet(walletKey, this.provider);

    this.contract = new ethers.Contract(
      '0x00000000000000000000000000000000000000fe',
      [
        'function delegate(address validator) payable',
        'function getValidator(address validator) view returns (tuple(uint256 total_stake, uint256 commission_reward, uint16 commission, uint64 last_commission_change, address owner, string description, string endpoint) validator_info)',
        'function getValidators(uint32 batch) view returns (tuple(address account, tuple(uint256 total_stake, uint256 commission_reward, uint16 commission, uint64 last_commission_change, address owner, string description, string endpoint) info)[] validators, bool end)',
        'function registerValidator(address validator, bytes proof, bytes vrf_key, uint16 commission, string description, string endpoint) payable',
      ],
      this.provider,
    ).connect(this.wallet);
  }

  static create(
    endpoint: string,
    walletKey: string,
    defaultDelegationAmount: ethers.BigNumber,
    ownNodes: string[],
  ) {
    return new BlockchainService(
      endpoint,
      walletKey,
      defaultDelegationAmount,
      ownNodes,
    );
  }

  async getValidator(address: string) {
    const {
      total_stake,
      commission_reward,
      commission,
      description,
      endpoint,
    } = await this.contract.getValidator(address);
    return {
      total_stake,
      commission_reward,
      commission,
      description,
      endpoint,
    };
  }

  async registerValidator(
    address: string,
    addressProof: string,
    vrfKey: string,
  ) {
    await this.rebalanceOwnNodes(true);

    try {
      const tx = await this.contract.registerValidator(
        address,
        addressProof,
        vrfKey,
        0,
        '',
        '',
        {
          gasPrice: this.provider.getGasPrice(),
          value: this.defaultDelegationAmount,
        },
      );
      await tx.wait();
      return true;
    } catch (e) {
      console.error(`Could not create validator ${address}`, e);
    }

    return false;
  }

  async delegate(address: string, amount: ethers.BigNumber) {
    try {
      const tx = await this.contract.delegate(address, {
        gasPrice: this.provider.getGasPrice(),
        value: amount,
      });
      await tx.wait();
      return true;
    } catch (e) {
      console.error(
        `Could not delegate ${amount.toString()} TARA to validator ${address}`,
        e,
      );
    }

    return false;
  }

  async rebalanceOwnNodes(addOneNode = false) {
    if (this.ownNodes.length === 0) {
      console.error(`Can't delegate to own nodes - No own nodes.`);
      return false;
    }

    // Getting all validators from contract (including own nodes)
    const allValidators = await this.getAllValidators();
    if (allValidators.length === 0) {
      console.error(`Can't delegate to own nodes - No validators in contract.`);
      return false;
    }

    // Getting all registered own nodes and total stake for each
    const ownNodes = allValidators
      .filter((validator) =>
        this.ownNodes
          .map((node) => node.toLowerCase())
          .includes(validator.account.toLowerCase()),
      )
      .map((validator) => ({
        address: validator.account,
        stake: validator.info.total_stake,
      }));
    if (ownNodes.length === 0) {
      console.error(`Can't delegate to own nodes - No own nodes in contract.`);
      return false;
    }
    const totalStakeOwnNodes = ownNodes.reduce((prev, curr) => {
      return prev.add(curr.stake);
    }, ethers.BigNumber.from(0));

    let numberOfCommunityNodes = allValidators.length - ownNodes.length;
    if (addOneNode) {
      numberOfCommunityNodes++;
    }

    const totalStakeCommunityNodes = this.defaultDelegationAmount.mul(
      numberOfCommunityNodes,
    );

    // If our node have 2 x stake of community nodes already, we exit
    if (totalStakeOwnNodes.gte(totalStakeCommunityNodes.mul(2))) {
      return;
    }

    // Sorting own nodes in ascending order
    ownNodes.sort((a, b) => {
      if (a.stake.eq(b.stake)) {
        return 0;
      }
      if (a.stake.gt(b.stake)) {
        return 1;
      }
      return -1;
    });

    const avgStakeOwnNode = totalStakeCommunityNodes
      .mul(2)
      .div(ownNodes.length);
    let left = totalStakeCommunityNodes.mul(2).sub(totalStakeOwnNodes);
    for (const ownNode of ownNodes) {
      if (left.isZero()) {
        break;
      }

      if (ownNode.stake.gte(avgStakeOwnNode)) {
        continue;
      }

      const d = avgStakeOwnNode.sub(ownNode.stake);
      let toDelegate = ethers.BigNumber.from(0);
      if (d.gt(left)) {
        toDelegate = ethers.BigNumber.from(left);
      } else {
        toDelegate = ethers.BigNumber.from(d);
      }

      console.log(`Delegating ${toDelegate} to ${ownNode.address}`);

      try {
        const tx = await this.contract.delegate(ownNode.address, {
          gasPrice: this.provider.getGasPrice(),
          value: toDelegate,
        });
        await tx.wait();
      } catch (e) {
        console.error(
          `Can't delegate to own nodes - delegation call failed for node ${ownNode.address}`,
        );
        break;
      }

      left = left.sub(toDelegate);
    }
  }

  private async getAllValidators() {
    let validators = [];
    let page = 0;
    let hasNextPage = true;
    while (hasNextPage) {
      try {
        const allValidators = await this.contract.getValidators(page);
        validators = [...validators, ...allValidators.validators];
        hasNextPage = !allValidators.end;
        page++;
      } catch (e) {
        hasNextPage = false;
      }
    }
    return validators;
  }
}