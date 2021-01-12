import React from 'react'
import styled from 'styled-components'
import uImage from '../assets/images/big_unicorn.png'

export const BodyWrapper = styled.div`
  position: relative;
  width: fit-content;
  background: ${({ theme }) => theme.bg3};
  border-radius: 30px;
  padding: 2rem;
`

export const CenterWrapper = styled.div`
  position: relative;
  width: fit-content;
  background: ${({ theme }) => theme.bg3};
  border-radius: 30px;
  padding: 2rem;
  margin: auto;
`

export const CardWrapper = styled.div`
  position: relative;
  width: fit-content;
  border-radius: 22px;
  padding: 1.5rem;
  background-size: 100%;
  background-repeat: repeat;
  background: url(${uImage});
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
