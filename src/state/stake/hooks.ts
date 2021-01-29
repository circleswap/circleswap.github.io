import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, WETH, Pair } from '@uniswap/sdk'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DAI, UNI, USDC, USDT, WBTC, CIR } from '../../constants'
import { STAKING_REWARDS_INTERFACE } from '../../constants/abis/staking-rewards'
import { useActiveWeb3React } from '../../hooks'
import { NEVER_RELOAD, useMultipleContractSingleData } from '../multicall/hooks'
import { tryParseAmount } from '../swap/hooks'
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'

export const STAKING_GENESIS = 1600387200

export const REWARDS_DURATION_DAYS = 60

// TODO add staking rewards addresses here
export const STAKING_REWARDS_INFO: {
  [chainId in ChainId]?: {
    tokens: [Token, Token]
    stakingRewardAddress: string
  }[]
} = {
  [ChainId.MAINNET]: [
    {
      tokens: [WETH[ChainId.MAINNET], DAI],
      stakingRewardAddress: '0xa1484C3aa22a66C62b77E0AE78E15258bd0cB711'
    },
    {
      tokens: [WETH[ChainId.MAINNET], USDC],
      stakingRewardAddress: '0x7FBa4B8Dc5E7616e59622806932DBea72537A56b'
    },
    {
      tokens: [WETH[ChainId.MAINNET], USDT],
      stakingRewardAddress: '0x6C3e4cb2E96B01F4b866965A91ed4437839A121a'
    },
    {
      tokens: [WETH[ChainId.MAINNET], WBTC],
      stakingRewardAddress: '0xCA35e32e7926b96A9988f61d510E038108d8068e'
    }
  ],
  [ChainId.ROPSTEN]: [
    {
      tokens: [
        new Token(ChainId.ROPSTEN, '0xc778417e063141139fce010982780140aa0cd5ab', 18, 'WETH', 'Wrapped Ether'),
        CIR
      ],
      stakingRewardAddress: '0xBA1f0D871D312e8816Ec10c6FE5e1B696341E319'
    },
    {
      tokens: [
        new Token(ChainId.ROPSTEN, '0xc778417e063141139fce010982780140aa0cd5ab', 18, 'WETH', 'Wrapped Ether'),
        new Token(ChainId.ROPSTEN, '0x516de3a7a567d81737e3a46ec4ff9cfd1fcb0136', 18, 'USDT', 'USDT')
      ],
      stakingRewardAddress: '0x9eDc88C230590aEcF7728bEc62BF03BB20f859d8'
    }
  ],
  [ChainId.HT]: [
    {
      tokens: [
        new Token(ChainId.HT, '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f', 18, 'HT', 'Wrapped HT'),
        new Token(ChainId.HT, '0x64ff637fb478863b7468bc97d30a5bf3a428a1fd', 18, 'ETH', 'Heco-Peg ETH Token')
      ],
      stakingRewardAddress: '0x8A58A2432d5004aAc8dB020bf362E1EBaC391367'
    },
    {
      tokens: [
        new Token(ChainId.HT, '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f', 18, 'HT', 'Wrapped HT'),
        new Token(ChainId.HT, '0x66a79d23e58475d2738179ca52cd0b41d73f0bea', 18, 'HBTC', 'Heco-Peg HBTC Token')
      ],
      stakingRewardAddress: '0xFEcF0D48007325F9e8b55D3ae52e6e11386FD1F9'
    },
    {
      tokens: [
        new Token(ChainId.HT, '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f', 18, 'HT', 'Wrapped HT'),
        new Token(ChainId.HT, '0x0298c2b32eae4da002a15f36fdf7615bea3da047', 8, 'HUSD', 'Heco-Peg HUSD Token')
      ],
      stakingRewardAddress: '0xc3C82959aFFCf55dE113DF8Cf3Ee2678d664fd66'
    },
    {
      tokens: [
        new Token(ChainId.HT, '0x0298c2b32eae4da002a15f36fdf7615bea3da047', 8, 'HUSD', 'Heco-Peg HUSD Token'),
        new Token(ChainId.HT, '0xbe5DF2fac88BB096A973e664171E60586bC5940c', 18, 'CIR', 'CircleSwap Governance Token')
      ],
      stakingRewardAddress: '0x82194AFF9608b18551760434b2391b7e3C50deaB'
    },
    {
      tokens: [
        new Token(ChainId.HT, '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f', 18, 'HT', 'Wrapped HT'),
        new Token(ChainId.HT, '0xbe5DF2fac88BB096A973e664171E60586bC5940c', 18, 'CIR', 'CircleSwap Governance Token')
      ],
      stakingRewardAddress: '0x43893DE0221ac154980EA39325CefA0f4A765d57'
    },
    {
      tokens: [
        new Token(ChainId.HT, '0x3dd639626f106bd818e92bdcb102911c020ced77', 6, 'RPO', 'Racing Player One'),
        new Token(ChainId.HT, '0xbe5DF2fac88BB096A973e664171E60586bC5940c', 18, 'CIR', 'CircleSwap Governance Token')
      ],
      stakingRewardAddress: '0x1533941e32bA810Dd3ce9Bf5603835FfBED46b61'
    },
    {
      tokens: [
        new Token(ChainId.HT, '0xe36ffd17b2661eb57144ceaef942d95295e637f0', 18, 'FILDA', 'FilDA on Heco'),
        new Token(ChainId.HT, '0xbe5DF2fac88BB096A973e664171E60586bC5940c', 18, 'CIR', 'CircleSwap Governance Token')
      ],
      stakingRewardAddress: '0xd12E1ba2E41e6c220366Cab97C7c735E927dcd09'
    },
    {
      tokens: [
        new Token(ChainId.HT, '0xe499ef4616993730ced0f31fa2703b92b50bb536', 18, 'HPT', 'Heco-Peg HPT Token'),
        new Token(ChainId.HT, '0xa71edc38d189767582c38a3145b5873052c3e47a', 18, 'USDT', 'Heco-Peg USDTHECO Token')
      ],
      stakingRewardAddress: '0x9012cE612C764C37349Bb556E925DCc66Bd01C54'
    },
    {
      tokens: [
        new Token(ChainId.HT, '0x8f67854497218043e1f72908ffe38d0ed7f24721', 18, 'LHB', 'LendHub'),
        new Token(ChainId.HT, '0xbe5DF2fac88BB096A973e664171E60586bC5940c', 18, 'CIR', 'CircleSwap Governance Token')
      ],
      stakingRewardAddress: '0x63476Aa58b0f45c6BE36fCf83ED6c34Db5d18E12'
    },
    {
      tokens: [
        new Token(ChainId.HT, '0xb09caa2db896d6f0a622811281a62ed6ac0e2ce5', 18, 'TOP', 'Token Offering Platform'),
        new Token(ChainId.HT, '0xa71edc38d189767582c38a3145b5873052c3e47a', 18, 'USDT', 'Heco-Peg USDTHECO Token')
      ],
      stakingRewardAddress: '0x783e4Ac22691e59079E53288063EdA34Ac32F38c'
    }
  ]
}

export interface StakingInfo {
  // the address of the reward contract
  stakingRewardAddress: string
  // the tokens involved in this pair
  tokens: [Token, Token]
  // the amount of token currently staked, or undefined if no account
  stakedAmount: TokenAmount
  // the amount of reward token earned by the active account, or undefined if no account
  earnedAmount: TokenAmount
  // the total amount of token staked in the contract
  totalStakedAmount: TokenAmount
  // the amount of token distributed per second to all LPs, constant
  totalRewardRate: TokenAmount
  // the current amount of token distributed to the active account per second.
  // equivalent to percent of total supply * reward rate
  rewardRate: TokenAmount
  // when the period ends
  periodFinish: Date | undefined
  // if pool is active
  active: boolean
  // calculates a hypothetical amount of token distributed to the active account per second.
  getHypotheticalRewardRate: (
    stakedAmount: TokenAmount,
    totalStakedAmount: TokenAmount,
    totalRewardRate: TokenAmount
  ) => TokenAmount
}

// gets the staking info from the network for the active chain id
export function useStakingInfo(pairToFilterBy?: Pair | null): StakingInfo[] {
  const { chainId, account } = useActiveWeb3React()

  // detect if staking is ended
  const currentBlockTimestamp = useCurrentBlockTimestamp()
  const info = useMemo(
    () =>
      chainId
        ? STAKING_REWARDS_INFO[chainId]?.filter(stakingRewardInfo =>
            pairToFilterBy === undefined
              ? true
              : pairToFilterBy === null
              ? false
              : pairToFilterBy.involvesToken(stakingRewardInfo.tokens[0]) &&
                pairToFilterBy.involvesToken(stakingRewardInfo.tokens[1])
          ) ?? []
        : [],
    [chainId, pairToFilterBy]
  )

  const uni = chainId ? UNI[chainId] : undefined

  const rewardsAddresses = useMemo(() => info.map(({ stakingRewardAddress }) => stakingRewardAddress), [info])
  const accountArg = useMemo(() => [account ?? undefined], [account])

  // get all the info from the staking rewards contracts
  const balances = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'balanceOf', accountArg)
  const earnedAmounts = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'earned', accountArg)
  const totalSupplies = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'totalSupply')

  // tokens per second, constants
  const rewardRates = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE,
    'rewardRate',
    undefined,
    NEVER_RELOAD
  )
  const periodFinishes = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE,
    'periodFinish',
    undefined,
    NEVER_RELOAD
  )

  return useMemo(() => {
    if (!chainId || !uni) return []

    return rewardsAddresses.reduce<StakingInfo[]>((memo, rewardsAddress, index) => {
      // these two are dependent on account
      const balanceState = balances[index]
      const earnedAmountState = earnedAmounts[index]

      // these get fetched regardless of account
      const totalSupplyState = totalSupplies[index]
      const rewardRateState = rewardRates[index]
      const periodFinishState = periodFinishes[index]

      if (
        // these may be undefined if not logged in
        !balanceState?.loading &&
        !earnedAmountState?.loading &&
        // always need these
        totalSupplyState &&
        !totalSupplyState.loading &&
        rewardRateState &&
        !rewardRateState.loading &&
        periodFinishState &&
        !periodFinishState.loading
      ) {
        if (
          balanceState?.error ||
          earnedAmountState?.error ||
          totalSupplyState.error ||
          rewardRateState.error ||
          periodFinishState.error
        ) {
          console.error('Failed to load staking rewards info')
          return memo
        }

        // get the LP token
        const tokens = info[index].tokens
        const dummyPair = new Pair(new TokenAmount(tokens[0], '0'), new TokenAmount(tokens[1], '0'))

        // check for account, if no account set to 0

        const stakedAmount = new TokenAmount(dummyPair.liquidityToken, JSBI.BigInt(balanceState?.result?.[0] ?? 0))
        const totalStakedAmount = new TokenAmount(dummyPair.liquidityToken, JSBI.BigInt(totalSupplyState.result?.[0]))
        const totalRewardRate = new TokenAmount(uni, JSBI.BigInt(rewardRateState.result?.[0]))

        const getHypotheticalRewardRate = (
          stakedAmount: TokenAmount,
          totalStakedAmount: TokenAmount,
          totalRewardRate: TokenAmount
        ): TokenAmount => {
          return new TokenAmount(
            uni,
            JSBI.greaterThan(totalStakedAmount.raw, JSBI.BigInt(0))
              ? JSBI.divide(JSBI.multiply(totalRewardRate.raw, stakedAmount.raw), totalStakedAmount.raw)
              : JSBI.BigInt(0)
          )
        }

        const individualRewardRate = getHypotheticalRewardRate(stakedAmount, totalStakedAmount, totalRewardRate)

        const periodFinishSeconds = periodFinishState.result?.[0]?.toNumber()
        const periodFinishMs = periodFinishSeconds * 1000

        // compare period end timestamp vs current block timestamp (in seconds)
        const active =
          periodFinishSeconds && currentBlockTimestamp ? periodFinishSeconds > currentBlockTimestamp.toNumber() : true

        memo.push({
          stakingRewardAddress: rewardsAddress,
          tokens: info[index].tokens,
          periodFinish: periodFinishMs > 0 ? new Date(periodFinishMs) : undefined,
          earnedAmount: new TokenAmount(uni, JSBI.BigInt(earnedAmountState?.result?.[0] ?? 0)),
          rewardRate: individualRewardRate,
          totalRewardRate: totalRewardRate,
          stakedAmount: stakedAmount,
          totalStakedAmount: totalStakedAmount,
          getHypotheticalRewardRate,
          active
        })
      }
      return memo
    }, [])
  }, [
    balances,
    chainId,
    currentBlockTimestamp,
    earnedAmounts,
    info,
    periodFinishes,
    rewardRates,
    rewardsAddresses,
    totalSupplies,
    uni
  ])
}

export function useTotalUniEarned(): TokenAmount | undefined {
  const { chainId } = useActiveWeb3React()
  const uni = chainId ? UNI[chainId] : undefined
  const stakingInfos = useStakingInfo()

  return useMemo(() => {
    if (!uni) return undefined
    return (
      stakingInfos?.reduce(
        (accumulator, stakingInfo) => accumulator.add(stakingInfo.earnedAmount),
        new TokenAmount(uni, '0')
      ) ?? new TokenAmount(uni, '0')
    )
  }, [stakingInfos, uni])
}

// based on typed value
export function useDerivedStakeInfo(
  typedValue: string,
  stakingToken: Token,
  userLiquidityUnstaked: TokenAmount | undefined
): {
  parsedAmount?: CurrencyAmount
  error?: string
} {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const parsedInput: CurrencyAmount | undefined = tryParseAmount(typedValue, stakingToken)

  const parsedAmount =
    parsedInput && userLiquidityUnstaked && JSBI.lessThanOrEqual(parsedInput.raw, userLiquidityUnstaked.raw)
      ? parsedInput
      : undefined

  let error: string | undefined
  if (!account) {
    error = t('connectWallet')
  }
  if (!parsedAmount) {
    error = error ?? 'Enter an amount'
  }

  return {
    parsedAmount,
    error
  }
}

// based on typed value
export function useDerivedUnstakeInfo(
  typedValue: string,
  stakingAmount: TokenAmount
): {
  parsedAmount?: CurrencyAmount
  error?: string
} {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const parsedInput: CurrencyAmount | undefined = tryParseAmount(typedValue, stakingAmount.token)

  const parsedAmount = parsedInput && JSBI.lessThanOrEqual(parsedInput.raw, stakingAmount.raw) ? parsedInput : undefined

  let error: string | undefined
  if (!account) {
    error = t('connectWallet')
  }
  if (!parsedAmount) {
    error = error ?? 'Enter an amount'
  }

  return {
    parsedAmount,
    error
  }
}
