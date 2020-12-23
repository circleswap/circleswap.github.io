import { TransactionResponse } from '@ethersproject/providers'
import { useActiveWeb3React } from '../../hooks'
import { useCircleContract } from '../../hooks/useContract'
import { calculateGasMargin, isAddress } from '../../utils'
import { useTransactionAdder } from '../transactions/hooks'
import { useSingleCallResult } from '../multicall/hooks'
import { useJoinNCircle } from '../../hooks/useNCircle'
import { useMemo } from 'react'

export function useMintCallback(
  name: string | null | undefined,
  level: bigint | null | undefined
): {
  mintCallback: () => Promise<string>
} {
  // get claim data for this account
  const { library, chainId } = useActiveWeb3React()
  // used for popup summary
  const addTransaction = useTransactionAdder()
  const contract = useCircleContract()
  const mintCallback = async function() {
    if (!name || !level || !library || !chainId || !contract) return
    const args = [name, level]
    console.log('args', args)
    return contract.estimateGas['mint'](...args, {}).then(estimatedGasLimit => {
      return contract
        .mint(...args, { value: null, gasLimit: calculateGasMargin(estimatedGasLimit) })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `mint ${name}`,
            claim: { recipient: name }
          })
          return response.hash
        })
    })
  }

  return { mintCallback }
}

interface ECircleDetail {
  id: string
  name: string
  address: string
}

export function useMyECircle(): ECircleDetail {
  const { account } = useActiveWeb3React()
  const parsedAddress = isAddress(account)
  const contract = useCircleContract()
  const value = useSingleCallResult(contract, 'tokenOfOwnerByIndex', [
    account && parsedAddress ? account : '0x0000000000000000000000000000000000000000',
    0
  ])
  const name = useSingleCallResult(contract, 'tokenURI', [value?.result?.[0].toString()])
  const circle = useMemo(() => {
    return { id: value?.result?.[0].toString(), name: name?.result?.[0].toString(), address: '' }
  }, [value, name])
  return circle
}

export function useMyJoinedECircle(): ECircleDetail {
  const contract = useCircleContract()
  const joinedCircle = useJoinNCircle()
  const name = useSingleCallResult(contract, 'tokenURI', [joinedCircle])
  const circle = useMemo(() => {
    return { id: joinedCircle, name: name?.result?.[0].toString(), address: '' }
  }, [joinedCircle, name])
  return circle
}
