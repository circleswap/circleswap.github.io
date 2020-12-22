import React, { ReactComponentElement, useContext, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useUserInvited } from '../../hooks/useInvited'
import { RowBetween } from '../../components/Row'
import { Button, ExternalLink, TYPE } from '../../theme'
import { ButtonBlue } from '../../components/Button'
import { Balls } from '../../components/Ball/inidex'
import JoinECircleModal from '../../components/ECircle/JoinECircleModal'
import { useActiveWeb3React } from '../../hooks'
import { useNCircle, useNCircleJoinAble } from '../../hooks/useNCircle'

const PageWrapper = styled(AutoColumn)`
  margin-top: 22rem;
  width: 100%;
  padding: 38px 169px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background-color: ${({ theme }) => theme.bg1};
`

export default function ECircle({ history }) {
  const { t } = useTranslation()
  const able = useNCircleJoinAble()
  const circle = useNCircle()
  const [showJoinECircleModal, setShowJoinECircleModal] = useState(false)

  return (
    <PageWrapper>
      <AutoColumn gap="lg" justify="center">
        <Balls />
        <RowBetween style={{ marginTop: 48, rowGap: '19' }} gap="19px">
          <Button
            disabled={!able}
            style={{ width: '46%' }}
            onClick={() => {
              history.push('/ecircle/create')
            }}
          >
            {t('createECircle')}
          </Button>
          <Button
            disabled={!able}
            style={{ width: '46%' }}
            onClick={() => {
              setShowJoinECircleModal(true)
            }}
          >
            {t('joinECircle')}
          </Button>
        </RowBetween>
        <ButtonBlue
          disabled={!circle || circle < 1}
          onClick={() => {
            history.push('/stake')
          }}
        >
          {t('stakeMyLPT')}
        </ButtonBlue>
        <TYPE.main fontSize={14}>
          {t('check')} <ExternalLink href="./myECircle">{t('eCircle')}</ExternalLink>
        </TYPE.main>
        <TYPE.main fontSize={13} marginTop={24}>
          {t('note')}
        </TYPE.main>
      </AutoColumn>
      <JoinECircleModal
        isOpen={showJoinECircleModal}
        address={''}
        onDismiss={() => {
          setShowJoinECircleModal(false)
        }}
      />
    </PageWrapper>
  )
}
