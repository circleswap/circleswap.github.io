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
import { ReactComponent as NcircleEmpty } from '../../assets/images/ncircle_empty.svg'
import Copy from '../../components/AccountDetails/Copy'
import { ArrowLeft } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { isMobile } from 'react-device-detect'

const InputPanel = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 13px;
  margin-bottom: 24px;
`
const Input = styled.div`
  height: 40px;
  background-color: ${({ theme }) => theme.bg3};
  line-height: 40px;
  border-radius: 12px;
  padding: 0 13px;
  flex: 1;
  max-width: 200px;
  overflow: hidden;
`

const StyledArrowLeft = styled(ArrowLeft)`
  position: absolute;
  left: 34px;
  cursor: pointer;
  color: ${({ theme }) => theme.text1};
`

export default function Inviting({
  match: {
    params: { address }
  },
  history
}: RouteComponentProps<{ address?: string }>) {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const invited = useUserInvited(account)
  return (
    <>
      <Wrapper>
        <AutoColumn gap="20px">
          {ZERO_ADDRESS !== invited && invited ? (
            <AppBody>
              <ColumnCenter style={{ width: isMobile? '100%' : 463 }}>
                <StyledArrowLeft
                  onClick={() => {
                    history.push('/invite')
                  }}
                />
                <TYPE.largeHeader>{t('myNCircle')}</TYPE.largeHeader>
              </ColumnCenter>
              <TYPE.main marginTop="44px" color="#888888">
                My invitation link
              </TYPE.main>
              <InputPanel>
                <Input>{account}</Input>
                <Copy toCopy={'https://app.circleswap.org/#/invite/' + account ?? ''} />
              </InputPanel>
            </AppBody>
          ) : (
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
