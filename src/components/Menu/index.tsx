import React, { useRef } from 'react'
import { BookOpen, Code, Info, MessageCircle, PieChart } from 'react-feather'
import styled from 'styled-components'
import { ReactComponent as MenuIcon } from '../../assets/images/menu.svg'
import { useActiveWeb3React } from '../../hooks'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'

import { ExternalLink } from '../../theme'
import { ButtonPrimary } from '../Button'

const StyledMenuIcon = styled(MenuIcon)`
  width: 32px;
  height: 32px;
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
  margin-left: 0.5rem;
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
  right: 0rem;
  z-index: 100;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    top: -17.25rem;
  `};
`

const MenuItem = styled(ExternalLink)`
  flex: 1;
  padding: 0.5rem 0.5rem;
  color: ${({ theme }) => theme.text2};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
  > svg {
    margin-right: 8px;
  }
`

const CODE_LINK = 'https://github.com/Uniswap/uniswap-interface'

export default function Menu() {
  const { account } = useActiveWeb3React()

  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.MENU)
  const toggle = useToggleModal(ApplicationModal.MENU)
  useOnClickOutside(node, open ? toggle : undefined)
  const openClaimModal = useToggleModal(ApplicationModal.ADDRESS_CLAIM)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        <StyledMenuIcon />
      </StyledMenuButton>

      {open && (
        <MenuFlyout>
          <MenuItem id="link" href="https://uniswap.org/">
            <Info size={14} />
            About
          </MenuItem>
          <MenuItem id="link" href="https://uniswap.org/docs/v2">
            <BookOpen size={14} />
            Docs
          </MenuItem>
          <MenuItem id="link" href={CODE_LINK}>
            <Code size={14} />
            Code
          </MenuItem>
          <MenuItem id="link" href="https://discord.gg/EwFs3Pp">
            <MessageCircle size={14} />
            Discord
          </MenuItem>
          <MenuItem id="link" href="https://uniswap.info/">
            <PieChart size={14} />
            Analytics
          </MenuItem>
          {account && (
            <ButtonPrimary onClick={openClaimModal} padding="8px 16px" width="100%" borderRadius="12px" mt="0.5rem">
              Claim CIR
            </ButtonPrimary>
          )}
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
