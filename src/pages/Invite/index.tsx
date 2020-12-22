import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router-dom'
import { AutoColumn } from '../../components/Column'
import { useUserInvited } from '../../hooks/useInvited'
import { useTranslation } from 'react-i18next'
import AddressInviteModal from '../../components/invite/AddressInviteModal'
import { AutoRow } from '../../components/Row'
import { TYPE } from '../../theme'
import { useActiveWeb3React } from '../../hooks'
import { ZERO_ADDRESS } from '../../constants'
import QuestionHelper from '../../components/QuestionHelper'
import ecircleBg from '../../assets/images/ecircle.svg'
import ncircleBg from '../../assets/images/ncircle.svg'

const PageWrapper = styled(AutoColumn)`
  width: 100%;
  padding-top: 8rem;
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
  margin: 0 60px;
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
  console.log('address', address)
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const invited = useUserInvited(account)

  const [showInviteModal, setShowInviteModal] = useState(false)

  useEffect(() => {
    if (address && invited !== ZERO_ADDRESS) {
      history.push('/inviting')
    }
  }, [address, invited, history])

  return (
    <>
      <PageWrapper>
        <AutoRow style={{ margin: 'auto' }}>
          <NCircle
            onClick={() => {
              if (ZERO_ADDRESS === invited) {
                setShowInviteModal(true)
              } else {
                history.push('/inviting')
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
              <QuestionHelper text={'1. 参与流动性挖矿；\n2.获取UBI奖励；\n3.获取流动性挖矿算力额外奖励；'} />
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
              Create or view your ECircle details
            </TYPE.white>
            <HelperFrame>
              <QuestionHelper
                text={`1. 获得额外空投奖励；\n 2.获得Swap挖矿额外奖励；\n 3.获取流动性挖矿算力额外奖励；`}
              />
            </HelperFrame>
          </CCircle>
        </AutoRow>
      </PageWrapper>

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
