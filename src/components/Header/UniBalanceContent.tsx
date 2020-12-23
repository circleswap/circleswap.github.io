import { ChainId, TokenAmount } from '@uniswap/sdk'
import React, { useMemo } from 'react'
import { X } from 'react-feather'
import styled from 'styled-components'
import tokenLogo from '../../assets/images/logo-circle.svg'
import { UNI } from '../../constants'
import { useTotalSupply } from '../../data/TotalSupply'
import { useActiveWeb3React } from '../../hooks'
import { useMerkleDistributorContract } from '../../hooks/useContract'
import useCurrentBlockTimestamp from '../../hooks/useCurrentBlockTimestamp'
import { useTotalUniEarned } from '../../state/stake/hooks'
import { useAggregateUniBalance, useTokenBalance } from '../../state/wallet/hooks'
import { StyledInternalLink, TYPE, UniTokenAnimated } from '../../theme'
import { computeUniCirculation } from '../../utils/computeUniCirculation'
import useUSDCPrice from '../../utils/useUSDCPrice'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { Break, CardSection, DataCard } from '../earn/styled'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`

const ModalUpper = styled(DataCard)`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
`

const StyledClose = styled(X)`
  position: absolute;
  right: 16px;
  top: 16px;

  :hover {
    cursor: pointer;
  }
`

/**
 * Content for balance stats modal
 */
export default function UniBalanceContent({ setShowUniBalanceModal }: { setShowUniBalanceModal: any }) {
  const { account, chainId } = useActiveWeb3React()
  const uni = chainId ? UNI[chainId] : undefined

  const total = useAggregateUniBalance()
  const uniBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, uni)
  const uniToClaim: TokenAmount | undefined = useTotalUniEarned()

  const totalSupply: TokenAmount | undefined = useTotalSupply(uni)
  const uniPrice = useUSDCPrice(uni)
  const blockTimestamp = useCurrentBlockTimestamp()
  const unclaimedUni = useTokenBalance(useMerkleDistributorContract()?.address, uni)
  const circulation: TokenAmount | undefined = useMemo(
    () =>
      blockTimestamp && uni && chainId === ChainId.MAINNET
        ? computeUniCirculation(uni, blockTimestamp, unclaimedUni)
        : totalSupply,
    [blockTimestamp, chainId, totalSupply, unclaimedUni, uni]
  )

  return (
    <ContentWrapper gap="lg">
      <ModalUpper>
        <CardSection gap="md">
          <RowBetween>
            <TYPE.mediumHeader>Your CIR Breakdown</TYPE.mediumHeader>
            <StyledClose onClick={() => setShowUniBalanceModal(false)} />
          </RowBetween>
        </CardSection>
        <Break />
        {account && (
          <>
            <CardSection gap="sm">
              <AutoColumn gap="md" justify="center">
                <UniTokenAnimated width="48px" src={tokenLogo} />{' '}
                <TYPE.subHeader fontSize={48} fontWeight={600} >
                  {total?.toFixed(2, { groupSeparator: ',' })}
                </TYPE.subHeader>
              </AutoColumn>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.subHeader>Balance:</TYPE.subHeader>
                  <TYPE.subHeader>{uniBalance?.toFixed(2, { groupSeparator: ',' })}</TYPE.subHeader>
                </RowBetween>
                <RowBetween>
                  <TYPE.subHeader>Unclaimed:</TYPE.subHeader>
                  <TYPE.subHeader>
                    {uniToClaim?.toFixed(4, { groupSeparator: ',' })}{' '}
                    {uniToClaim && uniToClaim.greaterThan('0') && (
                      <StyledInternalLink onClick={() => setShowUniBalanceModal(false)} to="/uni">
                        (claim)
                      </StyledInternalLink>
                    )}
                  </TYPE.subHeader>
                </RowBetween>
              </AutoColumn>
            </CardSection>
            <Break />
          </>
        )}
        <CardSection gap="sm">
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.subHeader>CIR price:</TYPE.subHeader>
              <TYPE.subHeader>${uniPrice?.toFixed(2) ?? '-'}</TYPE.subHeader>
            </RowBetween>
            <RowBetween>
              <TYPE.subHeader>CIR in circulation:</TYPE.subHeader>
              <TYPE.subHeader>{circulation?.toFixed(0, { groupSeparator: ',' })}</TYPE.subHeader>
            </RowBetween>
            <RowBetween>
              <TYPE.subHeader>Total Supply</TYPE.subHeader>
              <TYPE.subHeader>{totalSupply?.toFixed(0, { groupSeparator: ',' })}</TYPE.subHeader>
            </RowBetween>
          </AutoColumn>
        </CardSection>
      </ModalUpper>
    </ContentWrapper>
  )
}
