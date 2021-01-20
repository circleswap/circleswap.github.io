import { useStakingContract } from '../../hooks/useContract'
import { useState } from 'react'

export function useRewards2Token(address) {
  const [ratio, setRatio] = useState()
  const [reward2Address, setReward2Address] = useState()

  const contract = useStakingContract(address, false)
  contract.rewards2Ratio().then(res => {
    setRatio(res.toString())
  })
  contract.rewards2Token().then(res => {
    setReward2Address(res)
  })

  return { ratio, reward2Address }
}

export function usePoolClosed(address) {
  const [closed, setClosed] = useState()

  const contract = useStakingContract(address, false)
  contract.periodFinish().then(res => {
    const time = new Date(res * 1000)
    const now = new Date()
    setClosed(now - time > 0)
  })

  return closed
}
