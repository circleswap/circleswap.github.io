import { Currency, Percent, Price } from '@uniswap/sdk'
import React, { useContext } from 'react'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { AutoRow } from '../../components/Row'
import { ONE_BIPS } from '../../constants'
import { Field } from '../../state/mint/actions'
import { TYPE } from '../../theme'
import { LightCard } from '../../components/Card'

export function PoolPriceBar({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price
}: {
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price
}) {
  const theme = useContext(ThemeContext)
  return (
    <AutoColumn gap="md">
      <AutoRow justify="space-around" gap="4px">
        <LightCard padding="1.25rem" borderRadius={'20px'}>
          <AutoColumn justify="center">
            <TYPE.largeHeader>{price?.toSignificant(6) ?? '-'}</TYPE.largeHeader>
            <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
              {currencies[Field.CURRENCY_B]?.symbol} per {currencies[Field.CURRENCY_A]?.symbol}
            </Text>
          </AutoColumn>
        </LightCard>
        <LightCard padding="1.25rem" borderRadius={'20px'}>
          <AutoColumn justify="center">
            <TYPE.largeHeader>{price?.invert()?.toSignificant(6) ?? '-'}</TYPE.largeHeader>
            <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
              {currencies[Field.CURRENCY_A]?.symbol} per {currencies[Field.CURRENCY_B]?.symbol}
            </Text>
          </AutoColumn>
        </LightCard>
        <LightCard padding="1.25rem" borderRadius={'20px'}>
          <AutoColumn justify="center">
            <TYPE.largeHeader>
              {noLiquidity && price
                ? '100'
                : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
              %
            </TYPE.largeHeader>
            <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
              Share of Pool
            </Text>
          </AutoColumn>
        </LightCard>
      </AutoRow>
    </AutoColumn>
  )
}
