import { Currency, ETHER, JSBI, TokenAmount } from '@uniswap/sdk'
import React, { useCallback, useEffect, useState } from 'react'
import { Text } from 'rebass'
import { useTranslation } from 'react-i18next'
import { ButtonDropdownLight } from '../../components/Button'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import CurrencyLogo from '../../components/CurrencyLogo'
import { FindPoolTabs } from '../../components/NavigationTabs'
import { MinimalPositionCard } from '../../components/PositionCard'
import Row, { AutoRow } from '../../components/Row'
import CurrencySearchModal from '../../components/SearchModal/CurrencySearchModal'
import { PairState, usePair } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { usePairAdder } from '../../state/user/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { StyledInternalLink } from '../../theme'
import { currencyId } from '../../utils/currencyId'
import { Dots } from '../Pool/styleds'
import styled from 'styled-components'
import { AddArrow } from '../../components/icon/InputIcon'
import plus from '../../assets/images/plus.svg'
import AppBody from '../AppBody'

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1
}

export const Container = styled.div`
  position: relative;
  width: 550px;
  background: ${({ theme }) => theme.bg1};
  border-radius: 30px;
  padding: 0.5rem 1rem;
`

export const Body = styled(Container)`
  position: relative;
  width: 250px;
  flex: 1;
  background: ${({ theme }) => theme.bg1};
  border-radius: 30px;
  padding: 0.5rem 1rem;
`

export default function PoolFinder() {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)

  const [currency0, setCurrency0] = useState<Currency | null>(ETHER)
  const [currency1, setCurrency1] = useState<Currency | null>(null)

  const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined)
  const addPair = usePairAdder()
  useEffect(() => {
    if (pair) {
      addPair(pair)
    }
  }, [pair, addPair])

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
        JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0))
    )

  const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken)
  const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, JSBI.BigInt(0)))

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField]
  )

  const handleSearchDismiss = useCallback(() => {
    setShowSearch(false)
  }, [setShowSearch])

  const prerequisiteMessage = (
    <AutoColumn style={{ padding: '45px 10px' }}>
      <Text textAlign="center">{!account ? t('connectToFind') : t('selectToFindLiquidity')}</Text>
    </AutoColumn>
  )

  return (
    <AppBody>
      <AutoColumn gap="lg">
        <Container>
          <FindPoolTabs />
        </Container>

        <AutoRow gap="md" style={{ display: 'flex' }}>
          <Body>
            <ButtonDropdownLight
              onClick={() => {
                setShowSearch(true)
                setActiveField(Fields.TOKEN0)
              }}
            >
              {currency0 ? (
                <Row>
                  <CurrencyLogo currency={currency0} />
                  <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                    {currency0.symbol}
                  </Text>
                </Row>
              ) : (
                <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                  Select a Token
                </Text>
              )}
            </ButtonDropdownLight>
          </Body>

          <AddArrow src={plus} />

          <Body>
            <ButtonDropdownLight
              onClick={() => {
                setShowSearch(true)
                setActiveField(Fields.TOKEN1)
              }}
            >
              {currency1 ? (
                <Row>
                  <CurrencyLogo currency={currency1} />
                  <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                    {currency1.symbol}
                  </Text>
                </Row>
              ) : (
                <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                  Select a Token
                </Text>
              )}
            </ButtonDropdownLight>
          </Body>
        </AutoRow>

        {hasPosition && (
          <ColumnCenter
            style={{ justifyItems: 'center', backgroundColor: '', padding: '12px 0px', borderRadius: '12px' }}
          >
            <Text textAlign="center" fontWeight={500}>
              Pool Found!
            </Text>
            <StyledInternalLink to={`/pool`}>
              <Text textAlign="center">Manage this pool.</Text>
            </StyledInternalLink>
          </ColumnCenter>
        )}

        {currency0 && currency1 ? (
          pairState === PairState.EXISTS ? (
            hasPosition && pair ? (
              <MinimalPositionCard pair={pair} border="1px solid #CED0D9" />
            ) : (
              <AutoColumn style={{ padding: '45px 10px' }}>
                <AutoColumn gap="sm" justify="center">
                  <Text textAlign="center">You don’t have liquidity in this pool yet.</Text>
                  <StyledInternalLink to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                    <Text textAlign="center">Add liquidity.</Text>
                  </StyledInternalLink>
                </AutoColumn>
              </AutoColumn>
            )
          ) : validPairNoLiquidity ? (
            <AutoColumn style={{ padding: '45px 10px' }}>
              <AutoColumn gap="sm" justify="center">
                <Text textAlign="center">No pool found.</Text>
                <StyledInternalLink to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                  Create pool.
                </StyledInternalLink>
              </AutoColumn>
            </AutoColumn>
          ) : pairState === PairState.INVALID ? (
            <AutoColumn style={{ padding: '45px 10px' }}>
              <AutoColumn gap="sm" justify="center">
                <Text textAlign="center" fontWeight={500}>
                  Invalid pair.
                </Text>
              </AutoColumn>
            </AutoColumn>
          ) : pairState === PairState.LOADING ? (
            <AutoColumn style={{ padding: '45px 10px' }}>
              <AutoColumn gap="sm" justify="center">
                <Text textAlign="center">
                  Loading
                  <Dots />
                </Text>
              </AutoColumn>
            </AutoColumn>
          ) : null
        ) : (
          prerequisiteMessage
        )}

        <CurrencySearchModal
          isOpen={showSearch}
          onCurrencySelect={handleCurrencySelect}
          onDismiss={handleSearchDismiss}
          showCommonBases
          selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
        />
      </AutoColumn>
    </AppBody>
  )
}
