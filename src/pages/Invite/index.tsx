import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router-dom'
import { AutoColumn } from '../../components/Column'
import { useUserInvited } from '../../hooks/useInvited'

import ecircleBg from '../../assets/images/ecircle.svg'
import ncircleBg from '../../assets/images/ncircle.svg'

import AddressInviteModal from '../../components/invite/AddressInviteModal'
import { AutoRow } from '../../components/Row'
import { TYPE } from '../../theme'
import { useActiveWeb3React } from '../../hooks'
import { ZERO_ADDRESS } from '../../constants'

const PageWrapper = styled(AutoColumn)`
  width: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

const CircleCard = styled.div`
  width: 306px;
  padding: 59px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 35px;
  height: 188px;
  border-radius: 20px;
  cursor: pointer;
  color: transparent;
`

const NCircle = styled(CircleCard)`
  background-image: url(${ecircleBg});
`

const CCircle = styled(CircleCard)`
  background-image: url(${ncircleBg});
`

export default function Invite(props: RouteComponentProps<{ address: string }>) {
  const {
    match: {
      params: { address }
    },
    history
  } = props
  console.log('address', address)
  const { account } = useActiveWeb3React()
  const invited = useUserInvited(account)

  const [showInviteModal, setShowInviteModal] = useState(false)

  useEffect(() => {
    if (address) {
      setShowInviteModal(true)
    }
  }, [])

  return (
    <>
      <PageWrapper>
        <AutoRow style={{ width: 'fit-content', margin: 'auto' }}>
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
              Ncircle
            </TYPE.white>
            <TYPE.white fontWeight={900} fontSize={14}>
              Create your Ncircle
            </TYPE.white>
          </NCircle>
          <CCircle>
            <TYPE.white fontWeight={900} fontSize={41}>
              Ecircle
            </TYPE.white>
            <TYPE.white fontWeight={900} fontSize={14}>
              Create your Ecircle
            </TYPE.white>
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
