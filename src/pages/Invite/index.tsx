import React, { useContext, useEffect, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { RouteComponentProps } from 'react-router-dom'
import { AutoColumn } from '../../components/Column'
import { useUserInvited } from '../../hooks/useInvited'
import { useTranslation } from 'react-i18next'
import AddressInviteModal from '../../components/invite/AddressInviteModal'
import { AutoRow } from '../../components/Row'
import { CloseIcon, CustomLightSpinner, TYPE } from '../../theme'
import { useActiveWeb3React } from '../../hooks'
import { ZERO_ADDRESS } from '../../constants'
import QuestionHelper from '../../components/QuestionHelper'
import ecircleBg from '../../assets/images/ecircle.svg'
import ncircleBg from '../../assets/images/ncircle.svg'
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
  YourAccount
} from '../../components/CircleDetail'
import { getEtherscanLink } from '../../utils'
import Copy from '../../components/AccountDetails/Copy'
import { ExternalLink as LinkIcon } from 'react-feather'
import Circle from '../../assets/images/blue-loader.svg'

const PageWrapper = styled(AutoColumn)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const CircleCard = styled.div`
  width: 490px;
  padding: 59px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 20px 60px;
  height: 300px;
  border-radius: 20px;
  cursor: pointer;
  color: transparent;
  position: relative;
  ${({ theme }) => theme.mediaWidth.upToMedium`
     width: 100%;
  `};
`

const NCircle = styled(CircleCard)`
  background-image: url(${ecircleBg});
`

const CCircle = styled(CircleCard)`
  background-image: url(${ncircleBg});
`

const HelperFrame = styled.div`
  position: absolute;
  left: auto;
  right: 30px;
  top: 30px;
`

export default function Invite(props: RouteComponentProps<{ address: string }>) {
  const {
    match: {
      params: { address }
    },
    history
  } = props
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  const invited = useUserInvited(account)
  const theme = useContext(ThemeContext)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showMyNcircle, setShowMyNcircle] = useState(false)
  console.log('invited', invited)
  useEffect(() => {
    if (address && invited !== ZERO_ADDRESS) {
      setShowInviteModal(true)
    }
  }, [address, invited, history])

  useEffect(() => {
    if (showMyNcircle && invited === ZERO_ADDRESS) {
      setShowMyNcircle(false)
      setShowInviteModal(true)
    }
  }, [invited, showMyNcircle])

  return (
    <>
      <PageWrapper>
        <AutoRow style={{ margin: 'auto', justifyContent: 'center' }}>
          <NCircle
            onClick={() => {
              if (ZERO_ADDRESS === invited) {
                setShowInviteModal(true)
              } else {
                setShowMyNcircle(true)
              }
            }}
          >
            <TYPE.white fontWeight={900} fontSize={41}>
              {t('nCircle')}
            </TYPE.white>
            <TYPE.white fontWeight={900} fontSize={14} textAlign="center" marginTop="10px">
              {t('createNCircleTip')}
            </TYPE.white>
            <HelperFrame>
              <QuestionHelper text={t('ncircle_helper')} />
            </HelperFrame>
          </NCircle>
          <CCircle
            onClick={() => {
              history.push('/ecircle')
            }}
          >
            <TYPE.white fontWeight={900} fontSize={41}>
              {t('eCircle')}
            </TYPE.white>
            <TYPE.white fontWeight={900} fontSize={14} textAlign="center" marginTop="10px">
              {t('createAndJoin')}
            </TYPE.white>
            <HelperFrame>
              <QuestionHelper text={t('ecircle_helper')} />
            </HelperFrame>
          </CCircle>
        </AutoRow>
      </PageWrapper>

      <Modal isOpen={showMyNcircle} onDismiss={() => setShowMyNcircle(false)} minHeight={false} maxHeight={90}>
        <UpperSection>
          <CloseIcon
            onClick={() => {
              setShowMyNcircle(false)
            }}
          >
            <CloseColor />
          </CloseIcon>
          <HeaderRow>{t('myNCircle')}</HeaderRow>
          {!invited ? (
            <AccountGroupingRow style={{ justifyContent: 'center' }}>
              <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
            </AccountGroupingRow>
          ) : (
            <AccountSection>
              <>
                <YourAccount>
                  <InfoCard>
                    <AccountGroupingRow id="web3-account-identifier-row">
                      <AccountControl>
                        <div>
                          <p style={{ wordBreak: 'break-all', whiteSpace: 'unset' }}>
                            {'https://app.circleswap.org/#/invite/' + account}
                          </p>
                        </div>
                      </AccountControl>
                    </AccountGroupingRow>
                    <AccountGroupingRow>
                      <AccountControl>
                        <div>
                          {account && (
                            <Copy toCopy={'https://app.circleswap.org/#/invite/' + account ?? ''}>
                              <span style={{ marginLeft: '4px' }}>{t('copy_link')}</span>
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
                <TYPE.body textAlign={'center'} color={theme.text1}>
                  {t('copy_to_ncircle')}
                </TYPE.body>
              </>
            </AccountSection>
          )}
        </UpperSection>
      </Modal>

      <AddressInviteModal
        isOpen={showInviteModal}
        address={address}
        onDismiss={() => {
          setShowInviteModal(false)
        }}
      />
    </>
  )
}
