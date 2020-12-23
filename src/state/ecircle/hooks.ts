import { TransactionResponse } from '@ethersproject/providers'
import { useActiveWeb3React } from '../../hooks'
import { useCircleContract } from '../../hooks/useContract'
import { calculateGasMargin } from '../../utils'
import { useTransactionAdder } from '../transactions/hooks'
import { useJoinNCircle } from '../../hooks/useNCircle'
import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'

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
  const contract = useCircleContract()
  const [name, setName] = useState('')

  useEffect(() => {
    if (account && contract) {
      console.log('query ecircle', account, contract)
      try {
        contract.balanceOf(account).then((res: string) => {
          console.log('res---->', res.toString())
          if (new BigNumber(res.toString()).isGreaterThan(0)) {
            console.log('has circle')
            contract.tokenOfOwnerByIndex(account, '0').then((res: string) => {
              console.log('tokenOfOwnerByIndex---->', res)
              contract.tokenURI(res).then((name: string) => {
                console.log('tokenURI', name)
                setName(name ?? '')
              })
            })
          }
        })
      } catch (e) {
        console.log('e---->')
        setName('')
      }
    }
  }, [account, contract])
  return { id: '', name: name ?? '', address: '' }
}

export function useMyJoinedECircle(): ECircleDetail {
  const contract = useCircleContract()
  const joinedCircle = useJoinNCircle()
  const [name, setName] = useState('')
  useEffect(() => {
    console.log('joinedCircle', joinedCircle.toString())
    if (joinedCircle && new BigNumber(joinedCircle.toString()).isGreaterThan(0)) {
      contract?.tokenURI(joinedCircle.toString()).then((name: string) => {
        setName(name ?? '')
      })
    }
  }, [joinedCircle, contract])
  return { id: '', name: name, address: '' }
}
