import { Pair, TokenAmount } from "@frenchkiss-libs/sdk";
import BigNumber from "bignumber.js";
import bep20ABI from "./abis/bep20.json";
import pairABI from "./abis/pair.json";
import masterChefABI from "./abis/masterchef.json";
import smartChefABI from "./abis/smartchef.json";
import { getContract, getWeb3 } from "./web3";
import { KISS, KISS_BNB_FARM, KISS_BNB_TOKEN, KISS_TOKEN, MASTERCHEF_CONTRACT, WBNB_TOKEN } from "./constants";
import { pools } from "./pools";
import { multicall } from "./multicall";

interface UserInfoResult {
  amount: BigNumber;
  rewardDebt: BigNumber;
}

export const getTotalStaked = async (address: string, block: string): Promise<number> => {
  const web3 = getWeb3();
  const blockNumber = block === undefined ? await web3.eth.getBlockNumber() : new BigNumber(block).toNumber();
  let balance = new BigNumber(0);

  try {
    // KISS balance in wallet.
    const kissContract = getContract(bep20ABI, KISS, true);
    const kissBalance = await kissContract.methods.balanceOf(address).call(undefined, blockNumber);
    balance = balance.plus(kissBalance);
  } catch (error) {
    console.error(`KISS balance error: ${error}`);
  }

  try {
    // KISS-BNB farm.
    const masterContract = getContract(masterChefABI, MASTERCHEF_CONTRACT, true);
    const kissBnbContract = getContract(pairABI, KISS_BNB_FARM, true);
    const totalSupplyLP = await kissBnbContract.methods.totalSupply().call(undefined, blockNumber);
    const reservesLP = await kissBnbContract.methods.getReserves().call(undefined, blockNumber);
    const kissBnbBalance: UserInfoResult = await masterContract.methods
      .userInfo(1, address)
      .call(undefined, blockNumber);
    const pair: Pair = new Pair(
      new TokenAmount(KISS_TOKEN, reservesLP._reserve0.toString()),
      new TokenAmount(WBNB_TOKEN, reservesLP._reserve1.toString())
    );
    const kissLPBalance = pair.getLiquidityValue(
      pair.token0,
      new TokenAmount(KISS_BNB_TOKEN, totalSupplyLP.toString()),
      new TokenAmount(KISS_BNB_TOKEN, kissBnbBalance.amount.toString()),
      false
    );
    balance = balance.plus(new BigNumber(kissLPBalance.toSignificant(18)).times(1e18));
  } catch (error) {
    console.error(`KISS-BNB LP error: ${error}`);
  }

  try {
    // MasterChef contract.
    const masterContract = getContract(masterChefABI, MASTERCHEF_CONTRACT, true);
    const kissMainStaking: UserInfoResult = await masterContract.methods
      .userInfo(0, address)
      .call(undefined, blockNumber);
    balance = balance.plus(kissMainStaking.amount);
  } catch (error) {
    console.error(`MasterChef error: ${error}`);
  }

  try {
    // Pools balances.
    const poolsFiltered = pools.filter((pool) => blockNumber >= pool.startBlock && blockNumber <= pool.endBlock);
    const calls = poolsFiltered.map((pool) => ({
      address: pool.address,
      name: "userInfo",
      params: [address],
    }));
    const userInfo = await multicall(smartChefABI, calls, blockNumber);
    const balancesMapping = userInfo.reduce(
      (acc: BigNumber, result: UserInfoResult) => acc.plus(new BigNumber(result.amount._hex)),
      new BigNumber(0)
    );

    return balance.plus(balancesMapping).div(1e18).toNumber();
  } catch (error) {
    console.error(`Pools error: ${error}`);
  }

  return balance.toNumber();
};
