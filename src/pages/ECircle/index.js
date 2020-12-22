import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { useTranslation } from 'react-i18next'
import { AlertTriangle } from 'react-feather'
import { AutoRow, RowBetween } from '../../components/Row'
import { Button, TYPE } from '../../theme'
import { ButtonBlue } from '../../components/Button'
import { Balls } from '../../components/Ball/inidex'
import JoinECircleModal from '../../components/ECircle/JoinECircleModal'
import { useAllCircleData, useJoinNCircle, useNCircle, useNCircleJoinAble } from '../../hooks/useNCircle'
import { useMyECircle } from '../../state/ecircle/hooks'
import { Link } from 'react-router-dom'

const PageWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 38px 169px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background-color: ${({ theme }) => theme.bg1};
`

const TipFrame = styled(AutoColumn)`
  border-radius: 14px;
  padding-top: 19px;
  padding-bottom: 24px;
  background-color: ${({ theme }) => theme.bg1};
`

export default function ECircle({ history }) {
  const { t } = useTranslation()
  const able = useNCircleJoinAble()
  const circle = useNCircle()
  const JoinCircle = useJoinNCircle()
  const myCircle = useMyECircle()

  const [showJoinECircleModal, setShowJoinECircleModal] = useState(false)
  const allCircles = useAllCircleData()

  const renderBalls = useCallback(() => {
    return <Balls tabs={allCircles} />
  }, [allCircles])

  return (
    <PageWrapper>
      <AutoColumn gap="lg" justify="center">
        <TipFrame gap="md">
          <TYPE.mediumHeader fontSize={14}>创建或加入ECircle前，您需要满足以下两个条件：</TYPE.mediumHeader>

          <AutoRow style={{ display: 'flex', alignItems: 'center' }}>
            <AlertTriangle color={'#FF7238'}/>
            <TYPE.main fontSize={14} marginLeft={10}>
              1. 先创建NCircle；
            </TYPE.main>
          </AutoRow>

          <AutoRow style={{ display: 'flex', alignItems: 'center' }}>
            <AlertTriangle color={'#FF7238'}/>
            <TYPE.main fontSize={14} marginLeft={10}>
              2. 交易额不低于100HT等值金额；
            </TYPE.main>
          </AutoRow>
        </TipFrame>

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
