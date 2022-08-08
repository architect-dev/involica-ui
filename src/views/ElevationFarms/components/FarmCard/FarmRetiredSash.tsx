import React from "react"
import styled from "styled-components"
import { Text } from 'uikit'

const SashWrapper = styled.div`
    pointer-events: none;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 80px;
    height: 80px;
    overflow: hidden;
`

const Sash = styled.div`
    position: absolute;
    width: 160px;
    height: 24px;
    left: -50px;
    top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(-45deg);
    transform-origin: 80px 12px;
    background-color: #FF0000;
    box-shadow: ${({ theme }) => `1px 1px 2px ${theme.colors.textShadow}`};
`

export const FarmRetiredSash: React.FC = React.memo(() => {
    return (
        <SashWrapper>
            <Sash>
                <Text bold monospace small color='white'>RETIRED</Text>
            </Sash>
        </SashWrapper>
    )
})