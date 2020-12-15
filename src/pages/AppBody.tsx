import React from 'react'
import styled from 'styled-components'

export const BodyWrapper = styled.div`
  position: relative;
  width: fit-content;
  min-width: 350px;
  background: ${({ theme }) => theme.bg1};
  border-radius: 30px;
  padding: 1rem;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
