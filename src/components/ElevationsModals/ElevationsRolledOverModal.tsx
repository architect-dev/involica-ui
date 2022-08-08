import React, { useCallback } from 'react'
import { Elevation, elevationUtils, SummitPalette } from 'config/constants/types'
import styled from 'styled-components'
import { Modal, Flex, ModalActions, SummitButton } from 'uikit'
import { RolledOverElevation } from './RolledOverElevation'
import { useDispatch } from 'react-redux'
import { clearElevationRolloversToShow } from 'state/summitEcosystem'
import { useElevationsRolledOverInfo, useUserTotems } from 'state/hooksNew'

interface Props {
  elevations?: Elevation[]
  onDismiss?: () => void
}

const WinnersWrapper = styled.div`
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-wrap: wrap;
  flex-shrink: 1;
  gap: 12px;
`

export const ElevationsRolledOverModal: React.FC<Props> = ({ elevations = [], onDismiss }) => {
  const dispatch = useDispatch()
  const handleDismiss = useCallback(() => {
    dispatch(clearElevationRolloversToShow())
    onDismiss()
  }, [dispatch, onDismiss])
  const userTotems = useUserTotems()
  const elevationsWinnings = useElevationsRolledOverInfo()

  return (
    <Modal
      title={`WINNING|br|TOTEM${elevations.length > 1 ? 'S' : ''}`}
      onDismiss={handleDismiss}
      headerless
      elevationGlow={SummitPalette.GOLD}
      elevationCircleHeader={elevations.length > 1 ? 'BLUE' : elevations[0]}
    >
      <Flex alignItems="center" flexDirection="column">
        <WinnersWrapper>
          {elevationUtils.elevationExpedition
            .filter((elev) => elevations.includes(elev))
            .map((elev) => (
              <RolledOverElevation
                key={elev}
                elevation={elev}
                totem={userTotems[elevationUtils.toInt(elev)]}
                {...elevationsWinnings[elevationUtils.toInt(elev)]}
                multiWin={elevations.length > 1}
              />
            ))
          }
        </WinnersWrapper>

        <ModalActions>
          <SummitButton secondary onClick={handleDismiss}>
            CLOSE
          </SummitButton>
        </ModalActions>
      </Flex>
    </Modal>
  )
}
