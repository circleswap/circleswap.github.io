import { useActiveWeb3React } from '../../hooks'
import { isAddress } from '../../utils'
import { useCircleContract } from '../../hooks/useContract'
import { useSingleCallResult } from '../multicall/hooks'

export function useNCircle() {
  const { account, chainId, library } = useActiveWeb3React()
  const parsedAddress = isAddress(account)
  const CircleContract = useCircleContract()
  const circleQuery = useSingleCallResult(CircleContract, 'balanceOf', [
    account && parsedAddress ? account : '0x0000000000000000000000000000000000000000'
  ])
  console.log('circleQuery', circleQuery)
  const circle = circleQuery?.result?.[0].toString()
  console.log('circle', circle)

  return circle
}