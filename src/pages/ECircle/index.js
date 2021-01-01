import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, ExternalLink as LinkIcon } from 'react-feather'
import { AutoRow, RowBetween } from '../../components/Row'
import { Button, CloseIcon, TYPE } from '../../theme'
import { ButtonBlue } from '../../components/Button'
import JoinECircleModal from '../../components/ECircle/JoinECircleModal'
import { useAllCircleData, useJoinNCircle, useNCircle, useNCircleJoinAble } from '../../hooks/useNCircle'
import BigNumber from 'bignumber.js'
import { Balls } from '../../components/Ball/inidex'
import { isMobile } from 'react-device-detect'
import Modal from '../../components/Modal'
import {
  AccountControl,
  AccountGroupingRow,
  AccountSection,
  AddressLink,
  CloseColor,
  HeaderRow,
  InfoCard,
  UpperSection,
  WalletAction,
  YourAccount
} from '../../components/CircleDetail'
import { getEtherscanLink, shortenAddress } from '../../utils'
import Copy from '../../components/AccountDetails/Copy'
import { useMyECircle } from '../../state/ecircle/hooks'
import { useActiveWeb3React } from '../../hooks'

const TipFrame = styled(AutoColumn)`
  border-radius: 14px;
  padding: 50px;
  margin-top: 48px;
  background-color: ${({ theme }) => theme.bg1};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    padding: 24px
  `};
`

export default function ECircle({ history, match }) {
  const { t } = useTranslation()
  const able = useNCircleJoinAble()
  const circle = useNCircle()
  const myECircle = useMyECircle()
  const { account, chainId } = useActiveWeb3React()
  const JoinCircle = useJoinNCircle()
  const ecircles = useAllCircleData()
  const [showJoinECircleModal, setShowJoinECircleModal] = useState(false)
  const [showMyEcircle, setShowMyEcircle] = useState(false)

  const address = match?.params.address

  useEffect(() => {
    if (address) {
      setShowJoinECircleModal(true)
    }
  }, [address])

  return (
    <>
      <AutoColumn gap="lg" justify="center">
        <CloseIcon
          onClick={() => {
            history.push('/invite')
          }}
          style={{ top: 12 }}
        />
        <Balls tabs={ecircles} />
        <TipFrame gap="md">
          <TYPE.mediumHeader fontSize={14}>{t('tip1')}</TYPE.mediumHeader>

          <AutoRow style={{ display: 'flex', alignItems: 'center' }}>
            <AlertTriangle color={able.invited ? '#30D683' : '#FF7238'} />
            <TYPE.main fontSize={14} marginLeft={10}>
              {t('tip2')}
            </TYPE.main>
          </AutoRow>

          <AutoRow style={{ display: 'flex', alignItems: 'center' }}>
            <AlertTriangle color={able.swapMore ? '#30D683' : '#FF7238'} />
            <TYPE.main width={isMobile ? 220 : 400} fontSize={14} marginLeft={10}>
              {t('tip3')}
            </TYPE.main>
          </AutoRow>
        </TipFrame>

        {new BigNumber(circle).isGreaterThan(0) || new BigNumber(JoinCircle).isGreaterThan(0) ? (
          <RowBetween style={{ marginTop: 64, rowGap: '19' }} gap="19px">
            <Button
              onClick={() => {
                setShowMyEcircle(true)
              }}
            >
              {t('myECircle')}
            </Button>
          </RowBetween>
        ) : (
          <RowBetween style={{ marginTop: 64, rowGap: '19' }} gap="19px">
            <Button
              disabled={
                !able.invited ||
                !able.swapMore ||
                new BigNumber(circle).isGreaterThan(0) ||
                new BigNumber(JoinCircle).isGreaterThan(0)
              }
              style={{ width: '46%' }}
              onClick={() => {
                history.push('/ecircle/create')
              }}
            >
              {t('createECircle')}
            </Button>
            <Button
              disabled={
                !able.invited ||
                !able.swapMore ||
                new BigNumber(circle).isGreaterThan(0) ||
                new BigNumber(JoinCircle).isGreaterThan(0)
              }
              style={{ width: '46%' }}
              onClick={() => {
                setShowJoinECircleModal(true)
              }}
            >
              {t('joinECircle')}
            </Button>
          </RowBetween>
        )}

        <ButtonBlue
          disabled={!(circle > 0) && !(JoinCircle > 0)}
          onClick={() => {
            history.push('/stake')
          }}
        >
          {t('stakeMyLPT')}
        </ButtonBlue>

        <TYPE.main width={isMobile ? 280 : ''} marginBottom={24} fontSize={13} marginTop={24}>
          {t('note')}
        </TYPE.main>
      </AutoColumn>
      {showJoinECircleModal && (
        <JoinECircleModal
          isOpen={showJoinECircleModal}
          address={address}
          onDismiss={() => {
            setShowJoinECircleModal(false)
          }}
        />
      )}

      <Modal isOpen={showMyEcircle} onDismiss={() => setShowMyEcircle(false)} minHeight={false} maxHeight={90}>
        <UpperSection>
          <CloseIcon
            onClick={() => {
              setShowMyEcircle(false)
            }}
          >
            <CloseColor />
          </CloseIcon>
          <HeaderRow>{t('myECircle')}</HeaderRow>
          <AccountSection>
            <YourAccount>
              <InfoCard>
                <AccountGroupingRow>
                  {myECircle && myECircle.name}
                  <div>
                    <WalletAction
                      style={{ fontSize: '.825rem', fontWeight: 400 }}
                      onClick={() => {
                        //openOptions()
                      }}
                    >
                      {myECircle && myECircle.count.toString()} / {myECircle.level}
                    </WalletAction>
                  </div>
                </AccountGroupingRow>
                <AccountGroupingRow id="web3-account-identifier-row">
                  <AccountControl>
                    <div>
                      <p> {account && shortenAddress(account)}</p>
                    </div>
                  </AccountControl>
                </AccountGroupingRow>
                <AccountGroupingRow>
                  <AccountControl>
                    <div>
                      {account && (
                        <Copy toCopy={account}>
                          <span style={{ marginLeft: '4px' }}>{t('copy_address')}</span>
                        </Copy>
                      )}
                      {chainId && account && (
                        <AddressLink
                          hasENS={!!account}
                          isENS={true}
                          href={chainId && getEtherscanLink(chainId, account, 'address')}
                        >
                          <LinkIcon size={16} />
                          <span style={{ marginLeft: '4px' }}>{t('viewOnECO')}</span>
                        </AddressLink>
                      )}
                    </div>
                  </AccountControl>
                </AccountGroupingRow>
              </InfoCard>
            </YourAccount>
          </AccountSection>
        </UpperSection>
      </Modal>
    </>
  )
}
