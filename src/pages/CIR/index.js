import React, { useState } from 'react'
import styled from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { LightCard } from '../../components/Card'
import { useTranslation } from 'react-i18next'
import { AutoRow, RowBetween } from '../../components/Row'
import { TYPE } from '../../theme'
import QuestionHelper from '../../components/QuestionHelper'
import { useUserClaimedReward, useUserReferee2N, useUserRefereeN } from '../../hooks/useInvited'
import { useActiveWeb3React } from '../../hooks'
import { useTotalUniEarned } from '../../state/stake/hooks'
import BigNumber from 'bignumber.js'
import { isMobile } from 'react-device-detect'
import { ButtonConfirmed, ButtonPrimary } from '../../components/Button'
import { useAirdropInfo, useClaimAirdrop } from './useAirdrop'

import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import { calculateGasMargin, getCircleContract } from '../../utils'
import ReactGA from 'react-ga'
import { addTransaction } from '../../state/transactions/actions'
import { Text } from 'rebass'
import { JSBI } from '@uniswap/sdk'

export const Container = styled.div`
  margin: auto;
  padding: 100px 0;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      width: 100%
  `};
`

const BodyHeader = styled.div`
  width: 100%;
  border-radius: 14px 14px 0px 0px;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary1};
`

const ComingSoon = styled(LightCard)`
  border: 1px solid #888888;
  background-color: ${({ theme }) => theme.bg3};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
     width: 90vw;
  `};
`

const Frame = styled(RowBetween)`
  gap: 24px;
  width: 1000px
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: grid!important;
    grid-auto-rows: auto;
    grid-row-gap: 24px;
    width: 100%
  `};
`

const CirCard = styled.div`
  box-shadow: ${({ theme }) => theme.shadow2};
  border-radius: 6px;
  padding: 20px;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    background-color: ${({ theme }) => theme.cardBG};
    width: 36vw
  `};
`

const InfoFrame = styled(LightCard)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 90vw
  `};
`

const LineCard = styled.div`
  flex: 1;
  background-color: ${({ bg }) => bg};
  border-radius: 6px;
  padding: 16px 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ClaimButton = styled(ButtonConfirmed)`
  width: 100%;
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0px 32px 96px 0px rgba(216, 220, 225, 0.37);
  border-radius: 8px;
  margin-top: 20px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  &:focus {
    background: rgba(255, 255, 255, 0.3);
  }

  &:disabled:hover {
    background-color: ${({ theme, altDisabledStyle }) => (altDisabledStyle ? theme.primary1 : theme.bg3)};
    color: ${({ theme, altDisabledStyle }) => (altDisabledStyle ? 'white' : theme.text3)};
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.7' : '1')};
  }
`

export default function CIR() {
  const { t } = useTranslation()
  const { chainId, library, account } = useActiveWeb3React()
  const refereeN = useUserRefereeN(account)
  const referee2N = useUserReferee2N(account)
  const unclaimedAmount = useTotalUniEarned()
  const claimedReward = useUserClaimedReward(account)
  const airdropAmount = useAirdropInfo(account)
  const airdropClaimed = useClaimAirdrop(account)
  const [attemptingTxn, setAttemptingTxn] = useState(false) // clicked confirm
  const [txHash, setTxHash] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const pendingText = `Claiming your airdrop`
  console.log('airdropClaim', airdropClaimed.toFixed(0))
  async function onClaim() {
    console.log('onclaim', chainId, library, account)
    if (!chainId || !library || !account) throw new Error('missing dependencies')
    const contract = getCircleContract(library, account)

    const safeGasEstimate = await contract.estimateGas['airdrop']()
      .then(calculateGasMargin)
      .catch(error => {
        console.error(`estimateGas failed`, 'airdrop', error)
        return undefined
      })

    // all estimations failed...
    console.log('safeGasEstimate', safeGasEstimate)
    if (!BigNumber.isBigNumber(safeGasEstimate)) {
      console.error('This transaction would fail. Please contact support.')
    } else {
      setAttemptingTxn(true)
      await contract
        .airdrop({
          gasLimit: safeGasEstimate
        })
        .then(response => {
          setAttemptingTxn(false)
          addTransaction(response, {
            summary: t('airdrops_claimed')
          })
          setTxHash(response.hash)
          ReactGA.event({
            category: 'Liquidity',
            action: 'Remove',
            label: airdropAmount.toFixed(0)
          })
        })
        .catch(error => {
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          console.error(error)
        })
    }
  }

  function modalHeader() {
    return (
      <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
        {airdropAmount.toFixed(0)} CIR
      </AutoColumn>
    )
  }

  function modalBottom() {
    return (
      <>
        <ButtonPrimary onClick={onClaim}>
          <Text fontWeight={500} fontSize={20}>
            Confirm
          </Text>
        </ButtonPrimary>
      </>
    )
  }

  return (
    <Container>
      <AutoColumn gap="lg">
        <Frame gap="md">
          <InfoFrame style={{ padding: 0 }}>
            <AutoColumn gap="md" style={{ padding: '20px 30px' }}>
              <BodyHeader>
                {t('airdropWeight')}
                <QuestionHelper text={t('ncirclereward')} />
              </BodyHeader>

              <AutoRow justify={'space-between'}>
                <CirCard>
                  <TYPE.black textAlign={'center'} marginBottom={15} fontWeight={500} fontSize={32}>
                    {refereeN ? refereeN.toString() : '**'}
                  </TYPE.black>
                  <TYPE.black textAlign={'center'} fontWeight={500} fontSize={12}>
                    {t('parentBlockAddresses')}
                  </TYPE.black>
                </CirCard>
                <CirCard>
                  <TYPE.black textAlign={'center'} marginBottom={15} fontWeight={500} fontSize={32}>
                    {referee2N ? referee2N.toString() : '**'}
                  </TYPE.black>
                  <TYPE.black textAlign={'center'} fontWeight={500} fontSize={12}>
                    {t('uncleBlockAddresses')}
                  </TYPE.black>
                </CirCard>
              </AutoRow>

              <LineCard bg={'#6EAEF2'} style={{ flexDirection: 'column' }}>
                <RowBetween>
                  <TYPE.white fontWeight={600} fontSize={20}>
                    {airdropAmount.toFixed(0)} CIR
                  </TYPE.white>
                  <TYPE.white fontWeight={600} fontSize={12} width={isMobile ? 80 : 'fit-content'}>
                    {t('numberOfAirdrops')}
                  </TYPE.white>
                </RowBetween>
                <ClaimButton
                  disabled={airdropAmount.equalTo(JSBI.BigInt(0)) || !airdropClaimed.equalTo(JSBI.BigInt(0))}
                  onClick={() => {
                    setShowConfirm(true)
                  }}
                >
                  {!airdropAmount.equalTo(JSBI.BigInt(0)) && !airdropClaimed.equalTo(JSBI.BigInt(0)) ? t('claimed_airdrop') : t('claim')}
                </ClaimButton>
              </LineCard>
            </AutoColumn>
          </InfoFrame>

          <InfoFrame style={{ padding: 0, height: '100%' }}>
            <AutoColumn gap="md" style={{ padding: '20px 30px' }}>
              <BodyHeader>
                {t('liquidityMiningRewards')}
                <QuestionHelper text={t('ecirclereward')} />
              </BodyHeader>

              <AutoRow justify={'space-between'}>
                <CirCard>
                  <TYPE.black textAlign={'center'} marginBottom={15} fontWeight={500} fontSize={isMobile ? 20 : 32}>
                    {unclaimedAmount?.toFixed(0, { groupSeparator: ',' } ?? '**')}
                  </TYPE.black>
                  <TYPE.black textAlign={'center'} fontWeight={500} fontSize={12}>
                    {t('unclaimed')}
                  </TYPE.black>
                </CirCard>
                <CirCard>
                  <TYPE.black textAlign={'center'} marginBottom={15} fontWeight={500} fontSize={isMobile ? 20 : 32}>
                    {claimedReward
                      ? new BigNumber(claimedReward.toString())
                          .dividedBy(1000000000000000000)
                          .toFixed(0)
                          .toString()
                      : '**'}
                  </TYPE.black>
                  <TYPE.black textAlign={'center'} fontWeight={500} fontSize={12}>
                    {t('claimed')}
                  </TYPE.black>
                </CirCard>
              </AutoRow>

              <LineCard bg={'#FFA563'}>
                <TYPE.white marginLeft={16} fontWeight={600} fontSize={20}>
                  **
                </TYPE.white>
                <TYPE.white fontWeight={600} fontSize={12} width={isMobile ? 80 : 'fit-content'}>
                  {t('ownComputingPower')}
                </TYPE.white>
              </LineCard>
            </AutoColumn>
          </InfoFrame>
        </Frame>

        <TYPE.black fontWeight={500} fontSize={16}>
          {t('comingSoon')}:
        </TYPE.black>
        <Frame>
          <ComingSoon>
            <AutoColumn gap="lg">
              <TYPE.coming fontWeight={500} fontSize={16}>
                {t('extraSwapRewards')}：**
              </TYPE.coming>
              <TYPE.coming fontWeight={500} fontSize={16}>
                {t('ownSwapRewards')}：**
              </TYPE.coming>
              <TYPE.coming fontWeight={500} fontSize={16}>
                {t('nCircleBonus')}：**
              </TYPE.coming>
            </AutoColumn>
          </ComingSoon>
          <ComingSoon style={{ height: '100%' }}>
            <TYPE.coming fontWeight={500} fontSize={16}>
              UBI 1.0：**
            </TYPE.coming>
          </ComingSoon>
        </Frame>
      </AutoColumn>

      <TransactionConfirmationModal
        isOpen={showConfirm}
        onDismiss={() => {
          setShowConfirm(false)
          // if there was a tx hash, we want to clear the input
          setTxHash('')
        }}
        attemptingTxn={attemptingTxn}
        hash={txHash ? txHash : ''}
        content={() => (
          <ConfirmationModalContent
            title={t('willReceive')}
            onDismiss={() => {
              setShowConfirm(false)
              // if there was a tx hash, we want to clear the input
              setTxHash('')
            }}
            topContent={modalHeader}
            bottomContent={modalBottom}
          />
        )}
        pendingText={pendingText}
      />
    </Container>
  )
}
