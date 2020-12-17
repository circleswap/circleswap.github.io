// check if the user has been invited this address
import { useSingleCallResult } from '../state/multicall/hooks'
import { useInviteContract } from './useContract'
import { isAddress } from '../utils'

export function useUserInvited(account: string | null | undefined): string {
  const parsedAddress = isAddress(account)
  const contract = useInviteContract()
  const invited = useSingleCallResult(contract, 'refererOf', [
    account && parsedAddress ? account : '0x0000000000000000000000000000000000000000'
  ])
  console.log('address', parsedAddress ? account : '0x0000000000000000000000000000000000000000')
  console.log('invited data', invited)

  return invited?.result?.[0]
}
