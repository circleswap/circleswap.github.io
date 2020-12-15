import { Trade } from '@uniswap/sdk'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { TYPE } from '../../theme'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import { SectionBreak } from './styleds'
import SwapRoute from './SwapRoute'
import { ButtonPrimary } from '../Button'
import { Text } from 'rebass'
import { darken } from 'polished'

// const InfoLink = styled(ExternalLink)`
//   width: 100%;
//   border: 1px solid ${({ theme }) => theme.bg3};
//   padding: 6px 6px;
//   border-radius: 8px;
//   text-align: center;
//   font-size: 14px;
//   color: ${({ theme }) => theme.text1};
// `

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

function TradeSummary({ trade, allowedSlippage }: { trade: Trade; allowedSlippage: number }) {
  return (
    <>
      <AutoColumn style={{ padding: '012px 20px' }}>
        <RowBetween>
          <Text>min</Text>
          <Text>max</Text>
        </RowBetween>
        <ProgressWrapper>
          <Progress status={'for'} percentageString={''} />
        </ProgressWrapper>
        <RowBetween marginTop={20}>
          <ProgressButton>20%</ProgressButton>
          <ProgressButton>50%</ProgressButton>
          <ProgressButton>70%</ProgressButton>
          <ProgressButton>100%</ProgressButton>
        </RowBetween>
      </AutoColumn>
    </>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade
}

export function AdvancedSwapSelectPercent({ trade }: AdvancedSwapDetailsProps) {
  const theme = useContext(ThemeContext)

  const [allowedSlippage] = useUserSlippageTolerance()

  const showRoute = Boolean(trade && trade.route.path.length > 2)

  return (
    <AutoColumn gap="md">
      {trade && (
        <>
          <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
          {showRoute && (
            <>
              <SectionBreak />
              <AutoColumn style={{ padding: '0 24px' }}>
                <RowFixed>
                  <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                    Route
                  </TYPE.black>
                  <QuestionHelper text="Routing through these tokens resulted in the best price for your trade." />
                </RowFixed>
                <SwapRoute trade={trade} />
              </AutoColumn>
            </>
          )}
        </>
      )}
    </AutoColumn>
  )
}
