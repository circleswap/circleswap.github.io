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
import { useStakingInfo, useTotalUniEarned } from '../../state/stake/hooks'
import { useCurrencyBalance, useTokenBalance } from '../../state/wallet/hooks'
import claim from '../../assets/images/claim.png'
import { useCircleContract } from '../../hooks/useContract'
import Modal from '../../components/Modal'
import { LoadingView, SubmittedView } from '../../components/ModalViews'
import { useTransactionAdder } from '../../state/transactions/hooks'

const PageWrapper = styled(AutoColumn)`
  display: flex;
  flex-direction: column;
  overflow: auto;
  width: 538px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: fit-content;
  `};
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
     width: fit-content;
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
     width: 320px;
  `};
`

const ClaimCard = styled(StakeCard)`
  height: 212px;
  padding: 0;
  overflow: hidden;
  align-items: flex-start;
`

ClaimCard.Modal = styled.img`
  position: absolute;
`

ClaimCard.Cover = styled.div`
  opacity: 0.5;
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: #2c2c2c;
  opacity: 0.5;
`

StakeCard.Header = styled.div`
  height: 66px;
  line-height: 66px;
  border-bottom: 1px #c2e4cb solid;
  display: flex;
  justify-content: center;
  width: 100%;
`

export default function Stake() {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)

  const { account, chainId } = useActiveWeb3React()

  const unclaimedAmount = useTotalUniEarned()

  //HT-ETH
  const [currencyA, currencyB] = [
    useCurrency('0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f'),
    useCurrency('0x64ff637fb478863b7468bc97d30a5bf3a428a1fd')
  ]
  const tokenA = wrappedCurrency(currencyA ?? undefined, chainId)
  const tokenB = wrappedCurrency(currencyB ?? undefined, chainId)
  const [, stakingTokenPair] = usePair(tokenA, tokenB)

  const stakingInfo = useStakingInfo(stakingTokenPair)?.[0]
  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, stakingInfo?.stakedAmount?.token)
  const currencyBalance = useCurrencyBalance(
    account ?? undefined,
    stakingInfo?.stakedAmount?.token ?? undefined
  )?.toSignificant(6)

  //HT-BTC
  const [currencyA1, currencyB1] = [
    useCurrency('0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f'),
    useCurrency('0x66a79d23e58475d2738179ca52cd0b41d73f0bea')
  ]
  const tokenA1 = wrappedCurrency(currencyA1 ?? undefined, chainId)
  const tokenB1 = wrappedCurrency(currencyB1 ?? undefined, chainId)

  const [, stakingTokenPair1] = usePair(tokenA1, tokenB1)
  const stakingInfo1 = useStakingInfo(stakingTokenPair1)?.[0]
  const userLiquidityUnstaked1 = useTokenBalance(account ?? undefined, stakingInfo1?.stakedAmount?.token)
  const currencyBalance1 = useCurrencyBalance(
    account ?? undefined,
    stakingInfo1?.stakedAmount?.token ?? undefined
  )?.toSignificant(6)

  //HT-HUSD
  const [currencyA2, currencyB2] = [
    useCurrency('0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f'),
    useCurrency('0x0298c2b32eae4da002a15f36fdf7615bea3da047')
  ]
  const tokenA2 = wrappedCurrency(currencyA2 ?? undefined, chainId)
  const tokenB2 = wrappedCurrency(currencyB2 ?? undefined, chainId)

  const [, stakingTokenPair2] = usePair(tokenA2, tokenB2)
  const stakingInfo2 = useStakingInfo(stakingTokenPair2)?.[0]
  const userLiquidityUnstaked2 = useTokenBalance(account ?? undefined, stakingInfo2?.stakedAmount?.token)
  const currencyBalance2 = useCurrencyBalance(
    account ?? undefined,
    stakingInfo2?.stakedAmount?.token ?? undefined
  )?.toSignificant(6)

  //CIR-HUSD
  const [currencyA3, currencyB3] = [
    useCurrency('0xbe5DF2fac88BB096A973e664171E60586bC5940c'),
    useCurrency('0x0298c2b32eae4da002a15f36fdf7615bea3da047')
  ]
  const tokenA3 = wrappedCurrency(currencyA3 ?? undefined, chainId)
  const tokenB3 = wrappedCurrency(currencyB3 ?? undefined, chainId)

  const [, stakingTokenPair3] = usePair(tokenA3, tokenB3)
  const stakingInfo3 = useStakingInfo(stakingTokenPair3)?.[0]
  const userLiquidityUnstaked3 = useTokenBalance(account ?? undefined, stakingInfo3?.stakedAmount?.token)
  const currencyBalance3 = useCurrencyBalance(
    account ?? undefined,
    stakingInfo3?.stakedAmount?.token ?? undefined
  )?.toSignificant(6)

  //HT-CIR
  const [currencyA4, currencyB4] = [
    useCurrency('0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f'),
    useCurrency('0xbe5DF2fac88BB096A973e664171E60586bC5940c')
  ]
  const tokenA4 = wrappedCurrency(currencyA4 ?? undefined, chainId)
  const tokenB4 = wrappedCurrency(currencyB4 ?? undefined, chainId)

  const [, stakingTokenPair4] = usePair(tokenA4, tokenB4)
  const stakingInfo4 = useStakingInfo(stakingTokenPair4)?.[0]
  const userLiquidityUnstaked4 = useTokenBalance(account ?? undefined, stakingInfo4?.stakedAmount?.token)
  const currencyBalance4 = useCurrencyBalance(
    account ?? undefined,
    stakingInfo4?.stakedAmount?.token ?? undefined
  )?.toSignificant(6)

  // toggle for staking modal and unstaking modal
  const [showStakingModal, setShowStakingModal] = useState(false)
  const [showUnstakingModal, setShowUnstakingModal] = useState(false)
  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

  const [currentPair, setCurrentPair] = useState(0)

  const [hash, setHash] = useState()
  const [attempting, setAttempting] = useState(false)
  const stakingContract = useCircleContract()
  const addTransaction = useTransactionAdder()

  async function onWithdraw() {
    setHash(null)
    setAttempting(true)
    await stakingContract
      .getReward()
      .then(response => {
        addTransaction(response, {
          summary: `Withdraw deposited liquidity`
        })
        setHash(response.hash)
      })
      .catch(error => {
        setAttempting(false)
        console.log(error)
      })
  }

  function wrappedOndismiss() {
    setHash(undefined)
    setAttempting(false)
  }

  return (
    <>
      <PageWrapper>
        <StakeWrapper>
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <TYPE.link textAlign="center" fontSize={19}>
              {t('liquidityMining')}
            </TYPE.link>

            <TYPE.main>{t('stakingTip')}</TYPE.main>

            <TYPE.main>{t('currentAbleLPT')}</TYPE.main>

            <StakeCard gap="lg">
              <StakeCard.Header>
                <TYPE.largeHeader textAlign={'center'} color={theme.text1}>
                  HT-ETH
                </TYPE.largeHeader>
              </StakeCard.Header>
              <AutoColumn style={{ width: '100%' }} gap="md">
                <AutoRow>
                  <TYPE.darkGray>{t('yourStakedAmount')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{stakingInfo?.stakedAmount.toExact()} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('earnedAmount')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{currencyBalance} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('bounds')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{stakingInfo?.earnedAmount?.toSignificant(6)} </TYPE.black>
                </AutoRow>
              </AutoColumn>
              <RowBetween gap="19px" style={{ width: '100%' }}>
                <Button
                  disabled={!stakingInfo}
                  onClick={() => {
                    setCurrentPair(0)
                    setShowUnstakingModal(true)
                  }}
                  style={{ width: '46%' }}
                >
                  {t('claim')}
                </Button>
                <Button
                  disabled={!stakingInfo}
                  onClick={() => {
                    setCurrentPair(0)
                    setShowStakingModal(true)
                  }}
                  style={{ width: '46%' }}
                >
                  {t('confirm')}
                </Button>
              </RowBetween>
            </StakeCard>

            <StakeCard gap="lg">
              <StakeCard.Header>
                <TYPE.largeHeader textAlign={'center'} color={theme.text1}>
                  HT-BTC
                </TYPE.largeHeader>
              </StakeCard.Header>
              <AutoColumn style={{ width: '100%' }} gap="md">
                <AutoRow>
                  <TYPE.darkGray>{t('yourStakedAmount')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{stakingInfo1?.stakedAmount.toExact()} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('earnedAmount')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{currencyBalance1} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('bounds')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{stakingInfo1?.earnedAmount?.toSignificant(6)} </TYPE.black>
                </AutoRow>
              </AutoColumn>
              <RowBetween gap="19px" style={{ width: '100%' }}>
                <Button
                  disabled={!stakingInfo1}
                  onClick={() => {
                    setCurrentPair(1)
                    setShowUnstakingModal(true)
                  }}
                  style={{ width: '46%' }}
                >
                  {t('claim')}
                </Button>
                <Button
                  disabled={!stakingInfo1}
                  onClick={() => {
                    setCurrentPair(1)
                    setShowStakingModal(true)
                  }}
                  style={{ width: '46%' }}
                >
                  {t('confirm')}
                </Button>
              </RowBetween>
            </StakeCard>

            <StakeCard gap="lg">
              <StakeCard.Header>
                <TYPE.largeHeader textAlign={'center'} color={theme.text1}>
                  HT-HUSD
                </TYPE.largeHeader>
              </StakeCard.Header>
              <AutoColumn style={{ width: '100%' }} gap="md">
                <AutoRow>
                  <TYPE.darkGray>{t('yourStakedAmount')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{stakingInfo2?.stakedAmount.toExact()} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('earnedAmount')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{currencyBalance2} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('bounds')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{stakingInfo2?.earnedAmount?.toSignificant(6)} </TYPE.black>
                </AutoRow>
              </AutoColumn>

              <RowBetween gap="19px" style={{ width: '100%' }}>
                <Button
                  disabled={!stakingInfo2}
                  onClick={() => {
                    setCurrentPair(2)
                    setShowUnstakingModal(true)
                  }}
                  style={{ width: '46%' }}
                >
                  {t('claim')}
                </Button>
                <Button
                  disabled={!stakingInfo2}
                  onClick={() => {
                    setCurrentPair(2)
                    setShowStakingModal(true)
                  }}
                  style={{ width: '46%' }}
                >
                  {t('confirm')}
                </Button>
              </RowBetween>
            </StakeCard>

            <StakeCard gap="lg">
              <StakeCard.Header>
                <TYPE.largeHeader textAlign={'center'} color={theme.text1}>
                  CIR-HUSD
                </TYPE.largeHeader>
              </StakeCard.Header>
              <AutoColumn style={{ width: '100%' }} gap="md">
                <AutoRow>
                  <TYPE.darkGray>{t('yourStakedAmount')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{stakingInfo3?.stakedAmount.toExact()} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('earnedAmount')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{currencyBalance3} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('bounds')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{stakingInfo3?.earnedAmount?.toSignificant(6)} </TYPE.black>
                </AutoRow>
              </AutoColumn>
              <RowBetween gap="19px" style={{ width: '100%' }}>
                <Button
                  disabled={!stakingInfo3}
                  onClick={() => {
                    setCurrentPair(3)
                    setShowUnstakingModal(true)
                  }}
                  style={{ width: '46%' }}
                >
                  {t('claim')}
                </Button>
                <Button
                  disabled={!stakingInfo3}
                  onClick={() => {
                    setCurrentPair(3)
                    setShowStakingModal(true)
                  }}
                  style={{ width: '46%' }}
                >
                  {t('confirm')}
                </Button>
              </RowBetween>
            </StakeCard>

            <StakeCard gap="lg">
              <StakeCard.Header>
                <TYPE.largeHeader textAlign={'center'} color={theme.text1}>
                  HT-CIR
                </TYPE.largeHeader>
              </StakeCard.Header>
              <AutoColumn style={{ width: '100%' }} gap="md">
                <AutoRow>
                  <TYPE.darkGray>{t('yourStakedAmount')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{stakingInfo4?.stakedAmount.toExact()} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('earnedAmount')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{currencyBalance4} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('bounds')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{stakingInfo4?.earnedAmount?.toSignificant(6)} </TYPE.black>
                </AutoRow>
              </AutoColumn>
              <RowBetween gap="19px" style={{ width: '100%' }}>
                <Button
                  disabled={!stakingInfo4}
                  onClick={() => {
                    setCurrentPair(4)
                    setShowUnstakingModal(true)
                  }}
                  style={{ width: '46%' }}
                >
                  {t('claim')}
                </Button>
                <Button
                  disabled={!stakingInfo4}
                  onClick={() => {
                    setCurrentPair(4)
                    setShowStakingModal(true)
                  }}
                  style={{ width: '46%' }}
                >
                  {t('confirm')}
                </Button>
              </RowBetween>
            </StakeCard>

            <ClaimCard gap="lg">
              <ClaimCard.Modal src={claim} />
              <ClaimCard.Cover />
              <TYPE.white marginTop={16} marginLeft={23} style={{ zIndex: 1 }} color={'#fff'}>
                {t('total_rewards')}{' '}
              </TYPE.white>
              <TYPE.white marginLeft={23} fontSize={29} style={{ zIndex: 1 }} color={'#fff'}>
                {unclaimedAmount?.toFixed(0, { groupSeparator: ',' } ?? '-')} CIR
              </TYPE.white>
              <Button
                onClick={onWithdraw}
                style={{ zIndex: 1, width: '80%', backgroundColor: '#fff', color: '#30D683', margin: 'auto' }}
              >
                {t('claim_all')}
              </Button>
            </ClaimCard>
          </AutoColumn>
        </StakeWrapper>
      </PageWrapper>

      {stakingInfo && (
        <>
          <StakingModal
            isOpen={showStakingModal && currentPair === 0}
            onDismiss={() => setShowStakingModal(false)}
            stakingInfo={stakingInfo}
            userLiquidityUnstaked={userLiquidityUnstaked}
          />
          <UnstakingModal
            isOpen={showUnstakingModal && currentPair === 0}
            onDismiss={() => setShowUnstakingModal(false)}
            stakingInfo={stakingInfo}
          />
          <ClaimRewardModal
            isOpen={showClaimRewardModal && currentPair === 0}
            onDismiss={() => setShowClaimRewardModal(false)}
            stakingInfo={stakingInfo}
          />
        </>
      )}

      {stakingInfo1 && (
        <>
          <StakingModal
            isOpen={showStakingModal && currentPair === 1}
            onDismiss={() => setShowStakingModal(false)}
            stakingInfo={stakingInfo1}
            userLiquidityUnstaked={userLiquidityUnstaked1}
          />
          <UnstakingModal
            isOpen={showUnstakingModal && currentPair === 1}
            onDismiss={() => setShowUnstakingModal(false)}
            stakingInfo={stakingInfo1}
          />
          <ClaimRewardModal
            isOpen={showClaimRewardModal && currentPair === 1}
            onDismiss={() => setShowClaimRewardModal(false)}
            stakingInfo={stakingInfo1}
          />
        </>
      )}

      {stakingInfo2 && (
        <>
          <StakingModal
            isOpen={showStakingModal && currentPair === 2}
            onDismiss={() => setShowStakingModal(false)}
            stakingInfo={stakingInfo2}
            userLiquidityUnstaked={userLiquidityUnstaked2}
          />
          <UnstakingModal
            isOpen={showUnstakingModal && currentPair === 2}
            onDismiss={() => setShowUnstakingModal(false)}
            stakingInfo={stakingInfo2}
          />
          <ClaimRewardModal
            isOpen={showClaimRewardModal && currentPair === 2}
            onDismiss={() => setShowClaimRewardModal(false)}
            stakingInfo={stakingInfo2}
          />
        </>
      )}

      {stakingInfo3 && (
        <>
          <StakingModal
            isOpen={showStakingModal && currentPair === 3}
            onDismiss={() => setShowStakingModal(false)}
            stakingInfo={stakingInfo3}
            userLiquidityUnstaked={userLiquidityUnstaked3}
          />
          <UnstakingModal
            isOpen={showUnstakingModal && currentPair === 3}
            onDismiss={() => setShowUnstakingModal(false)}
            stakingInfo={stakingInfo3}
          />
          <ClaimRewardModal
            isOpen={showClaimRewardModal && currentPair === 3}
            onDismiss={() => setShowClaimRewardModal(false)}
            stakingInfo={stakingInfo3}
          />
        </>
      )}

      {stakingInfo4 && (
        <>
          <StakingModal
            isOpen={showStakingModal && currentPair === 4}
            onDismiss={() => setShowStakingModal(false)}
            stakingInfo={stakingInfo4}
            userLiquidityUnstaked={userLiquidityUnstaked4}
          />
          <UnstakingModal
            isOpen={showUnstakingModal && currentPair === 4}
            onDismiss={() => setShowUnstakingModal(false)}
            stakingInfo={stakingInfo4}
          />
          <ClaimRewardModal
            isOpen={showClaimRewardModal && currentPair === 4}
            onDismiss={() => setShowClaimRewardModal(false)}
            stakingInfo={stakingInfo4}
          />
        </>
      )}

      <Modal isOpen={attempting || hash} onDismiss={wrappedOndismiss} maxHeight={90}>
        {attempting && !hash && (
          <LoadingView onDismiss={wrappedOndismiss}>
            <AutoColumn gap="12px" justify={'center'}>
              <TYPE.body fontSize={20}>
                Claiming {unclaimedAmount?.toFixed(0, { groupSeparator: ',' } ?? '-')} CIR
              </TYPE.body>
            </AutoColumn>
          </LoadingView>
        )}
        {hash && (
          <SubmittedView onDismiss={wrappedOndismiss} hash={hash}>
            <AutoColumn gap="12px" justify={'center'}>
              <TYPE.largeHeader>Transaction Submitted</TYPE.largeHeader>
              <TYPE.body fontSize={20}>Claimed CIR!</TYPE.body>
            </AutoColumn>
          </SubmittedView>
        )}
      </Modal>
    </>
  )
}
