import React, { useState } from 'react'
import { useCurrentTimestampOnce } from 'state/hooks'
import { EverestUserData, LockSummitButtonType } from 'state/types'
import { Flex, Text } from 'uikit'
import { getAdditionalEverestAwardForLockDurationIncrease, lockDurationTextLong } from 'utils'
import EverestLockDurationSlider from '../../../uikit/widgets/EverestLockDurationSlider'
import { LockSummitInfoAndButton } from './LockSummitInfoAndButton'

interface Props {
    userEverestInfo: EverestUserData
}

export const IncreaseLockDurationSection: React.FC<Props> = ({ userEverestInfo }) => {
    const {
        summitLocked,
        lockDuration: existingLockDuration,
        everestOwned: existingEverestOwned,
    } = userEverestInfo
    const currentTimestamp = useCurrentTimestampOnce()

    const [lockDuration, setLockDuration] = useState<number | null>(existingLockDuration)

    const everestAward = getAdditionalEverestAwardForLockDurationIncrease(
        summitLocked,
        lockDuration,
        existingEverestOwned,
    )

    const lockRelease = currentTimestamp + (lockDuration * (24 * 3600))
    const lockDurationIncreased = lockDuration > existingLockDuration
        
    return (
        <Flex gap='18px' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
            <Text bold monospace small italic textAlign='left' pl='6px' style={{width: '100%'}} mb='-18px'>
                INCREASE LOCK DURATION: {lockDuration != null ? lockDurationTextLong(lockDuration) : '-'}
            </Text>
            <EverestLockDurationSlider
                existingLockDuration={existingLockDuration}
                setLockDuration={setLockDuration}
            />

            <LockSummitInfoAndButton
                approved
                disabled={!lockDurationIncreased}
                type={LockSummitButtonType.IncreaseLockDuration}
                amount={summitLocked}
                duration={lockDuration}
                lockRelease={lockRelease}
                everestAward={everestAward}
            />
        </Flex>
    )
}