import React from 'react'
import styled from 'styled-components'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { Text } from 'rebass'
import { ButtonPrimary } from '../Button'
import { darken } from 'polished'

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  padding-top: calc(16px + 2rem);
  margin-top: -2rem;
  width: 100%;
  max-width: 480px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  color: ${({ theme }) => theme.text2};
  background-color: ${({ theme }) => theme.white};
  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  transition: transform 300ms ease-in-out;
  z-index: -2;
`

const ProgressWrapper = styled.div`
  width: 100%;
  margin-top: 4px;
  height: 4px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.bg3};
  position: relative;
`

const Progress = styled.div<{ status: 'for' | 'against'; percentageString?: string }>`
  height: 4px;
  border-radius: 4px;
  background-color: ${({ theme, status }) => (status === 'for' ? theme.green1 : theme.red1)};
  width: ${({ percentageString }) => percentageString};
`
const ProgressButton = styled(ButtonPrimary)`
  width: fit-content;
  padding: 6px 12px;
  background-color: ${({ theme }) => theme.bg3};
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.primary1)};
    background-color: ${({ theme }) => theme.primary1};
  }
`

export default function AdvancedSelectPercentDropdown({
  show,
  progressCallback
}: {
  show: boolean
  progressCallback: (progress: string) => void
}) {
  function TradeSummary({ show }: { show: boolean }) {
    return (
      { show } && (
        <>
          <AutoColumn style={{ padding: '12px 20px', height: 136, zIndex: -2 }}>
            <RowBetween>
              <Text>min</Text>
              <Text>max</Text>
            </RowBetween>
            <ProgressWrapper>
              <Progress status={'for'} percentageString={'10'} />
            </ProgressWrapper>
            <RowBetween marginTop={20}>
              <ProgressButton onClick={() => progressCallback('0.2')}>20%</ProgressButton>
              <ProgressButton onClick={() => progressCallback('0.5')}>50%</ProgressButton>
              <ProgressButton onClick={() => progressCallback('0.7')}>70%</ProgressButton>
              <ProgressButton onClick={() => progressCallback('1')}>100%</ProgressButton>
            </RowBetween>
          </AutoColumn>
        </>
      )
    )
  }

  return (
    <AdvancedDetailsFooter show={show} style={{ display: show ? 'block' : 'none' }}>
      <TradeSummary show={show} />
    </AdvancedDetailsFooter>
  )
}
