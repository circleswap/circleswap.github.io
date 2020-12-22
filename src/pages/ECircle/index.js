import React, { useState } from 'react'
import styled from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { useTranslation } from 'react-i18next'
import { RowBetween } from '../../components/Row'
import { Button, ExternalLink, TYPE } from '../../theme'
import { ButtonBlue } from '../../components/Button'
import { Balls } from '../../components/Ball/inidex'
import JoinECircleModal from '../../components/ECircle/JoinECircleModal'
import { useJoinNCircle, useNCircle, useNCircleJoinAble } from '../../hooks/useNCircle'
import { useMyECircle } from '../../state/ecircle/hooks'
import { Link } from 'react-router-dom'

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
  const JoinCircle = useJoinNCircle()
  const myCircle = useMyECircle()

  console.log('myCircle', JoinCircle)

  const [showJoinECircleModal, setShowJoinECircleModal] = useState(false)

  return (
    <PageWrapper>
      <AutoColumn gap="lg" justify="center">
        <Balls />
        <RowBetween style={{ marginTop: 48, rowGap: '19' }} gap="19px">
          <Button
            disabled={!able || circle || JoinCircle}
            style={{ width: '46%' }}
            onClick={() => {
              history.push('/ecircle/create')
            }}
          >
            {t('createECircle')}
          </Button>
          <Button
            disabled={!able || circle || JoinCircle}
            style={{ width: '46%' }}
            onClick={() => {
              setShowJoinECircleModal(true)
            }}
          >
            {t('joinECircle')}
          </Button>
        </RowBetween>
        <ButtonBlue
          disabled={!able || (JoinCircle < 1 && circle < 1)}
          onClick={() => {
            history.push('/stake')
          }}
        >
          {t('stakeMyLPT')}
        </ButtonBlue>
        {myCircle.id && (
          <TYPE.main fontSize={14}>
            {t('check')} <Link to="/myecircle">{t('eCircle')}</Link>
          </TYPE.main>
        )}

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
