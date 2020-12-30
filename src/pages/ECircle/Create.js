import React, { useState } from 'react'
import styled from 'styled-components'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import { useTranslation } from 'react-i18next'
import { RowBetween } from '../../components/Row'
import { Button, CloseIcon, ExternalLink, TYPE, UniTokenAnimated } from '../../theme'
import { ButtonBlue, ButtonSecondary } from '../../components/Button'
import tokenLogo from '../../assets/images/logo-circle.svg'
import { getEtherscanLink } from '../../utils'
import { useIsTransactionPending } from '../../state/transactions/hooks'
import { useMintCallback } from '../../state/ecircle/hooks'
import { useActiveWeb3React } from '../../hooks'
import { INVITE_ADDRESS, UNI } from '../../constants'
import { useUniContract } from '../../hooks/useContract'
import Modal from '../../components/Modal'
import Lottie from 'react-lottie'
import loading from '../../assets/lottie/loading.json'
import { useTokenBalance } from '../../state/wallet/hooks'
import BigNumber from 'bignumber.js'

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loading,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
}

const Input = styled.input`
  font-size: 1.25rem;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: ${({ theme }) => theme.bg1};
  transition: color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')};
  color: ${({ error, theme }) => (error ? theme.red1 : theme.text1)};
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  width: 100%;
  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
  padding: 0px;
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
`

const PageWrapper = styled(AutoColumn)`
  margin-top: 4rem;
  width: 538px;
  padding: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background-color: ${({ theme }) => theme.bg1};
  ${({ theme }) => theme.mediaWidth.upToSmall`
     width: 100%;
  `};
`

const NumberButton = styled(ButtonBlue)`
  height: 30px;
  width: fit-content;
  line-height: 30px;
  display: flex;
  align-items: center;
  background-color: ${({ selected, theme }) => (selected ? theme.bluePrimary : theme.bg5)};
`

const ConfirmOrLoadingWrapper = styled.div`
  width: 100%;
  padding: 24px;
  position: relative;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`

const InputPanel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  border: 1px solid ${({ error, theme }) => (error ? theme.red1 : theme.bg2)};
  transition: border-color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')},
    color 500ms ${({ error }) => (error ? 'step-end' : 'step-start')};
  background-color: ${({ theme }) => theme.bg1};
  width: 100%;
  padding: 1rem;
`

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  border-radius: 100px;
  padding: 16px;
  width: 180px;
`

export default function CreateECircle({ history }) {
  const { chainId, account } = useActiveWeb3React()
  const { t } = useTranslation()
  const [attempting, setAttempting] = useState(false)
  const [value, setValue] = useState()
  const [size, setSize] = useState('30')
  const [gas, setGas] = useState('100')
  const [level, setLevel] = useState(1)
  const { mintCallback } = useMintCallback(value, level)
  const [hash, setHash] = useState()
  const cirContract = useUniContract()
  // monitor the status of the claim from contracts and txns
  const claimPending = useIsTransactionPending(hash ?? '')
  const claimConfirmed = hash && !claimPending

  const cirBalance = useTokenBalance(account ?? undefined, chainId ? UNI[chainId] : undefined)

  function onMint() {
    setAttempting(true)
    mintCallback()
      .then(hash => {
        setHash(hash)
      })
      // reset modal and log error
      .catch(error => {
        setAttempting(false)
        console.log(error)
      })
  }

  function onAttemptToApprove() {
    setAttempting(true)
    cirContract.approve(INVITE_ADDRESS, gas + '000000000000000000').then(_ => {
      onMint()
    })
  }

  function wrappedOnDismiss() {
    setAttempting(false)
    setHash(undefined)
    setValue('')
  }

  return (
    <PageWrapper>
      <AutoColumn gap="lg" style={{ width: '100%' }}>
        <TYPE.largeHeader margin={'auto'}>{t('createExchange')}</TYPE.largeHeader>
        <TYPE.main>{t('enterNameECircle')}</TYPE.main>
        <InputPanel>
          <Input
            style={{ width: '100%', fontSize: 16 }}
            className="recipient-address-input"
            type="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            value={value}
            onChange={event => setValue(event.target.value)}
            placeholder={t('createECirclePlaceholder')}
          />
        </InputPanel>
        <TYPE.main>{t('selectSize')}</TYPE.main>

        <RowBetween style={{ width: '76%' }}>
          <NumberButton
            selected={size === '30'}
            onClick={() => {
              setGas('100')
              setSize('30')
              setLevel(1)
            }}
          >
            30
          </NumberButton>
          <NumberButton
            selected={size === '200'}
            onClick={() => {
              setGas('500')
              setSize('200')
              setLevel(2)
            }}
          >
            200
          </NumberButton>
          <NumberButton
            selected={size === '300'}
            onClick={() => {
              setSize('500')
              setGas('1000')
              setLevel(3)
            }}
          >
            500
          </NumberButton>
        </RowBetween>

        <TYPE.main margin={'24px auto'}>{t('payToCreateECircle', { gas })}</TYPE.main>

        <RowBetween gap="19px">
          <ResponsiveButtonSecondary
            style={{ width: '46%' }}
            onClick={() => {
              history.push('/ecircle')
            }}
          >
            {t('cancel')}
          </ResponsiveButtonSecondary>
          <Button
            disabled={
              !value || new BigNumber(gas + '000000000000000000').isGreaterThan(cirBalance?.raw?.toString() ?? '0')
            }
            style={{ width: '46%' }}
            onClick={onAttemptToApprove}
          >
            {t('confirm')}
          </Button>
        </RowBetween>
      </AutoColumn>
      <Modal isOpen={attempting || claimConfirmed} onDismiss={wrappedOnDismiss} maxHeight={90}>
        <ConfirmOrLoadingWrapper activeBG={true}>
          <RowBetween>
            <CloseIcon onClick={wrappedOnDismiss} style={{ zIndex: 99 }} stroke="black" />
          </RowBetween>
          <ConfirmedIcon>
            {!claimConfirmed ? (
              <Lottie width={200} height={200} options={defaultOptions} />
            ) : (
              <UniTokenAnimated width="72px" src={tokenLogo} />
            )}
          </ConfirmedIcon>
          <AutoColumn gap="100px" justify={'center'}>
            <AutoColumn gap="12px" justify={'center'}>
              <TYPE.largeHeader fontWeight={600} color="black">
                {claimConfirmed ? t('createdSuccessfully') : t('creating')}
              </TYPE.largeHeader>
            </AutoColumn>
            {claimConfirmed && (
              <>
                <TYPE.subHeader fontWeight={500} color="black">
                  <span role="img" aria-label="party-hat">
                    🎉{' '}
                  </span>
                  Congratulations!
                  <span role="img" aria-label="party-hat">
                    🎉
                  </span>
                </TYPE.subHeader>
              </>
            )}
            {attempting && !hash && (
              <TYPE.subHeader color="black">Confirm this transaction in your wallet</TYPE.subHeader>
            )}
            {attempting && hash && !claimConfirmed && chainId && hash && (
              <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')} style={{ zIndex: 99 }}>
                View transaction on Eco Explorer
              </ExternalLink>
            )}
          </AutoColumn>
        </ConfirmOrLoadingWrapper>
      </Modal>
    </PageWrapper>
  )
}
