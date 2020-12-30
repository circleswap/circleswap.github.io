import React from 'react'
import styled from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { LightCard } from '../../components/Card'
import { useTranslation } from 'react-i18next'
import { CIRTabs } from '../../components/NavigationTabs'
import { AutoRow, RowBetween } from '../../components/Row'
import { TYPE } from '../../theme'
import QuestionHelper from '../../components/QuestionHelper'
import { useUserClaimedReward, useUserReferee2N, useUserRefereeN } from '../../hooks/useInvited'
import { useActiveWeb3React } from '../../hooks'
import { useTotalUniEarned } from '../../state/stake/hooks'
import BigNumber from 'bignumber.js'

export const Container = styled.div``

const BodyHeader = styled.div`
  width: 100%;
  height: 48px;
  border-radius: 14px 14px 0px 0px;
  background: ${({ theme }) => theme.primary1};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 41px;
`

const ComingSoon = styled(LightCard)`
  border: 1px solid #888888;
  background-color: ${({ theme }) => theme.bg3};
`

const Frame = styled(RowBetween)`
  gap: 20px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column;
  `};
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
        <LightCard style={{ padding: '0.5rem 2rem' }}>
          <CIRTabs />
        </LightCard>
        <Frame gap="md" style={{ display: 'flex' }}>
          <LightCard style={{ padding: 0 }}>
            <BodyHeader>
              {t('airdropWeight')}
              <QuestionHelper text={t('ncirclereward')} />
            </BodyHeader>
            <AutoColumn gap="lg" style={{ width: 388, padding: 36 }}>
              <AutoRow>
                <TYPE.black fontWeight={500} fontSize={13}>
                  {t('parentBlockAddresses')}:
                </TYPE.black>
                <TYPE.black marginLeft={16} fontWeight={500} fontSize={16}>
                  {refereeN ? refereeN.toString() : '**'}
                </TYPE.black>
              </AutoRow>
              <AutoRow>
                <TYPE.black fontWeight={500} fontSize={13}>
                  {t('uncleBlockAddresses')}:
                </TYPE.black>
                <TYPE.black marginLeft={16} fontWeight={500} fontSize={16}>
                  {referee2N ? referee2N.toString() : '**'}
                </TYPE.black>
              </AutoRow>
              <AutoRow>
                <TYPE.black fontWeight={500} fontSize={13}>
                  {t('numberOfAirdrops')}:
                </TYPE.black>
                <TYPE.black marginLeft={16} fontWeight={500} fontSize={16}>
                  100000
                </TYPE.black>
              </AutoRow>
            </AutoColumn>
          </LightCard>
          <LightCard style={{ padding: 0 }}>
            <BodyHeader>
              {t('liquidityMiningRewards')}
              <QuestionHelper text={t('ecirclereward')} />
            </BodyHeader>
            <AutoColumn gap="lg" style={{ width: 388, padding: 36 }}>
              <AutoRow>
                <TYPE.black fontWeight={500} fontSize={13}>
                  {t('ownComputingPower')}:
                </TYPE.black>
                <TYPE.black fontWeight={500} fontSize={16}></TYPE.black>
              </AutoRow>
              <AutoRow>
                <TYPE.black fontWeight={500} fontSize={13}>
                  {t('Unclaimed')}:
                </TYPE.black>
                <TYPE.black style={{ padding: 0 }} marginLeft={16} fontWeight={500} fontSize={16}>
                  {unclaimedAmount?.toFixed(0, { groupSeparator: ',' } ?? '**')} CIR
                </TYPE.black>
              </AutoRow>
              <AutoRow>
                <TYPE.black fontWeight={500} fontSize={13}>
                  {t('claimed')}:
                </TYPE.black>
                <TYPE.black style={{ padding: 0 }} marginLeft={16} fontWeight={500} fontSize={16}>
                  {claimedReward
                    ? new BigNumber(claimedReward.toString())
                        .dividedBy(1000000000000000000)
                        .toFixed(0)
                        .toString()
                    : '**'}
                </TYPE.black>
              </AutoRow>
            </AutoColumn>
          </LightCard>
        </Frame>

        {/*<LightCard>*/}
        {/*  <RowBetween style={{ padding: '34px 168px' }}>*/}
        {/*    <LogoCircle />*/}
        {/*    <TYPE.largeHeader fontWeight={500} fontSize={35}>*/}
        {/*      0CIR*/}
        {/*    </TYPE.largeHeader>*/}
        {/*  </RowBetween>*/}
        {/*</LightCard>*/}

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
