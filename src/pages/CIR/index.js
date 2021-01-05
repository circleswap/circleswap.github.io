import React from 'react'
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

export const Container = styled.div`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      
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
  gap: 24px
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: grid!important;
    grid-auto-rows: auto;
    grid-row-gap: 24px;
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

export default function CIR() {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const refereeN = useUserRefereeN(account)
  const referee2N = useUserReferee2N(account)
  const unclaimedAmount = useTotalUniEarned()
  const claimedReward = useUserClaimedReward(account)

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

              <LineCard bg={'#6EAEF2'}>
                <TYPE.white fontWeight={600} fontSize={20}>
                  1,000,000
                </TYPE.white>
                <TYPE.white fontWeight={600} fontSize={12} width={80}>
                  {t('numberOfAirdrops')}
                </TYPE.white>
              </LineCard>
            </AutoColumn>
          </InfoFrame>

          <InfoFrame style={{ padding: 0 }}>
            <AutoColumn gap="md" style={{ padding: '20px 30px' }}>
              <BodyHeader>
                {t('liquidityMiningRewards')}
                <QuestionHelper text={t('ecirclereward')} />
              </BodyHeader>

              <AutoRow justify={'space-between'}>
                <CirCard>
                  <TYPE.black textAlign={'center'} marginBottom={15} fontWeight={500} fontSize={20}>
                    {unclaimedAmount?.toFixed(0, { groupSeparator: ',' } ?? '**')}
                  </TYPE.black>
                  <TYPE.black textAlign={'center'} fontWeight={500} fontSize={12}>
                    {t('unclaimed')}
                  </TYPE.black>
                </CirCard>
                <CirCard>
                  <TYPE.black textAlign={'center'} marginBottom={15} fontWeight={500} fontSize={20}>
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
                <TYPE.white fontWeight={600} fontSize={12} width={80}>
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
    </Container>
  )
}
