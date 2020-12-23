import React, { useContext, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { useTranslation } from 'react-i18next'
import { Button, TYPE } from '../../theme'
import { useActiveWeb3React } from '../../hooks'
import { AutoRow, RowBetween } from '../../components/Row'
import StakingModal from '../../components/earn/StakingModal'
import UnstakingModal from '../../components/earn/UnstakingModal'
import ClaimRewardModal from '../../components/earn/ClaimRewardModal'
import { useCurrency } from '../../hooks/Tokens'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import { usePair } from '../../data/Reserves'
import { useStakingInfo } from '../../state/stake/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'

const PageWrapper = styled(AutoColumn)`
  width: 538px;
  display: flex;
  flex-direction: column;
  padding-top: 120px;
`

const StakeWrapper = styled.div`
  padding: 38px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  cursor: pointer;
  color: transparent;
  position: relative;
  background-color: ${({ theme }) => theme.bg1};
  ${({ theme }) => theme.mediaWidth.upToMedium`
     width: 100%;
  `};
`

const StakeCard = styled(AutoColumn)`
  padding: 19px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  padding-top: 0;
  cursor: pointer;
  color: transparent;
  position: relative;
  background-color: ${({ theme }) => theme.bg3};
  ${({ theme }) => theme.mediaWidth.upToMedium`
     width: 100%;
  `};
`

StakeCard.Header = styled.div`
  height: 66px;
  line-height: 66px;
  width: 100%;
  border-bottom: 1px #c2e4cb solid;
  display: flex;
  justify-content: center;
`

export default function Stake() {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)

  const { account, chainId } = useActiveWeb3React()

  const [currentStaking, setCurrentStaking] = useState()

  const [currencyA, currencyB] = [
    useCurrency('0xc778417e063141139fce010982780140aa0cd5ab'),
    useCurrency('0x20D0faBD8bB63dAC87157cA4d94654F6467076d6')
  ]
  const tokenA = wrappedCurrency(currencyA ?? undefined, chainId)
  const tokenB = wrappedCurrency(currencyB ?? undefined, chainId)

  const [, stakingTokenPair] = usePair(tokenA, tokenB)

  const stakingInfo = useStakingInfo(stakingTokenPair)?.[0]

  const [currencyA1, currencyB1] = [
    useCurrency('0xc778417e063141139fce010982780140aa0cd5ab'),
    useCurrency('0x20D0faBD8bB63dAC87157cA4d94654F6467076d6')
  ]
  const tokenA1 = wrappedCurrency(currencyA1 ?? undefined, chainId)
  const tokenB1 = wrappedCurrency(currencyB1 ?? undefined, chainId)

  const [, stakingTokenPair1] = usePair(tokenA1, tokenB1)

  const stakingInfo1 = useStakingInfo(stakingTokenPair1)?.[0]

  // detect existing unstaked LP position to show add button if none found
  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, stakingInfo?.stakedAmount?.token)

  // toggle for staking modal and unstaking modal
  const [showStakingModal, setShowStakingModal] = useState(false)
  const [showUnstakingModal, setShowUnstakingModal] = useState(false)
  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)
  return (
    <>
      <PageWrapper>
        <StakeWrapper style={{ marginTop: 100 }}>
          <AutoColumn gap="lg">
            <TYPE.link textAlign="center" fontSize={19}>
              {t('liquidityMining')}
            </TYPE.link>

            <TYPE.main>
              {t('质押您的LP Tokens来参与CircleSwap流动性挖矿，流动性挖矿的收益将以平台通证CIR的形式进行发放。')}
            </TYPE.main>

            <TYPE.main>{t('目前可进行流动挖矿的交易对：')}</TYPE.main>

            <StakeCard gap="lg">
              <StakeCard.Header>
                <TYPE.largeHeader textAlign={'center'} color={theme.text1}>
                  {t('HT-CIR')}
                </TYPE.largeHeader>
              </StakeCard.Header>
              <AutoColumn style={{ width: '100%' }} gap="md">
                <AutoRow>
                  <TYPE.darkGray>您当前的质押量： </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{stakingInfo?.stakedAmount.toExact()} </TYPE.black>
                </AutoRow>
              </AutoColumn>
              <RowBetween gap="19px" style={{ width: '100%' }}>
                <Button
                  disabled={!stakingInfo}
                  onClick={() => {
                    setShowUnstakingModal(true)
                  }}
                  style={{ width: '46%' }}
                >
                  {'赎回'}
                </Button>
                <Button
                  disabled={!stakingInfo}
                  onClick={() => {
                    setShowStakingModal(true)
                  }}
                  style={{ width: '46%' }}
                >
                  {t('confirm')}
                </Button>
              </RowBetween>
            </StakeCard>

            {/*<StakeCard gap="lg">*/}
            {/*  <StakeCard.Header>*/}
            {/*    <TYPE.largeHeader textAlign={'center'} color={theme.text1}>*/}
            {/*      {t('HT-CIR')}*/}
            {/*    </TYPE.largeHeader>*/}
            {/*  </StakeCard.Header>*/}
            {/*  <AutoColumn style={{ width: '100%' }} gap="md">*/}
            {/*    <AutoRow>*/}
            {/*      <TYPE.darkGray>您当前的质押量： </TYPE.darkGray>*/}
            {/*      <TYPE.black marginLeft={16}>{stakingInfo?.stakedAmount.toExact()} </TYPE.black>*/}
            {/*    </AutoRow>*/}
            {/*  </AutoColumn>*/}
            {/*  <RowBetween gap="19px" style={{ width: '100%' }}>*/}
            {/*    <Button*/}
            {/*      disabled={!stakingInfo}*/}
            {/*      onClick={() => {*/}
            {/*        setShowUnstakingModal(true)*/}
            {/*      }}*/}
            {/*      style={{ width: '46%' }}*/}
            {/*    >*/}
            {/*      {'赎回'}*/}
            {/*    </Button>*/}
            {/*    <Button*/}
            {/*      disabled={!stakingInfo}*/}
            {/*      onClick={() => {*/}
            {/*        setShowStakingModal(true)*/}
            {/*      }}*/}
            {/*      style={{ width: '46%' }}*/}
            {/*    >*/}
            {/*      {t('confirm')}*/}
            {/*    </Button>*/}
            {/*  </RowBetween>*/}
            {/*</StakeCard>*/}
          </AutoColumn>
        </StakeWrapper>
      </PageWrapper>

      {stakingInfo && (
        <>
          <StakingModal
            isOpen={showStakingModal}
            onDismiss={() => setShowStakingModal(false)}
            stakingInfo={stakingInfo}
            userLiquidityUnstaked={userLiquidityUnstaked}
          />
          <UnstakingModal
            isOpen={showUnstakingModal}
            onDismiss={() => setShowUnstakingModal(false)}
            stakingInfo={stakingInfo}
          />
          <ClaimRewardModal
            isOpen={showClaimRewardModal}
            onDismiss={() => setShowClaimRewardModal(false)}
            stakingInfo={stakingInfo}
          />
        </>
      )}
    </>
  )
}
