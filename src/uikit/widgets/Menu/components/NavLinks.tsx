import React from 'react'
import styled, { css } from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { MenuEntry } from '../types'
import { pressableMixin } from 'uikit/util/styledMixins'
import { Text } from 'uikit/components/Text'

interface Props {
    links: Array<MenuEntry>
    mobileNav: boolean
}

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: 100%;
    gap: 24px;
`

const ItemFlex = styled.div<{ selected: boolean, index: number }>`
    display: flex;
    gap: 6px;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 100%;
    ${({ theme, index }) => pressableMixin({
        theme,
        hoverStyles: css`
            .item-label {
                font-weight: bold;
                text-decoration: underline;
            }
        `
    })}

    ${({ selected, index }) => selected && css`
        .item-label {
            font-weight: bold;
            text-decoration: underline;
        }
    `}
`

const NavLinks: React.FC<Props> = ({ links }) => {
    const location = useLocation()
    const keyPath = location.pathname.split('/')[1]

    return (
        <Container>
            {links.map((entry, index) => {
                const selected = entry.keyPaths.includes(keyPath)
                if (entry.external) return (
                    <ItemFlex key={entry.href} rel="noreferrer noopener" target="_blank" selected={false} index={index} as='a' href={entry.href}>
                        <Text className='item-label' monospace bold={selected}>{entry.label}</Text>
                    </ItemFlex>
                )
                return (
                    <ItemFlex key={entry.href} selected={selected} index={index} as={Link} to={entry.href} replace>
                        <Text className='item-label' monospace bold={selected}>{entry.label}</Text>
                    </ItemFlex>
                )
            })}
        </Container>
    )
}

export default React.memo(NavLinks)
