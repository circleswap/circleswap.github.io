import React, { useContext, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { useTranslation } from 'react-i18next'
import { Button, TYPE } from '../../theme'
import { useActiveWeb3React } from '../../hooks'
import { AutoRow, RowFixed } from '../../components/Row'
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
import { CardWrapper } from '../AppBody'
import { Text } from 'rebass'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import CIRToUSDT from '../../assets/logos/cir-husd.png'
import HTToCIR from '../../assets/logos/ht-cir.png'
import RPCToCIR from '../../assets/logos/rpc-cir.png'
import HTToETH from '../../assets/logos/ht-eth.png'
import HTToHBTC from '../../assets/logos/ht-hbtc.png'
import HTToHUSD from '../../assets/logos/ht-husd.png'
import CIRToFilda from '../../assets/logos/cir-filda.svg'

import { useRewards2Token } from './hooks'
import BigNumber from 'bignumber.js'
import { isMobile } from 'react-device-detect'

const PageWrapper = styled(AutoColumn)`
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding-top: 100px;
  &::-webkit-scrollbar {
    width: 0 !important;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: fit-content;
    padding-top: 80px;
    padding: 80px 20px 20px 20px
  `};
`

const StakeWrapper = styled.div`
  display: flex;
  width: 806px;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 20px;
  cursor: pointer;
  color: transparent;
  position: relative;
  background-color: ${({ theme }) => theme.bg1};
  padding: 26px 30px;
  margin-top: 20px;
  gap: 30px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
     width: 100%;
  `};
`

const StakeCard = styled(AutoColumn)`
  width: 363px;
  padding: 19px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  padding-top: 0;
  cursor: pointer;
  color: transparent;
  position: relative;
  background-color: ${({ theme, isConnect }) => (isConnect ? 'rgba(69, 144, 255, 0.08)' : theme.bg3)};
  ${({ theme }) => theme.mediaWidth.upToMedium`
     width: 100%;
     font-size: 12px
  `};
`

const ClaimCard = styled(StakeCard)`
  height: 212px;
  padding: 0;
  overflow: hidden;
  align-items: flex-start;
  width: 100%;
`

ClaimCard.Modal = styled.img`
  position: absolute;
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToMedium`
     height: 100%;
     width: auto;
  `};
`

ClaimCard.Cover = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;

  img {
    height: 100%;
  }
`

StakeCard.Header = styled.div`
  height: 66px;
  line-height: 66px;
  border-bottom: 1px #c2e4cb solid;
  display: flex;
  width: 100%;
  justify-content: center;
  position: relative;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 50px;
    line-height: 50px;
  `};
`

const ButtonRow = styled(RowFixed)`
  gap: 8px;
  justify-content: space-between;
  margin: 0 12px;
  flex-direction: row-reverse;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    justify-content: space-between;
    padding: 0;
    margin: 0
  `};
`

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  padding: 1rem 2rem 1rem 2rem;
  width: 180px;

  :disabled {
    background-color: ${({ theme }) => theme.bg5};
    color: ${({ theme }) => theme.text2};
    cursor: auto;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 8px 16px
    width: 48%;
    font-size: 16px
  `};
`

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  padding: 1rem 2rem 1rem 2rem;
  width: 180px;
  :disabled {
    background-color: ${({ theme }) => theme.bg5};
    color: ${({ theme }) => theme.text2};
    cursor: auto;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 8px 16px
    width: 48%;
    font-size: 16px
  `};
`

const LogosFrame = styled.div`
  position: absolute;
  top: 4px;
  right: 0;

  img {
    height: 20px;
    ${({ theme }) => theme.mediaWidth.upToSmall`
      height: 20px
  `};
  }
`

const TextBG = styled(TYPE.largeHeader)`
  color: #ffffff;
  display: inline-block;
  position: relative;
  margin: auto;
  padding: 0 12px;
  width: 100%;
  text-align: left;
  border-left: 6px solid rgba(48, 214, 131, 1);
  margin-bottom: 20px !important;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 16px
  `};
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    //background: rgba(48, 214, 131, 0.6);
  }
`

const CardFrame = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
    flex-direction: column!important;
    width: 100%
     & > * {
       margin-bottom: 24px;
     }
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: block;
    flex-direction: column!important;
     & > * {
       margin-bottom: 24px;
     }
  `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: block;
    flex-direction: column!important;
     & > * {
       margin-bottom: 24px;
     }
  `};
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

  //RPO-CIR
  const [currencyA5, currencyB5] = [
    useCurrency('0xbe5DF2fac88BB096A973e664171E60586bC5940c'),
    useCurrency('0x3dd639626f106bd818e92bdcb102911c020ced77')
  ]
  const tokenA5 = wrappedCurrency(currencyA5 ?? undefined, chainId)
  const tokenB5 = wrappedCurrency(currencyB5 ?? undefined, chainId)

  const [, stakingTokenPair5] = usePair(tokenA5, tokenB5)
  const stakingInfo5 = useStakingInfo(stakingTokenPair5)?.[0]
  const userLiquidityUnstaked5 = useTokenBalance(account ?? undefined, stakingInfo5?.stakedAmount?.token)
  const currencyBalance5 = useCurrencyBalance(
    account ?? undefined,
    stakingInfo5?.stakedAmount?.token ?? undefined
  )?.toSignificant(6)

  //"FILDA-CIR
  const [currencyA6, currencyB6] = [
    useCurrency('0xe36ffd17b2661eb57144ceaef942d95295e637f0'),
    useCurrency('0xbe5DF2fac88BB096A973e664171E60586bC5940c')
  ]
  const tokenA6 = wrappedCurrency(currencyA6 ?? undefined, chainId)
  const tokenB6 = wrappedCurrency(currencyB6 ?? undefined, chainId)

  const [, stakingTokenPair6] = usePair(tokenA6, tokenB6)
  const stakingInfo6 = useStakingInfo(stakingTokenPair6)?.[0]
  const userLiquidityUnstaked6 = useTokenBalance(account ?? undefined, stakingInfo6?.stakedAmount?.token)
  const currencyBalance6 = useCurrencyBalance(
    account ?? undefined,
    stakingInfo6?.stakedAmount?.token ?? undefined
  )?.toSignificant(6)

  // toggle for staking modal and unstaking modal
  const [showStakingModal, setShowStakingModal] = useState(false)
  const [showUnstakingModal, setShowUnstakingModal] = useState(false)
  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

  const rewards2 = useRewards2Token('0x1533941e32bA810Dd3ce9Bf5603835FfBED46b61')
  const rewards2Token = useCurrency(rewards2.reward2Address)
  //const rewards2Balance = useTokenBalance(account ?? undefined, rewards2Token)?.toExact()
  // const rewards2TotalBalance = useTokenBalance(
  //   '0x1533941e32bA810Dd3ce9Bf5603835FfBED46b61' ?? undefined,
  //   rewards2Token
  // )?.toExact()

  const rewardsFilda = useRewards2Token('0x6f19b9bF01B3bFB31741888B4781107B61b7706D')
  const rewardsFildaToken = useCurrency(rewardsFilda.reward2Address)

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
          summary: t('claimed')
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
        <CardWrapper style={{ maxWidth: 806, width: '100%' }} gap="lg" hasBG={true}>
          <AutoColumn gap="md">
            <TYPE.white textAlign="left" fontSize={22}>
              {t('liquidityMining')}
            </TYPE.white>
            <TYPE.white>{t('stakingTip')}</TYPE.white>
          </AutoColumn>
        </CardWrapper>

        <StakeWrapper>
          <CardFrame gap="lg" style={{ display: isMobile ? 'column' : 'row' }}>
            <StakeCard gap="lg">
              <StakeCard.Header>
                <TYPE.largeHeader textAlign={'center'} color={theme.text1}>
                  HT-ETH
                  <LogosFrame>
                    <img alt="" src={HTToETH} />
                  </LogosFrame>
                </TYPE.largeHeader>
              </StakeCard.Header>
              <AutoColumn style={{ width: '100%' }} gap="md">
                <AutoRow>
                  <TYPE.darkGray>{t('yourStakedAmount')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{stakingInfo?.stakedAmount.toSignificant(6)} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('earnedAmount')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{currencyBalance} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('bounds')}: </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{stakingInfo?.earnedAmount?.toSignificant(6)} </TYPE.black>
                </AutoRow>
              </AutoColumn>
              <ButtonRow gap="19px" style={{ width: '100%' }}>
                <ResponsiveButtonPrimary
                  disabled={!stakingInfo}
                  onClick={() => {
                    setCurrentPair(0)
                    setShowStakingModal(true)
                  }}
                >
                  <Text fontWeight={500} fontSize={16}>
                    {t('stake')}
                  </Text>
                </ResponsiveButtonPrimary>
                <ResponsiveButtonSecondary
                  disabled={!stakingInfo}
                  onClick={() => {
                    setCurrentPair(0)
                    setShowUnstakingModal(true)
                  }}
                >
                  {t('claim')}
                </ResponsiveButtonSecondary>
              </ButtonRow>
            </StakeCard>

            <StakeCard gap="lg">
              <StakeCard.Header>
                <TYPE.largeHeader textAlign={'center'} color={theme.text1}>
                  HT-BTC
                  <LogosFrame>
                    <img alt="" src={HTToHBTC} />
                  </LogosFrame>
                </TYPE.largeHeader>
              </StakeCard.Header>
              <AutoColumn style={{ width: '100%' }} gap="md">
                <AutoRow>
                  <TYPE.darkGray>{t('yourStakedAmount')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{stakingInfo1?.stakedAmount.toSignificant(6)} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('earnedAmount')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{currencyBalance1} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('bounds')}: </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{stakingInfo1?.earnedAmount?.toSignificant(6)} </TYPE.black>
                </AutoRow>
              </AutoColumn>
              <ButtonRow gap="19px" style={{ width: '100%' }}>
                <ResponsiveButtonPrimary
                  disabled={!stakingInfo1}
                  onClick={() => {
                    setCurrentPair(1)
                    setShowStakingModal(true)
                  }}
                >
                  {t('stake')}
                </ResponsiveButtonPrimary>
                <ResponsiveButtonSecondary
                  disabled={!stakingInfo1}
                  onClick={() => {
                    setCurrentPair(1)
                    setShowUnstakingModal(true)
                  }}
                >
                  {t('claim')}
                </ResponsiveButtonSecondary>
              </ButtonRow>
            </StakeCard>

            <StakeCard gap="lg">
              <StakeCard.Header>
                <TYPE.largeHeader textAlign={'center'} color={theme.text1}>
                  HT-HUSD
                  <LogosFrame>
                    <img alt="" src={HTToHUSD} />
                  </LogosFrame>
                </TYPE.largeHeader>
              </StakeCard.Header>
              <AutoColumn style={{ width: '100%' }} gap="md">
                <AutoRow>
                  <TYPE.darkGray>{t('yourStakedAmount')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{stakingInfo2?.stakedAmount.toSignificant(6)} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('earnedAmount')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{currencyBalance2} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('bounds')}: </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{stakingInfo2?.earnedAmount?.toSignificant(6)} </TYPE.black>
                </AutoRow>
              </AutoColumn>

              <ButtonRow gap="19px" style={{ width: '100%' }}>
                <ResponsiveButtonPrimary
                  disabled={!stakingInfo2}
                  onClick={() => {
                    setCurrentPair(2)
                    setShowStakingModal(true)
                  }}
                >
                  {t('stake')}
                </ResponsiveButtonPrimary>
                <ResponsiveButtonSecondary
                  disabled={!stakingInfo2}
                  onClick={() => {
                    setCurrentPair(2)
                    setShowUnstakingModal(true)
                  }}
                >
                  {t('claim')}
                </ResponsiveButtonSecondary>
              </ButtonRow>
            </StakeCard>

            <StakeCard gap="lg">
              <StakeCard.Header>
                <TYPE.largeHeader textAlign={'center'} color={theme.text1}>
                  CIR-HUSD
                  <LogosFrame>
                    <img alt="" src={CIRToUSDT} />
                  </LogosFrame>
                </TYPE.largeHeader>
              </StakeCard.Header>
              <AutoColumn style={{ width: '100%' }} gap="md">
                <AutoRow>
                  <TYPE.darkGray>{t('yourStakedAmount')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{stakingInfo3?.stakedAmount.toSignificant(6)} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('earnedAmount')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{currencyBalance3} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('bounds')}: </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{stakingInfo3?.earnedAmount?.toSignificant(6)} </TYPE.black>
                </AutoRow>
              </AutoColumn>
              <ButtonRow gap="19px" style={{ width: '100%' }}>
                <ResponsiveButtonPrimary
                  disabled={!stakingInfo3}
                  onClick={() => {
                    setCurrentPair(3)
                    setShowStakingModal(true)
                  }}
                >
                  {t('stake')}
                </ResponsiveButtonPrimary>
                <ResponsiveButtonSecondary
                  disabled={!stakingInfo3}
                  onClick={() => {
                    setCurrentPair(3)
                    setShowUnstakingModal(true)
                  }}
                >
                  {t('claim')}
                </ResponsiveButtonSecondary>
              </ButtonRow>
            </StakeCard>

            <StakeCard gap="lg">
              <StakeCard.Header>
                <TYPE.largeHeader textAlign={'center'} color={theme.text1}>
                  HT-CIR
                  <LogosFrame>
                    <img alt="" src={HTToCIR} />
                  </LogosFrame>
                </TYPE.largeHeader>
              </StakeCard.Header>
              <AutoColumn style={{ width: '100%' }} gap="md">
                <AutoRow>
                  <TYPE.darkGray>{t('yourStakedAmount')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{stakingInfo4?.stakedAmount.toSignificant(6)} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('earnedAmount')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{currencyBalance4} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('bounds')}: </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{stakingInfo4?.earnedAmount?.toSignificant(6)} </TYPE.black>
                </AutoRow>
              </AutoColumn>
              <ButtonRow gap="19px" style={{ width: '100%' }}>
                <ResponsiveButtonPrimary
                  disabled={!stakingInfo4}
                  onClick={() => {
                    setCurrentPair(4)
                    setShowStakingModal(true)
                  }}
                >
                  {t('stake')}
                </ResponsiveButtonPrimary>
                <ResponsiveButtonSecondary
                  disabled={!stakingInfo4}
                  onClick={() => {
                    setCurrentPair(4)
                    setShowUnstakingModal(true)
                  }}
                >
                  {t('claim')}
                </ResponsiveButtonSecondary>
              </ButtonRow>
            </StakeCard>

            <TextBG color={theme.text1} style={{ margin: 'auto' }}>
              {t('cooperativeMiningPools')}
            </TextBG>

            <StakeCard gap="lg" isConnect>
              <StakeCard.Header>
                <TYPE.largeHeader textAlign={'center'} color={theme.text1}>
                  RPO-CIR
                  <LogosFrame>
                    <img alt="" src={RPCToCIR} />
                  </LogosFrame>
                </TYPE.largeHeader>
              </StakeCard.Header>
              <AutoColumn style={{ width: '100%' }} gap="md">
                <AutoRow>
                  <TYPE.darkGray>{t('yourStakedAmount')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{stakingInfo5?.stakedAmount.toSignificant(6)} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('earnedAmount')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{currencyBalance5} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('bounds')} CIR:</TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{stakingInfo5?.earnedAmount?.toSignificant(6)} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('bounds')} RPO:</TYPE.darkGray>
                  <TYPE.black marginLeft={16}>
                    {rewards2.ratio && stakingInfo5 && rewards2Token
                      ? new BigNumber(rewards2.ratio)
                          .multipliedBy(stakingInfo5?.earnedAmount.raw)
                          .dividedBy('1000000000000000000')
                          .dividedBy(new BigNumber('10').pow(rewards2Token.decimals))
                          .toFixed(4)
                          .toString()
                      : ''}{' '}
                  </TYPE.black>
                </AutoRow>
              </AutoColumn>
              <ButtonRow gap="19px" style={{ width: '100%' }}>
                <ResponsiveButtonPrimary
                  disabled={!stakingInfo5}
                  onClick={() => {
                    setCurrentPair(5)
                    setShowStakingModal(true)
                  }}
                >
                  {t('stake')}
                </ResponsiveButtonPrimary>
                <ResponsiveButtonSecondary
                  disabled={!stakingInfo5}
                  onClick={() => {
                    setCurrentPair(5)
                    setShowUnstakingModal(true)
                  }}
                >
                  {t('claim')}
                </ResponsiveButtonSecondary>
              </ButtonRow>
            </StakeCard>

            <StakeCard gap="lg" isConnect>
              <StakeCard.Header>
                <TYPE.largeHeader textAlign={'center'} color={theme.text1}>
                  FILDA-CIR
                  <LogosFrame>
                    <img alt="" src={CIRToFilda} />
                  </LogosFrame>
                </TYPE.largeHeader>
              </StakeCard.Header>
              <AutoColumn style={{ width: '100%' }} gap="md">
                <AutoRow>
                  <TYPE.darkGray>{t('yourStakedAmount')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{stakingInfo6?.stakedAmount.toSignificant(6)} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('earnedAmount')} </TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{currencyBalance6} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('bounds')} CIR:</TYPE.darkGray>
                  <TYPE.black marginLeft={16}>{stakingInfo6?.earnedAmount?.toSignificant(6)} </TYPE.black>
                </AutoRow>
                <AutoRow>
                  <TYPE.darkGray>{t('bounds')} FILDA:</TYPE.darkGray>
                  <TYPE.black marginLeft={16}>
                    {rewardsFilda.ratio && stakingInfo6 && rewardsFildaToken
                      ? new BigNumber(rewardsFilda.ratio)
                          .multipliedBy(stakingInfo5?.earnedAmount.raw)
                          .dividedBy('1000000000000000000')
                          .dividedBy(new BigNumber('10').pow(rewardsFildaToken.decimals))
                          .toFixed(4)
                          .toString()
                      : ''}{' '}
                  </TYPE.black>
                </AutoRow>
              </AutoColumn>
              <ButtonRow gap="19px" style={{ width: '100%' }}>
                <ResponsiveButtonPrimary
                  disabled={!stakingInfo5}
                  onClick={() => {
                    setCurrentPair(5)
                    setShowStakingModal(true)
                  }}
                >
                  {t('stake')}
                </ResponsiveButtonPrimary>
                <ResponsiveButtonSecondary
                  disabled={!stakingInfo5}
                  onClick={() => {
                    setCurrentPair(5)
                    setShowUnstakingModal(true)
                  }}
                >
                  {t('claim')}
                </ResponsiveButtonSecondary>
              </ButtonRow>
            </StakeCard>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
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
                  style={{ zIndex: 1, width: '60%', backgroundColor: '#fff', color: '#30D683', margin: 'auto' }}
                >
                  {t('claim_all')}
                </Button>
              </ClaimCard>
            </div>
          </CardFrame>
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

      {stakingInfo5 && (
        <>
          <StakingModal
            isOpen={showStakingModal && currentPair === 5}
            onDismiss={() => setShowStakingModal(false)}
            stakingInfo={stakingInfo5}
            userLiquidityUnstaked={userLiquidityUnstaked5}
          />
          <UnstakingModal
            isOpen={showUnstakingModal && currentPair === 5}
            onDismiss={() => setShowUnstakingModal(false)}
            stakingInfo={stakingInfo5}
            rewards2={
              rewards2.ratio && stakingInfo5 && rewards2Token
                ? new BigNumber(rewards2.ratio)
                    .multipliedBy(stakingInfo5?.earnedAmount.raw)
                    .dividedBy('1000000000000000000')
                    .dividedBy(new BigNumber('10').pow(rewards2Token.decimals))
                    .toFixed(4)
                    .toString()
                : ''
            }
            rewardFilda={
              rewardsFilda.ratio && stakingInfo6 && rewardsFildaToken
                ? new BigNumber(rewardsFilda.ratio)
                    .multipliedBy(stakingInfo5?.earnedAmount.raw)
                    .dividedBy('1000000000000000000')
                    .dividedBy(new BigNumber('10').pow(rewardsFildaToken.decimals))
                    .toFixed(4)
                    .toString()
                : ''
            }
          />
          <ClaimRewardModal
            isOpen={showClaimRewardModal && currentPair === 5}
            onDismiss={() => setShowClaimRewardModal(false)}
            stakingInfo={stakingInfo5}
          />
        </>
      )}

      {stakingInfo6 && (
        <>
          <StakingModal
            isOpen={showStakingModal && currentPair === 6}
            onDismiss={() => setShowStakingModal(false)}
            stakingInfo={stakingInfo6}
            userLiquidityUnstaked={userLiquidityUnstaked6}
          />
          <UnstakingModal
            isOpen={showUnstakingModal && currentPair === 6}
            onDismiss={() => setShowUnstakingModal(false)}
            stakingInfo={stakingInfo6}
            rewards2={
              rewards2.ratio && stakingInfo6 && rewards2Token
                ? new BigNumber(rewards2.ratio)
                    .multipliedBy(stakingInfo5?.earnedAmount.raw)
                    .dividedBy('1000000000000000000')
                    .dividedBy(new BigNumber('10').pow(rewards2Token.decimals))
                    .toFixed(4)
                    .toString()
                : ''
            }
          />
          <ClaimRewardModal
            isOpen={showClaimRewardModal && currentPair === 6}
            onDismiss={() => setShowClaimRewardModal(false)}
            stakingInfo={stakingInfo6}
          />
        </>
      )}

      <Modal isOpen={attempting || hash} onDismiss={wrappedOndismiss} maxHeight={90}>
        {attempting && !hash && (
          <LoadingView onDismiss={wrappedOndismiss}>
            <AutoColumn gap="12px" justify={'center'}>
              <TYPE.body fontSize={20}>
                Claiming {unclaimedAmount?.toFixed(0, { groupSeparator: ',' } ?? '-')} CIR Claiming{' '}
              </TYPE.body>
              {currentPair === 5
                ? rewards2.ratio && stakingInfo5 && rewards2Token
                  ? new BigNumber(rewards2.ratio)
                      .multipliedBy(stakingInfo5?.earnedAmount.raw)
                      .dividedBy('1000000000000000000')
                      .dividedBy(new BigNumber('10').pow(rewards2Token.decimals))
                      .toFixed(4)
                      .toString()
                  : ''
                : ''}{' '}
              RPO
              <TYPE.body fontSize={20}></TYPE.body>
            </AutoColumn>
          </LoadingView>
        )}
        {hash && (
          <SubmittedView onDismiss={wrappedOndismiss} hash={hash}>
            <AutoColumn gap="12px" justify={'center'}>
              <TYPE.largeHeader>Transaction Submitted</TYPE.largeHeader>
              <TYPE.body fontSize={20}>Claimed CIR!</TYPE.body>
              {currentPair === 5 && <TYPE.body fontSize={20}>Claimed PRO!</TYPE.body>}
            </AutoColumn>
          </SubmittedView>
        )}
      </Modal>
    </>
  )
}
