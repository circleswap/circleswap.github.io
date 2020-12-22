import { TransactionResponse } from '@ethersproject/providers'
import { useActiveWeb3React } from '../../hooks'
import { useCircleContract } from '../../hooks/useContract'
import { calculateGasMargin } from '../../utils'
import { useTransactionAdder } from '../transactions/hooks'

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
