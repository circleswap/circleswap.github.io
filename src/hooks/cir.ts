import { BigNumber } from 'ethers'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useCircleContract } from './useContract'
import { useActiveWeb3React } from './index'
import { ZERO_ADDRESS } from '../constants'

export default function useAirdropWeight(): BigNumber | undefined {
  const contract = useCircleContract()
  const { account } = useActiveWeb3React()
  console.log('airdropWeight', useSingleCallResult(contract, 'airdropWeight', [account ? account : ZERO_ADDRESS]))
  return useSingleCallResult(contract, 'airdropWeight', [account ? account : ZERO_ADDRESS])?.result?.[0]
}
