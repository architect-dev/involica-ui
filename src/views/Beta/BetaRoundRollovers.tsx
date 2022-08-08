import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from 'uikit'
import SummitButton from 'uikit/components/Button/SummitButton'
import { elevationUtils } from 'config/constants'
import useRolloverElevation from 'hooks/useRolloverElevation'
import { rolloverOrUnlockAvailable, RoundStatus, elevationLocked, useElevationsRoundStatuses } from 'state/hooksNew'

const BTCard = styled(Flex)`
  align-self: baseline;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  text-align: center;
  width: 100%;
  background: ${({ theme }) => theme.colors.background};
  max-width: 850px;
  margin: 0px auto 24px auto;
  box-shadow: ${({ theme }) => `1px 1px 2px ${theme.colors.textShadow}`};
  border-radius: 4px;

  &:first-child {
    margin-top: 0px;
  }
`

const WrapperFlex = styled(Flex)`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  padding: 28px 24px 28px 24px;
  flex-wrap: wrap;
`

const FarmNumericalInfoFlex = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
  gap: 12px;
  width: 100%;
`

const BetaRoundRolloversCard: React.FC = () => {
  const { onRolloverElevation, elevsPending } = useRolloverElevation()

  const elevsRoundStatuses = useElevationsRoundStatuses()

  return (
    <BTCard>
      <WrapperFlex>
        <Text monospace italic small mb='14px' textAlign='center'>
          Thanks for keeping the SUMMIT ecosystem up to date!.
          Ping any of the team members to reimburse your gas costs.
        </Text>

        <FarmNumericalInfoFlex>
          { elevationUtils.elevationExpedition.map((elevation, elevDataIndex) => (
            <SummitButton
              key={elevation}
              onClick={() => onRolloverElevation(elevation, elevsRoundStatuses[elevDataIndex] === RoundStatus.UnlockAvailable)}
              width='160px'
              summitPalette={elevation}
              disabled={!rolloverOrUnlockAvailable(elevsRoundStatuses[elevDataIndex])}
              isLoading={elevsPending[elevation]}
            >
              { elevationLocked(elevsRoundStatuses[elevDataIndex]) ? 'UNLOCK' : 'ROLLOVER' }
              <br/>
              {elevation}
            </SummitButton>
          ))}
        </FarmNumericalInfoFlex>
      </WrapperFlex>
    </BTCard>
  )
}

export default BetaRoundRolloversCard
