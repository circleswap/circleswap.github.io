// check if the user has been invited this address
import { useSingleCallResult } from '../state/multicall/hooks'
import { useCircleContract } from './useContract'
import { isAddress } from '../utils'

export function useUserInvited(account: string | null | undefined): string {
  const parsedAddress = isAddress(account)
  const contract = useCircleContract()
  const invited = useSingleCallResult(contract, 'refererOf', [
    account && parsedAddress ? account : '0x0000000000000000000000000000000000000000'
  ])
  console.log('invited address', invited)
  return invited?.result?.[0]
}

export function useUserRefereeN(account: string | null | undefined): string {
  const parsedAddress = isAddress(account)
  const contract = useCircleContract()
  const value = useSingleCallResult(contract, 'refereeN', [
    account && parsedAddress ? account : '0x0000000000000000000000000000000000000000'
  ])
  console.log('invited address', value)
  return value?.result?.[0]
}

export function useUserReferee2N(account: string | null | undefined): string {
  const parsedAddress = isAddress(account)
  const contract = useCircleContract()
  const value = useSingleCallResult(contract, 'referee2N', [
    account && parsedAddress ? account : '0x0000000000000000000000000000000000000000'
  ])
  console.log('referee2N', value)
  return value?.result?.[0]
}
