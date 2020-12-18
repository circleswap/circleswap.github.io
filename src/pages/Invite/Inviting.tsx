import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import { Wrapper } from '../Pool/styleds'
import styled from 'styled-components'
import { TYPE } from '../../theme'
import { ButtonPrimary } from '../../components/Button'
import { useActiveWeb3React } from '../../hooks'
import { useUserInvited } from '../../hooks/useInvited'
import { ZERO_ADDRESS } from '../../constants'
import AppBody from '../AppBody'
import ncircleEmpty from '../../assets/images/ncircle_empty.svg'
import Copy from '../../components/AccountDetails/Copy'

const EmptyWrapper = styled.div<{}>``

const InputPanel = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 13px;
  margin-bottom: 24px;
`
const Input = styled.div`
  height: 40px;
  background-color: #f8f8f8;
  line-height: 40px;
  padding: 0 13px;
  flex: 1;
`

export default function Inviting({
  match: {
    params: { address }
  },
  history
}: RouteComponentProps<{ address?: string }>) {
  const { account } = useActiveWeb3React()
  const invited = useUserInvited(account)
  return (
    <>
      <Wrapper>
        <AutoColumn gap="20px">
          {ZERO_ADDRESS !== invited && invited ? (
            <AppBody>
              <ColumnCenter style={{ width: 463 }}>
                <TYPE.largeHeader color="#2C2C2C">My NCircle</TYPE.largeHeader>
              </ColumnCenter>
              <TYPE.main marginTop="44px" color="#888888">
                My invitation link
              </TYPE.main>
              <InputPanel>
                <Input>{account}</Input>
                <Copy toCopy={'https://circleswap.netlify.app/invite/' + account ?? ''} />
              </InputPanel>
            </AppBody>
          ) : (
            <EmptyWrapper>
              <img src={ncircleEmpty} alt="" />
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
            </EmptyWrapper>
          )}
        </AutoColumn>
      </Wrapper>
    </>
  )
}
