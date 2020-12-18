import React from 'react'
import styled from 'styled-components'
import useCopyClipboard from '../../hooks/useCopyClipboard'

import { LinkStyledButton } from '../../theme'
import { ReactComponent as Copy } from '../../assets/images/copy.svg'

const CopyIcon = styled(LinkStyledButton)`
  color: ${({ theme }) => theme.text3};
  flex-shrink: 0;
  display: flex;
  text-decoration: none;
  font-size: 0.825rem;
  :hover,
  :active,
  :focus {
    text-decoration: none;
    color: ${({ theme }) => theme.text2};
  }
`
const TransactionStatusText = styled.span`
  font-size: 0.825rem;
  height: 40px;
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
`

const StyledMenuIcon = styled(Copy)`
  width: 40px;
  height: 40px;
`

export default function CopyHelper(props: { toCopy: string; children?: React.ReactNode }) {
  const [isCopied, setCopied] = useCopyClipboard()

  return (
    <CopyIcon onClick={() => setCopied(props.toCopy)}>
      {isCopied ? (
        <TransactionStatusText>
          <TransactionStatusText>Copied</TransactionStatusText>
        </TransactionStatusText>
      ) : (
        <TransactionStatusText>
          <StyledMenuIcon />
        </TransactionStatusText>
      )}
      {isCopied ? '' : props.children}
    </CopyIcon>
  )
}
