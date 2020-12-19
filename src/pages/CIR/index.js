import React from 'react'
import styled from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { LightCard } from '../../components/Card'
import { CIRTabs } from '../../components/NavigationTabs'
import { AutoRow, RowBetween } from '../../components/Row'
import { TYPE } from '../../theme'
import QuestionHelper from '../../components/QuestionHelper'
import { ReactComponent as LogoCircle } from '../../assets/images/logo-circle.svg'

export const Container = styled.div`
  margin-top: 12rem;
`

const BodyHeader = styled.div`
  width: 100%;
  height: 48px;
  border-radius: 14px 14px 0px 0px;
  background: ${({ theme }) => theme.primary1};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 41px;
`

const ComingSoon = styled(LightCard)`
  border: 1px solid #888888;
  background-color: ${({ theme }) => theme.bg3};
`

export default function CIR() {
  return (
    <Container>
      <AutoColumn gap="lg">
        <LightCard style={{ padding: '0.5rem 2rem' }}>
          <CIRTabs />
        </LightCard>
        <RowBetween gap="md" style={{ display: 'flex' }}>
          <LightCard style={{ padding: 0, marginRight: 15 }}>
            <BodyHeader>
              Airdrop Weight:
              <QuestionHelper text={"Use this tool to find pairs that don't automatically appear in the interface."} />
            </BodyHeader>
            <AutoColumn gap="lg" style={{ width: 388, padding: 36 }}>
              <AutoRow>
                <TYPE.black fontWeight={500} fontSize={13}>
                  Parent Block Addresses:
                </TYPE.black>
                <TYPE.black fontWeight={500} fontSize={16}>
                  28
                </TYPE.black>
              </AutoRow>
              <AutoRow>
                <TYPE.black fontWeight={500} fontSize={13}>
                  Uncle Block Addresses:
                </TYPE.black>
                <TYPE.black fontWeight={500} fontSize={16}>
                  28
                </TYPE.black>
              </AutoRow>
              <AutoRow>
                <TYPE.black fontWeight={500} fontSize={13}>
                  Total number of airdrops:
                </TYPE.black>
                <TYPE.black fontWeight={500} fontSize={16}>
                  28
                </TYPE.black>
              </AutoRow>
            </AutoColumn>
          </LightCard>
          <LightCard style={{ padding: 0, marginLeft: 15 }}>
            <BodyHeader>
              Airdrop Weight:
              <QuestionHelper text={"Use this tool to find pairs that don't automatically appear in the interface."} />
            </BodyHeader>
            <AutoColumn gap="lg" style={{ width: 388, padding: 36 }}>
              <AutoRow>
                <TYPE.black fontWeight={500} fontSize={13}>
                  My Own Computing Power:
                </TYPE.black>
                <TYPE.black fontWeight={500} fontSize={16}>
                  28
                </TYPE.black>
              </AutoRow>
              <AutoRow>
                <TYPE.black fontWeight={500} fontSize={13}>
                  NCircle Bonus:
                </TYPE.black>
                <TYPE.black fontWeight={500} fontSize={16}>
                  28
                </TYPE.black>
              </AutoRow>
              <AutoRow>
                <TYPE.black fontWeight={500} fontSize={13}>
                  ECircle Bonus:
                </TYPE.black>
                <TYPE.black fontWeight={500} fontSize={16}>
                  28
                </TYPE.black>
              </AutoRow>
            </AutoColumn>
          </LightCard>
        </RowBetween>

        <LightCard>
          <RowBetween style={{ padding: '34px 168px' }}>
            <LogoCircle />
            <TYPE.largeHeader fontWeight={500} fontSize={35}>
              1,000,000CIR
            </TYPE.largeHeader>
          </RowBetween>
        </LightCard>

        <TYPE.black fontWeight={500} fontSize={16}>
          Coming Soon:
        </TYPE.black>
        <RowBetween>
          <ComingSoon style={{ marginRight: 15 }}>
            <AutoColumn gap="lg">
              <TYPE.coming fontWeight={500} fontSize={16}>
                Swap Mining Rewards：28CIR
              </TYPE.coming>
              <TYPE.coming fontWeight={500} fontSize={16}>
                My own swap mining rewards：20CIR
              </TYPE.coming>
              <TYPE.coming fontWeight={500} fontSize={16}>
                NCircle Bonus：8CIR
              </TYPE.coming>
            </AutoColumn>
          </ComingSoon>
          <ComingSoon style={{ marginLeft: 15, height: '100%' }}>
            <TYPE.coming fontWeight={500} fontSize={16}>
              UBI 1.0：28CIR
            </TYPE.coming>
          </ComingSoon>
        </RowBetween>
      </AutoColumn>
    </Container>
  )
}
