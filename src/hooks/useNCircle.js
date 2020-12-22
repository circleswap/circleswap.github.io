// check if the user has been invited this address
import { useSingleCallResult } from '../state/multicall/hooks'
import { useCircleContract } from './useContract'
import { calculateGasMargin, getRouterContract, isAddress } from '../utils'
import { useActiveWeb3React } from './index'
import BigNumber from 'bignumber.js'
import { ZERO_ADDRESS } from '../constants'
import { useTransactionAdder } from '../state/transactions/hooks'

export function useJoinCallback(account) {
  // get claim data for this account
  const { library, chainId } = useActiveWeb3React()
  // used for popup summary
  const addTransaction = useTransactionAdder()
  const contract = useCircleContract()

  const joinCallback = async function() {
    if (!account || !library || !chainId || !contract) return
    console.log('joinCallback', contract)
    const args = [account]
    return contract.estimateGas['join'](...args, {}).then(estimatedGasLimit => {
      return contract.join(...args, { value: null, gasLimit: calculateGasMargin(estimatedGasLimit) }).then(response => {
        addTransaction(response, {
          summary: `JOIN ${account}`,
          claim: { recipient: account }
        })
        return response.hash
      })
    })
  }

  return { joinCallback }
}

export function useNCircleJoinAble() {
  console.log('tag--->')
  const { account, chainId, library } = useActiveWeb3React()
  const parsedAddress = isAddress(account)
  const routerContract = getRouterContract(chainId, library, account)
  const CircleContract = useCircleContract()
  const swappedAmount = useSingleCallResult(routerContract, 'swapAmountOf', [
    account && parsedAddress ? account : '0x0000000000000000000000000000000000000000'
  ])
  const invitedQuery = useSingleCallResult(CircleContract, 'refererOf', [
    account && parsedAddress ? account : '0x0000000000000000000000000000000000000000'
  ])
  console.log('swappedAmount', swappedAmount.result?.[0].toString())
  const swapMore =
    new BigNumber(swappedAmount.result?.[0].toString()).isGreaterThan('1000000000000000000') ||
    new BigNumber(swappedAmount.result?.[0].toString()).isEqualTo('1000000000000000000')
  const invitedAddress = invitedQuery?.result?.[0]
  console.log('invitedAddress', invitedAddress)
  const invited = invitedAddress && invitedAddress !== ZERO_ADDRESS
  console.log('swapMore', swapMore)
  console.log('invited', invited && swapMore)
  return invited && swapMore
}

export function useNCircle() {
  const { account } = useActiveWeb3React()
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

export function useParentAddress() {
  const { account } = useActiveWeb3React()
  const CircleContract = useCircleContract()
  const idQuery = useSingleCallResult(CircleContract, 'circleOf', [
    account ? account : '0x0000000000000000000000000000000000000000'
  ])
  const circleID = idQuery?.result?.[0].toString()
  console.log('circleID', circleID)
  const circleQuery = useSingleCallResult(CircleContract, 'ownerOf', [circleID])
  const circleAddress = circleQuery?.result?.[0].toString()
  console.log('circleAddress', circleAddress)
  return circleAddress
}
