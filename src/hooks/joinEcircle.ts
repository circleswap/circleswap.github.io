import { useActiveWeb3React } from './index'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useCircleContract } from './useContract'
import { calculateGasMargin } from '../utils'
import { TransactionResponse } from '@ethersproject/providers'

export function useJoinCallback(
  address: string | null | undefined
): {
  joinCallback: () => Promise<string>
} {
  // get claim data for this account
  const { library, chainId } = useActiveWeb3React()
  // used for popup summary
  const addTransaction = useTransactionAdder()
  const contract = useCircleContract()
  const joinCallback = async function() {
    if (!address || !library || !chainId || !contract) return
    const args = [address]
    console.log('args', contract.estimateGas)
    return contract.estimateGas.joinByOwner(address).then(estimatedGasLimit => {
      console.log('estimatedGasLimit', estimatedGasLimit)
      return contract
        .joinByOwner(...args, { value: null, gasLimit: calculateGasMargin(estimatedGasLimit) })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `mint ${address}`,
            claim: { recipient: address }
          })
          return response.hash
        })
    })
  }

  return { joinCallback }
}
