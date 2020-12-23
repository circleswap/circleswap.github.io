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

const InputPanel = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 13px;
  margin-bottom: 24px;
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
`

export default function MyECircle({ history }) {
  const { account } = useActiveWeb3React()
  const circle = useMyECircle()
  const jointedCircle = useMyJoinedECircle()
  console.log('mycircle', circle)
  console.log('myjointedCircle', jointedCircle)

  return (
    <>
      <Wrapper>
        <AutoColumn gap="20px">
          {circle.name && (
            <AppBody>
              <CloseIcon style={{ top: 12 }} onClick={() => history.push('/ecircle')} />
              <ColumnCenter style={{ width: 463 }}>
                <TYPE.largeHeader>My ECircle</TYPE.largeHeader>
                <CloseIcon />
              </ColumnCenter>
              <TYPE.main marginTop="44px">My ECircle name</TYPE.main>
              <InputPanel>
                <Input>
                  {circle && circle.name}{' '}
                  <TYPE.blue display={'inline'}>
                    {' '}
                    ({circle && circle.count} / {circle.level})
                  </TYPE.blue>
                </Input>
              </InputPanel>

              <TYPE.main marginTop="44px">Invitation link</TYPE.main>
              <InputPanel>
                <Input>{account}</Input>
                <Copy toCopy={account} />
              </InputPanel>
            </AppBody>
          )}

          {jointedCircle.name && (
            <AppBody>
              <CloseIcon style={{ top: 12 }} onClick={() => history.push('/ecircle')} />
              <ColumnCenter style={{ width: 463 }}>
                <TYPE.largeHeader>My ECircle</TYPE.largeHeader>
              </ColumnCenter>
              <TYPE.main marginTop="44px">My ECircle name</TYPE.main>
              <InputPanel>
                <Input>
                  {jointedCircle && jointedCircle.name}{' '}
                  <TYPE.blue display={'inline'}>
                    {' '}
                    ({jointedCircle && jointedCircle.count} / {jointedCircle.level}){' '}
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
            <AutoColumn gap="lg">
              <NcircleEmpty />
              <ColumnCenter>
                <TYPE.largeHeader color="#2C2C2C">{`You don't have NCircle`}</TYPE.largeHeader>
              </ColumnCenter>
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
                Create
              </ButtonPrimary>
            </AutoColumn>
          )}
        </AutoColumn>
      </Wrapper>
    </>
  )
}
