import { ChainId, TokenAmount } from '@uniswap/sdk'
import React, { useState } from 'react'
import { Text } from 'rebass'
import { NavLink } from 'react-router-dom'
// import { darken } from 'polished'
import { useTranslation } from 'react-i18next'

import styled from 'styled-components'

import Logo from '../../assets/svg/logo-light.svg'
import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances, useAggregateUniBalance } from '../../state/wallet/hooks'
import { CardNoise } from '../earn/styled'
import { CountUp } from 'use-count-up'
import { TYPE } from '../../theme'

import { YellowCard } from '../Card'
import Settings from '../Settings'

import Row, { RowFixed } from '../Row'
import Web3Status from '../Web3Status'
import ClaimModal from '../claim/ClaimModal'
import { useToggleSelfClaimModal, useShowClaimPopup } from '../../state/application/hooks'
import { useUserHasAvailableClaim } from '../../state/claim/hooks'
import { useUserHasSubmittedClaim } from '../../state/transactions/hooks'
import { Dots } from '../swap/styleds'
import Modal from '../Modal'
import UniBalanceContent from './UniBalanceContent'
import usePrevious from '../../hooks/usePrevious'
import { isMobile } from 'react-device-detect'
import Menu from '../Menu'

const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  background-color: ${({ theme }) => theme.bg1};
  width: 100%;
  left: 0;
  top: 0;
  position: fixed;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem 3rem;
  z-index: 2;
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
  box-shadow: 0px 6px 19px 0px rgba(12, 29, 66, 0.04);
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    padding: 0 1rem 0;
    width: calc(100%);
    position: fixed;
    border-radius: 0 0 12px 12px;
    display: flex
  `};
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: fit-content!important;
    width: 100%;
    z-index: 99;
    border-radius: 12px 12px 0 0;
    background-color: ${({ theme }) => theme.bg1};
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
  `};
`

const HeaderLinks = styled(Row)`
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    justify-content: flex-start;
`};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${({ theme }) => theme.primary1};
  border: 1px solid ${({ theme }) => theme.primary1};
  border-radius: 100px;
  white-space: nowrap;
  width: 100%;
  padding: 0 1rem;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
`

const UNIAmount = styled(AccountElement)`
  height: 36px;
  font-weight: 500;
  background-color: #ffffff;
  padding: 0 1rem;
  color: ${({ theme }) => theme.primary1};
  border: 1px solid ${({ theme }) => theme.primary1};
`

const UNIWrapper = styled.span`
  width: fit-content;
  position: relative;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }

  :active {
    opacity: 0.9;
  }
`

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const NetworkCard = styled(YellowCard)`
  border-radius: 12px;
  padding: 8px 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`
//
// const LanButton = styled(Button)`
//   height: 35px;
//   padding: 0 2rem;
// `

const UniIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: scale(-5deg);
  }
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 0.5rem;
  font-weight: 500;
  padding-bottom: 14px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding-bottom: 14px;
    padding-top: 12px
  `};

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.primary1};
    ${({ theme }) => theme.mediaWidth.upToSmall`
    border-radius: 0;
    border-bottom: 3px solid ${({ theme }) => theme.primary1};
  `};
  }

  :hover,
  :focus {
    color: ${({ theme }) => theme.primary1};
  }
`

// const StyledExternalLink = styled(ExternalLink).attrs({
//   activeClassName
// })<{ isActive?: boolean }>`
//   ${({ theme }) => theme.flexRowNoWrap}
//   align-items: left;
//   border-radius: 3rem;
//   outline: none;
//   cursor: pointer;
//   text-decoration: none;
//   color: ${({ theme }) => theme.text2};
//   font-size: 1rem;
//   width: fit-content;
//   margin: 0 12px;
//   font-weight: 500;
//
//   &.${activeClassName} {
//     border-radius: 12px;
//     font-weight: 600;
//     color: ${({ theme }) => theme.text1};
//   }
//
//   :hover,
//   :focus {
//     color: ${({ theme }) => darken(0.1, theme.text1)};
//   }
//
//   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//       display: none;
// `}
// `

const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan',
  [ChainId.HT]: 'hecochain'
}

export default function Header() {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [isDark] = useDarkModeManager()

  const toggleClaimModal = useToggleSelfClaimModal()

  const availableClaim: boolean = useUserHasAvailableClaim(account)

  const { claimTxn } = useUserHasSubmittedClaim(account ?? undefined)

  const aggregateBalance: TokenAmount | undefined = useAggregateUniBalance()

  const [showUniBalanceModal, setShowUniBalanceModal] = useState(false)
  const showClaimPopup = useShowClaimPopup()

  const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  const countUpValuePrevious = usePrevious(countUpValue) ?? '0'

  return (
    <HeaderFrame>
      <ClaimModal />
      <Modal isOpen={showUniBalanceModal} onDismiss={() => setShowUniBalanceModal(false)}>
        <UniBalanceContent setShowUniBalanceModal={setShowUniBalanceModal} />
      </Modal>
      <HeaderRow>
        <Title href=".">
          <UniIcon>
            <img width={isMobile ? '20px' : '64px'} src={isDark ? Logo : Logo} alt="logo" />
          </UniIcon>
        </Title>
        <HeaderLinks>
          <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
            {t('swap')}
          </StyledNavLink>
          <StyledNavLink
            id={`pool-nav-link`}
            to={'/pool'}
            isActive={(match, { pathname }) =>
              Boolean(match) ||
              pathname.startsWith('/add') ||
              pathname.startsWith('/remove') ||
              pathname.startsWith('/create') ||
              pathname.startsWith('/find')
            }
          >
            {t('pool')}
          </StyledNavLink>
          <StyledNavLink id={`stake-nav-link`} to={'/CIR'}>
            CIR
          </StyledNavLink>
          <StyledNavLink id={`invite-nav-link`} to={'/invite'}>
            Circle
          </StyledNavLink>
        </HeaderLinks>
      </HeaderRow>
      <HeaderControls>
        <HideSmall>
          <HeaderElement>
            <HideSmall>
              {chainId && NETWORK_LABELS[chainId] && (
                <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
              )}
            </HideSmall>
            {availableClaim && !showClaimPopup && (
              <UNIWrapper onClick={toggleClaimModal}>
                <UNIAmount active={!!account && !availableClaim} style={{ pointerEvents: 'auto' }}>
                  <TYPE.white padding="0 2px">
                    {claimTxn && !claimTxn?.receipt ? <Dots>Claiming CIR</Dots> : 'Claim cir'}
                  </TYPE.white>
                </UNIAmount>
                <CardNoise />
              </UNIWrapper>
            )}
            {!availableClaim && aggregateBalance && (
              <UNIWrapper onClick={() => setShowUniBalanceModal(true)}>
                <UNIAmount active={!!account && !availableClaim} style={{ pointerEvents: 'auto' }}>
                  {account && (
                    <HideSmall>
                      <TYPE.white
                        style={{
                          paddingRight: '.4rem',
                          color: 'rgba(48, 214, 131, 1)'
                        }}
                      >
                        <CountUp
                          key={countUpValue}
                          isCounting
                          start={parseFloat(countUpValuePrevious)}
                          end={parseFloat(countUpValue)}
                          thousandsSeparator={','}
                          duration={1}
                        />
                      </TYPE.white>
                    </HideSmall>
                  )}
                  CIR
                </UNIAmount>
                <CardNoise />
              </UNIWrapper>
            )}
            <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
              {account && userEthBalance ? (
                <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                  {userEthBalance?.toSignificant(4)} HT
                </BalanceText>
              ) : null}
              <Web3Status />
            </AccountElement>
          </HeaderElement>
        </HideSmall>
        <HeaderElementWrap>
          <Settings />
          <Menu onUniClick={() => setShowUniBalanceModal(true)} />
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  )
}
