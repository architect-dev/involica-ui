import React, { useCallback, useEffect, useState } from 'react'
import { Flex, Text, Modal, ChevronRightIcon, ModalActions, SummitButton, TokenSymbolImage, Lock } from 'uikit'
import { Elevation, SummitPalette } from 'config/constants/types'
import { isNumber } from 'lodash'
import { capitalizeFirstLetter, getExpectedEverestAward, getFormattedBigNumber, getFullDisplayBalance, timestampToDateWithYear } from 'utils'
import ElevationSelector from '../ElevationSelector'
import TokenInput from 'components/TokenInput'
import { useEverestUserInfo, useSymbolElevateModalInfo } from 'state/hooksNew'
import { TokenSymbol } from 'config/constants'
import BigNumber from 'bignumber.js'
import { useCurrentTimestampOnce } from 'state/hooks'
import styled from 'styled-components'


const StyledLock = styled(Lock)`
  transform: rotate(20deg);
  fill: ${({ theme }) => theme.colors.textGold};
`

const InfoText = styled(Text)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc(100% - 48px);
`

interface LockFarmSummitForEverestProps {
  sourceElevation?: Elevation

  onConfirmLock: (
    sourceElevation: Elevation,
    amount: string,
  ) => void
  onDismiss?: () => void
}

const LockFarmSummitForEverestModal: React.FC<LockFarmSummitForEverestProps> = ({
  sourceElevation = null,
  onConfirmLock,
  onDismiss,
}) => {
  const {
    elevLaunched,
    elevStaked,
  } = useSymbolElevateModalInfo(TokenSymbol.SUMMIT)


  const {
    everestOwned,
    lockRelease,
    lockDuration,
  } = useEverestUserInfo()
  const currentTimestamp = useCurrentTimestampOnce()

  const anyEverestOwned = everestOwned.isGreaterThan(0)



  const sourceElevations = [Elevation.OASIS, Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT]
  const disabledElevations = sourceElevations.filter((elevToDisable) => !elevLaunched[elevToDisable])

  const [selectedSourceElevation, setSelectedSourceElevation] = useState(sourceElevation || null)

  const [fullBalance, setFullBalance] = useState('0')
  const [val, setVal] = useState('')
  const [invalidVal, setValInvalid] = useState(true)

  const validElevateVal = (testVal, stakedBal) => {
    return isNumber(parseFloat(testVal)) && parseFloat(testVal) > 0 && parseFloat(testVal) <= parseFloat(stakedBal)
  }

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
      setValInvalid(!validElevateVal(e.currentTarget.value, fullBalance))
    },
    [setVal, setValInvalid, fullBalance],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
    setValInvalid(!validElevateVal(fullBalance, fullBalance))
  }, [fullBalance, setVal, setValInvalid])

  const handleSelectSourceElevation = useCallback(
    (newElevation: Elevation) => setSelectedSourceElevation(newElevation),
    [setSelectedSourceElevation],
  )

  useEffect(
    () => {
      if (selectedSourceElevation === null) return
      
      const newFullBalance = getFullDisplayBalance(elevStaked[selectedSourceElevation])
      setFullBalance(newFullBalance)
      setVal(newFullBalance)
      setValInvalid(!validElevateVal(newFullBalance, newFullBalance))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedSourceElevation]
  )

  // CONFIRM ELEVATE
  const handleConfirmLock = useCallback(() => {
    onDismiss()
    onConfirmLock(selectedSourceElevation, val)
  }, [onDismiss, onConfirmLock, selectedSourceElevation, val])



  const minLockRelease = currentTimestamp + (7 * 24 * 3600)
  const newLockRelease = Math.max(minLockRelease, lockRelease)
  const newReleaseDate = timestampToDateWithYear(newLockRelease)

  const everestAwardFromLocking = getExpectedEverestAward(new BigNumber(val).times(new BigNumber(10).pow(18)), lockDuration)
  const rawEverestAward = getFormattedBigNumber(everestAwardFromLocking)


  return (
    <Modal
      title='LOCK SUMMIT|br|FOR EVEREST'
      onDismiss={onDismiss}
      elevationCircleHeader={SummitPalette.EVEREST}
      headerless
    >
      <Flex gap='18px' justifyContent="center" flexDirection="column" alignItems="center" maxWidth='350px'>
        <Text textAlign="center" monospace small bold mt='-24px'>
          Directly lock your staked SUMMIT for
          <br/>
          EVEREST and avoid the Decaying Withdrawal Fee.
        </Text>

        { anyEverestOwned ?
          <Text textAlign="center" monospace small italic bold mt='-8px'>
            *Locked SUMMIT will be added to your existing Lock Period
          </Text> :
          <Flex width='100%' alignItems='center' justifyContent='flex-start' gap='8px' mt='-8px'>
            <StyledLock width='18px'/>
            <Text bold italic gold small monospace textAlign='left'>
              You have to lock SUMMIT for the first time through the EVEREST tab.
            </Text>
          </Flex>
        }

        <Flex justifyContent="space-around" alignItems="center" width="100%">
          <Flex flexDirection="column" alignItems="center">
            <ElevationSelector
              selected={selectedSourceElevation}
              elevations={sourceElevations}
              // disabledElevations={disabledElevations}
              lockedElevations={[]}
              disabled={!anyEverestOwned}
              selectElevation={handleSelectSourceElevation}
              vertical
            />
          </Flex>

          <Flex>
            <ChevronRightIcon width="24px" mr="-8px" key="a" />
            <ChevronRightIcon width="24px" ml="-8px" key="b" />
          </Flex>

          <Flex flexDirection="column" alignItems="center">
            <TokenSymbolImage symbol={TokenSymbol.EVEREST} width={124} height={124}/>
          </Flex>
        </Flex>

        <Text bold monospace small mb='-18px'>
          AMOUNT TO LOCK:
        </Text>
        <TokenInput
          summitPalette={SummitPalette.EVEREST}
          value={val}
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          balanceText={`${selectedSourceElevation != null ? capitalizeFirstLetter(selectedSourceElevation) : ''} Staked`}
          max={fullBalance}
          disabled={selectedSourceElevation == null || !anyEverestOwned}
          symbol='SUMMIT'
        />

        <InfoText monospace small textAlign='center'>
          <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
            <Text monospace small textAlign='left'>Unlock Date:</Text>
            <Text bold monospace textAlign='right'>{newReleaseDate}</Text>
          </Flex>
          <Flex flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
            <Text monospace small textAlign='left'>EVEREST Award:</Text>
            <Text bold monospace textAlign='right'>{rawEverestAward} EVEREST</Text>
          </Flex>
        </InfoText>
      </Flex>

      <ModalActions>
        <SummitButton secondary onClick={onDismiss}>
          CANCEL
        </SummitButton>
        <SummitButton
          summitPalette={SummitPalette.EVEREST}
          disabled={invalidVal || selectedSourceElevation == null || !anyEverestOwned}
          onClick={handleConfirmLock}
        >
          LOCK STAKED
          <br/>
          SUMMIT
        </SummitButton>
      </ModalActions>
    </Modal>
  )
}

export default LockFarmSummitForEverestModal
