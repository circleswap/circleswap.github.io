import React from 'react'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import { Wrapper } from '../Pool/styleds'
import styled from 'styled-components'
import { CloseIcon, TYPE } from '../../theme'
import { ButtonPrimary } from '../../components/Button'
import { useActiveWeb3React } from '../../hooks'
import AppBody from '../AppBody'
import { ReactComponent as NcircleEmpty } from '../../assets/images/ncircle_empty.svg'
import Copy from '../../components/AccountDetails/Copy'
import { useMyECircle, useMyJoinedECircle } from '../../state/ecircle/hooks'
import { useTranslation } from 'react-i18next'
import { isMobile } from 'react-device-detect'

const InputPanel = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 13px;
  margin-bottom: 24px;
  overflow: hidden;
`
const Input = styled.div`
  height: 40px;
  line-height: 40px;
  padding: 0 13px;
  flex: 1;
  border-radius: 4px;
  color: ${({ theme }) => theme.text1};
  border: 1px solid ${({ error, theme }) => (error ? theme.red1 : theme.bg2)};
  transition: border-color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')},
    color 500ms ${({ error }) => (error ? 'step-end' : 'step-start')};
  background-color: ${({ theme }) => theme.bg2};
  overflow: hidden;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 200px;
    padding-right: 40px
  `};
`

const Header = styled(ColumnCenter)`
  width: 463px
    ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `};
`

export default function MyECircle({ history }) {
  const { account } = useActiveWeb3React()
  const circle = useMyECircle()
  const jointedCircle = useMyJoinedECircle()
  const { t } = useTranslation()

  return (
    <>
      <Wrapper>
        <AutoColumn gap="20px">
          {circle.name && (
            <AppBody>
              <CloseIcon style={{ top: 12 }} onClick={() => history.push('/ecircle')} />
              <Header>
                <TYPE.largeHeader>{t('myECircle')}</TYPE.largeHeader>
              </Header>
              <TYPE.main marginTop="44px">name</TYPE.main>
              <InputPanel>
                <Input>
                  {circle && circle.name}
                  {t('circleName')}
                  <TYPE.blue display={'inline'}>
                    {' '}
                    ({circle && circle.count.toString()} / {circle.level})
                  </TYPE.blue>
                </Input>
              </InputPanel>

              <TYPE.main marginTop="44px">{t('invitationAddress')}</TYPE.main>
              <InputPanel>
                <Input>{account}</Input>
                <Copy toCopy={account} />
              </InputPanel>
            </AppBody>
          )}

          {jointedCircle.name && (
            <AppBody>
              <CloseIcon style={{ top: 12 }} onClick={() => history.push('/ecircle')} />
              <Header>
                <TYPE.largeHeader>{t('myECircle')}</TYPE.largeHeader>
              </Header>
              <TYPE.main marginTop="44px">{t('circleName')}</TYPE.main>
              <InputPanel>
                <Input>
                  {jointedCircle && jointedCircle.name}{' '}
                  <TYPE.blue display={'inline'}>
                    {' '}
                    ({jointedCircle && jointedCircle.count.toString()} / {jointedCircle.level}){' '}
                  </TYPE.blue>
                </Input>
              </InputPanel>

              <TYPE.main marginTop="44px">Invitation Address:</TYPE.main>
              <InputPanel>
                <Input>{jointedCircle.address}</Input>
                <Copy toCopy={jointedCircle.address} />
              </InputPanel>
            </AppBody>
          )}

          {!circle.name && !jointedCircle.name && (
            <AutoColumn gap="lg" style={{ width: isMobile ? '60%' : '' }}>
              <NcircleEmpty />
              <Header>
                <TYPE.largeHeader color="#2C2C2C">{t('dontHaveNCircle')}</TYPE.largeHeader>
              </Header>
              <ButtonPrimary
                padding="16px 16px"
                width="100%"
                fontSize="20px"
                borderRadius="100px"
                mt="1rem"
                onClick={() => {
                  history.push('/invite')
                }}
              >
                {t('createECircle')}
              </ButtonPrimary>
            </AutoColumn>
          )}
        </AutoColumn>
      </Wrapper>
    </>
  )
}
