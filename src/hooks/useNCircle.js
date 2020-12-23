// check if the user has been invited this address
import { useSingleCallResult, useSingleContractMultipleData } from '../state/multicall/hooks'
import { useCircleContract } from './useContract'
import { calculateGasMargin, getRouterContract, isAddress } from '../utils'
import { useActiveWeb3React } from './index'
import BigNumber from 'bignumber.js'
import { ZERO_ADDRESS } from '../constants'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useEffect, useState } from 'react'
export function useJoinCallback(account) {
  const { library, chainId } = useActiveWeb3React()
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
  const { account, chainId, library } = useActiveWeb3React()
  const routerContract = getRouterContract(chainId, library, account)
  const CircleContract = useCircleContract()
  const [invited, setInvited] = useState(false)
  const [swapMore, setSwapMore] = useState(false)

  useEffect(() => {
    if (account) {
      routerContract.swapAmountOf(account).then(res => {
        const less = new BigNumber('1000000000000000000').isGreaterThan(res)
        setSwapMore(!less)
      })
      CircleContract.refererOf(account).then(res => {
        setInvited(res && res !== ZERO_ADDRESS)
      })
    }
  }, [account, CircleContract, routerContract])
  return { invited, swapMore }
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

export function useJoinNCircle() {
  const { account } = useActiveWeb3React()
  const contract = useCircleContract()
  const [id, setID] = useState('')
  useEffect(() => {
    contract.circleOf(account).then(res => {
      setID(res ?? '')
    })
  }, [account, contract])
  return id
}

export function useCircleCount() {
  const contract = useCircleContract()
  const res = useSingleCallResult(contract, 'totalSupply')
  if (res.result && !res.loading) {
    return parseInt(res.result[0])
  }
  return undefined
}

export function useAllCircleData() {
  const circleCount = useCircleCount()
  const contact = useCircleContract()

  const circleIndexes = []
  for (let i = 1; i < (circleCount ?? 0); i++) {
    circleIndexes.push([i])
  }
  console.log('circleIndexes--->', circleIndexes)

  const circles = useSingleContractMultipleData(contact, 'tokenByIndex', circleIndexes)
  console.log('circles', circles)

  const nameIndexes = circles
    .map(item => {
      return item && [item.result?.[0].toString()]
    })
    .filter(item => {
      return item[0]
    })
  console.log('nameindexs', nameIndexes)
  const circleNames = useSingleContractMultipleData(contact, 'tokenURI', nameIndexes)
  return circleNames
    .map(item => {
      return item && item.result?.[0].toString()
    })
    .filter(item => {
      return item
    })
}
