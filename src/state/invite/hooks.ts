import { TransactionResponse } from '@ethersproject/providers'
import { useActiveWeb3React } from '../../hooks'
import { useCircleContract } from '../../hooks/useContract'
import { calculateGasMargin } from '../../utils'
import { useTransactionAdder } from '../transactions/hooks'

export function useInviteCallback(
  account: string | null | undefined
): {
  inviteCallback: () => Promise<string>
} {
  // get claim data for this account
  const { library, chainId } = useActiveWeb3React()
  // used for popup summary
  const addTransaction = useTransactionAdder()
  const contract = useCircleContract()

  const inviteCallback = async function() {
    if (!account || !library || !chainId || !contract) return
    const args = [account]
    return contract.estimateGas['bind'](...args, {}).then(estimatedGasLimit => {
      return contract
        .bind(...args, { value: null, gasLimit: calculateGasMargin(estimatedGasLimit) })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Invited ${account}`,
            claim: { recipient: account }
          })
          return response.hash
        })
    })
  }

  return { inviteCallback }
}
