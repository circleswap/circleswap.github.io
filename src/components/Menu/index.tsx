import React, { useRef } from 'react'
import styled from 'styled-components'
import { ReactComponent as MenuIcon } from '../../assets/images/menu.svg'
import { useActiveWeb3React } from '../../hooks'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import Web3Status from '../Web3Status'
import { Text } from 'rebass'
import { useAggregateUniBalance, useETHBalances } from '../../state/wallet/hooks'
import { TYPE } from '../../theme'
import { useUserHasAvailableClaim } from '../../state/claim/hooks'
import { CountUp } from 'use-count-up/lib'
import usePrevious from '../../hooks/usePrevious'
import { TokenAmount } from '@uniswap/sdk'

const StyledMenuIcon = styled(MenuIcon)`
  width: 25px;
  height: 25px;
  display: none;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: flex
  `};
`

const StyledMenuButton = styled.button`
  border: none;
  margin: 0;
  padding: 0;
  height: 32px;
  width: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    g {
      g {
        g {
          g {
            fill: rgba(48, 214, 131, 1);
          }
        }
      }
    }
  }

  svg {
    margin-top: 2px;
  }
`

const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span`
  min-width: 8.125rem;
  border-radius: 12px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 4rem;
  right: -1rem;
  z-index: 100;
  background-color: ${({ theme }) => theme.bg2};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);

  ${({ theme }) => theme.mediaWidth.upToMedium`
    top: 3rem;
  `};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${({ theme }) => theme.primary1};
  border-radius: 100px;
  white-space: nowrap;
  width: 100%;
  padding: 0 1rem;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
     display: flex;
     flex-direction: column;
     gap: 20px
  `};
`

const UNIAmount = styled(AccountElement)`
  height: 36px;
  font-weight: 500;
  padding: 0 1rem;
  color: ${({ theme }) => theme.primary1};
  border: 1px solid ${({ theme }) => theme.primary1};
  display: flex;
  flex-direction: row;
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
     display: flex;
     flex-direction: row;
     gap: 6px
  `};
`

const BalanceText = styled(Text)`
  margin: 24px 0;
`

export default function Menu({ onUniClick }: { onUniClick: () => void }) {
  const { account } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const availableClaim: boolean = useUserHasAvailableClaim(account)
  const aggregateBalance: TokenAmount | undefined = useAggregateUniBalance()
  const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  const countUpValuePrevious = usePrevious(countUpValue) ?? '0'

  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.MENU)
  const toggle = useToggleModal(ApplicationModal.MENU)
  useOnClickOutside(node, open ? toggle : undefined)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        <StyledMenuIcon />
      </StyledMenuButton>

      {open && (
        <MenuFlyout>
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            <Web3Status />
            {account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0, fontSize: 22 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {userEthBalance?.toSignificant(4)} HT
              </BalanceText>
            ) : null}
            {account && (
              <UNIAmount onClick={onUniClick} active={!!account && !availableClaim} style={{ pointerEvents: 'auto' }}>
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
                CIR
              </UNIAmount>
            )}
          </AccountElement>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
