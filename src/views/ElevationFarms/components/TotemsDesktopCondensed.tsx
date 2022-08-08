import React from 'react'
import styled from 'styled-components'
import Flex from 'uikit/components/Box/Flex'
import { Text } from 'uikit/components/Text'
import { Elevation, elevationUtils } from 'config/constants'
import Totem from './Totem'
import { useMatchBreakpoints } from 'uikit'
import { useUserTotemsAndCrowns } from 'state/hooksNew'

const TotemWrapper = styled.div<{ index: number }>`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -10px;
    margin-right: -10px;
    z-index: ${({ index }) => 5 - index};
`

const TotemsCondensed: React.FC = () => {
    const userTotemsAndCrowned = useUserTotemsAndCrowns()
    return (
        <Flex width='140px' alignItems='center' justifyContent='flex-start' flexDirection='column'>
            <Text bold monospace>USER TOTEMS:</Text>
            <Flex mt='6px' mb='-6px'>
                <TotemWrapper index={0}>
                    <Totem
                        elevation={Elevation.OASIS}
                        totem={0}
                        pressable={false}
                        size='42'
                    />
                </TotemWrapper>
                { elevationUtils.elevationOnly.map((elev, index) => {
                    const { userTotem, crowned } = userTotemsAndCrowned[elevationUtils.toInt(elev)]
                    return (
                        <TotemWrapper key={elev} index={index + 1}>
                            <Totem
                                elevation={elev}
                                totem={userTotem}
                                crowned={crowned}
                                pressable={false}
                                size='42'
                            />
                        </TotemWrapper>
                    )
                })}
            </Flex>
        </Flex>
    )
}

const TotemsDesktopCondensed: React.FC = () => {
    const { isXl } = useMatchBreakpoints();
    const isMobile = isXl === false;

    if (isMobile) return null
    return (<TotemsCondensed/>)
}

export default React.memo(TotemsDesktopCondensed)
