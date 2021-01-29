import { isAddress } from '../../utils'
import { useCircleContract } from '../../hooks/useContract'
import { useSingleCallResult } from '../../state/multicall/hooks'
import { UNI } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import { ChainId, JSBI, TokenAmount } from '@uniswap/sdk'

export function useAirdropInfo(): TokenAmount {
  const { chainId, account } = useActiveWeb3React()
  const parsedAddress = isAddress(account)
  const contract = useCircleContract()
  console.log('contract', contract)
  const value = useSingleCallResult(contract, 'airdropVol', [
    account && parsedAddress ? account : '0x0000000000000000000000000000000000000000'
  ])

  console.log('airdropVol', value)
  return new TokenAmount(UNI[chainId ? chainId : ChainId.HT], JSBI.BigInt(value.result?.[0] ?? 0))
}

export function useClaimAirdrop(): TokenAmount {
  const { chainId, account } = useActiveWeb3React()
  const parsedAddress = isAddress(account)
  const contract = useCircleContract()
  console.log('contract', contract)
  const value = useSingleCallResult(contract, 'airdropedOf', [
    account && parsedAddress ? account : '0x0000000000000000000000000000000000000000'
  ])

  console.log('airdropVol', value)
  return new TokenAmount(UNI[chainId ? chainId : ChainId.HT], JSBI.BigInt(value.result?.[0] ?? 0))
}
