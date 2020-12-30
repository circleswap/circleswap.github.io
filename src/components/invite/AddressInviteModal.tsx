import React, { useState } from 'react'
import Modal from '../Modal'
import { AutoColumn, ColumnCenter } from '../Column'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { RowBetween } from '../Row'
import { TYPE, ExternalLink, CloseIcon, CustomLightSpinner, UniTokenAnimated } from '../../theme'
import { ButtonPrimary, ButtonSecondary } from '../Button'
import { useInviteCallback } from '../../state/invite/hooks'
import { useUserInvited } from '../../hooks/useInvited'
import tokenLogo from '../../assets/images/logo-circle.svg'
import Circle from '../../assets/images/blue-loader.svg'
import { Text } from 'rebass'
import AddressInputPanel from '../AddressInputPanel'
import useENS from '../../hooks/useENS'
import { useActiveWeb3React } from '../../hooks'
import { isAddress } from 'ethers/lib/utils'
import Confetti from '../Confetti'
import { useIsTransactionPending } from '../../state/transactions/hooks'
import { getEtherscanLink, shortenAddress } from '../../utils'
import { ZERO_ADDRESS } from '../../constants'
import { Link } from 'react-router-dom'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`

const ConfirmOrLoadingWrapper = styled.div<{ activeBG: boolean }>`
  width: 100%;
  padding: 24px;
  position: relative;
  background: ${({ activeBG }) =>
    activeBG &&
    'radial-gradient(76.02% 75.41% at 1.84% 0%, rgba(255, 0, 122, 0.2) 0%, rgba(33, 114, 229, 0.2) 100%), #FFFFFF;'};
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  border-radius: 100px;
  padding: 16px;
  width: 180px;
`

export default function AddressInviteModal({
  isOpen,
  address,
  onDismiss
}: {
  isOpen: boolean
  address: string
  onDismiss: () => void
}) {
  const { chainId, account } = useActiveWeb3React()

  // state for smart contract input
  const [typed, setTyped] = useState(address)

  function handleRecipientType(val: string) {
    setTyped(val)
  }

  // monitor for third party recipient of claim
  const { address: parsedAddress } = useENS(typed)
  const { t } = useTranslation()
  const invited = useUserInvited(typed)
  const myInvited = useUserInvited(account)

  // used for UI loading states
  const [attempting, setAttempting] = useState<boolean>(false)

  // monitor the status of the claim from contracts and txns
  const { inviteCallback } = useInviteCallback(parsedAddress)

  const [hash, setHash] = useState<string | undefined>()

  // monitor the status of the claim from contracts and txns
  const claimPending = useIsTransactionPending(hash ?? '')
  const claimConfirmed = hash && !claimPending

  // use the hash to monitor this txn

  function onInvite() {
    setAttempting(true)
    inviteCallback()
      .then(hash => {
        setHash(hash)
      })
      // reset modal and log error
      .catch(error => {
        setAttempting(false)
        console.log(error)
      })
  }

  function wrappedOnDismiss() {
    setAttempting(false)
    setHash(undefined)
    setTyped('')
    onDismiss()
  }

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOnDismiss} maxHeight={90}>
      <Confetti start={Boolean(isOpen && claimConfirmed && attempting)} />
      {!attempting && (
        <ContentWrapper gap="lg">
          <TYPE.subHeader fontSize={19} style={{ marginTop: 30 }} textAlign="center" fontWeight={600}>
            {t('enterInviterAddress')}
          </TYPE.subHeader>
          <AutoColumn gap="md" style={{ padding: '1rem', paddingTop: '0' }} justify="flex-start">
            <TYPE.main color={'#30D683'} fontWeight={500}>
              Please enter the inviter address
            </TYPE.main>
            <AddressInputPanel value={typed} onChange={handleRecipientType} />
            {parsedAddress && myInvited && ZERO_ADDRESS !== myInvited && (
              <TYPE.error error={true}>{t('has_already_been_invited')}</TYPE.error>
            )}
            {parsedAddress && !myInvited && <CustomLightSpinner src={Circle} alt="loader" size={'20px'} />}
            {((parsedAddress && ZERO_ADDRESS === invited) || typed === account) && (
              <TYPE.error error={true}>{t('error_address')}</TYPE.error>
            )}
            <RowBetween>
              <ResponsiveButtonSecondary as={Link} padding="8px 16px" to="/">
                {t('join_later')}
              </ResponsiveButtonSecondary>
              <ButtonPrimary
                disabled={
                  !isAddress(parsedAddress ?? '') ||
                  myInvited !== ZERO_ADDRESS ||
                  ZERO_ADDRESS === invited ||
                  typed === account
                }
                padding="16px 16px"
                width="180px"
                borderRadius="100px"
                onClick={onInvite}
              >
                {t('joinECircle')}
              </ButtonPrimary>
            </RowBetween>
          </AutoColumn>
        </ContentWrapper>
      )}
      {(attempting || claimConfirmed) && (
        <ConfirmOrLoadingWrapper activeBG={false}>
          <RowBetween>
            <div />
            <CloseIcon onClick={wrappedOnDismiss} style={{ zIndex: 99 }} stroke="black" />
          </RowBetween>
          <ConfirmedIcon>
            {!claimConfirmed ? (
              <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
            ) : (
              <UniTokenAnimated width="72px" src={tokenLogo} />
            )}
          </ConfirmedIcon>
          <AutoColumn gap="100px" justify={'center'}>
            <AutoColumn gap="12px" justify={'center'}>
              <TYPE.largeHeader fontWeight={600} color="black">
                {claimConfirmed ? t('createdSuccessfully') : t('creating')}
              </TYPE.largeHeader>
              {!claimConfirmed && (
                <Text fontSize={36} color={'#30D683'} fontWeight={800}>
                  {shortenAddress(typed)}
                </Text>
              )}
              {parsedAddress && (
                <TYPE.largeHeader fontWeight={600} color="black">
                  for {shortenAddress(parsedAddress)}
                </TYPE.largeHeader>
              )}
            </AutoColumn>
            {claimConfirmed && (
              <>
                <TYPE.subHeader fontWeight={500} color="black">
                  <span role="img" aria-label="party-hat">
                    🎉{' '}
                  </span>
                  Congratulations:){' '}
                  <span role="img" aria-label="party-hat">
                    🎉
                  </span>
                </TYPE.subHeader>
              </>
            )}
            {attempting && !hash && (
              <TYPE.subHeader color="black">Confirm this transaction in your wallet</TYPE.subHeader>
            )}
            {attempting && hash && !claimConfirmed && chainId && hash && (
              <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')} style={{ zIndex: 99 }}>
                View On Eco Explorer
              </ExternalLink>
            )}
          </AutoColumn>
        </ConfirmOrLoadingWrapper>
      )}
    </Modal>
  )
}
