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
