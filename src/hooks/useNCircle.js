// check if the user has been invited this address
import { NEVER_RELOAD, useSingleCallResult, useSingleContractMultipleData } from '../state/multicall/hooks'
import { useCircleContract } from './useContract'
import { calculateGasMargin, getRouterContract } from '../utils'
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
  const [swappedAmount, setSwappedAmount] = useState('')
  const [swapMore, setSwapMore] = useState(false)

  useEffect(() => {
    if (account) {
      routerContract.swapAmountOf(account).then(res => {
        const less =
          new BigNumber(res.toString()).isGreaterThan('100000000000000000000') ||
          new BigNumber(res.toString()).isEqualTo('100000000000000000000')
        setSwapMore(less)
        setSwappedAmount(
          new BigNumber(res.toString())
            .dividedBy('1000000000000000000')
            .toFixed(0)
            .toString()
        )
      })
      CircleContract.refererOf(account).then(res => {
        setInvited(res && res !== ZERO_ADDRESS)
      })
    }
  }, [account, CircleContract, routerContract])
  return { invited, swapMore, swappedAmount }
}

export function useNCircle() {
  const { account } = useActiveWeb3React()
  const contract = useCircleContract()
  const [id, setID] = useState(0)

  // const circleQuery = useSingleCallResult(CircleContract, 'balanceOf', [
  //   account && parsedAddress ? account : '0x0000000000000000000000000000000000000000'
  // ])
  // console.log('circleQuery', circleQuery)
  // const circle = circleQuery?.result?.[0].toString()
  // console.log('circle', circle)
  useEffect(() => {
    if (account && contract) {
      contract.balanceOf(account).then(res => {
        setID(res.toString() ?? '')
      })
    }
  }, [account, contract])
  return id
}

export function useJoinNCircle() {
  const { account } = useActiveWeb3React()
  const contract = useCircleContract()
  const [id, setID] = useState(0)
  useEffect(() => {
    if (account && contract) {
      contract.circleOf(account).then(res => {
        setID(res.toString() ?? '')
      })
    }
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
  for (let i = 0; i < (circleCount ?? 0); i++) {
    circleIndexes.push([i])
  }

  const circles = useSingleContractMultipleData(contact, 'tokenByIndex', circleIndexes, NEVER_RELOAD)

  const nameIndexes = circles
    .map(item => {
      return item && [item.result?.[0].toString()]
    })
    .filter(item => {
      return item[0]
    })
  let owners = useSingleContractMultipleData(contact, 'ownerOf', nameIndexes, NEVER_RELOAD)
  const circleNames = useSingleContractMultipleData(contact, 'tokenURI', nameIndexes, NEVER_RELOAD)

  owners = owners.filter(item => {
    return item.result?.[0]
  })
  if (owners.length !== 0) {
    const circleList = circleNames
      .map((item, index) => {
        const circle = {}
        circle.owner = owners[index].result?.[0]
        circle.name = item.result?.[0].toString()
        return circle
      })
      .filter(item => {
        return item
      })
    return circleList
  }

  return []
}
