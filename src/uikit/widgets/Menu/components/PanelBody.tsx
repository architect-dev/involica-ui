import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'
import { LinkLabel, MenuEntry, MenuGap } from './MenuEntry'
import MenuLink from './MenuLink'
import { PanelProps, PushedProps } from '../types'

interface Props extends PanelProps, PushedProps {
  isMobile: boolean
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;

  ${({ theme }) => theme.mediaQueries.invNav} {
    justify-content: flex-start;
  }
`

const PanelBody: React.FC<Props> = ({ isPushed, pushNav, isMobile, links }) => {
  const location = useLocation()
  const keyPath = location.pathname.split('/')[1]

  // Close the menu when a user clicks a link on mobile
  const handleClick = useCallback(() => {
    if (isMobile) {
      pushNav(false)
    }
  }, [isMobile, pushNav])

  return (
    <Container>
      {links.map((entry) => {
        const calloutClass = entry.calloutClass ? entry.calloutClass : undefined

        const isActive = !entry.neverHighlight && entry.icon != null && entry.keyPaths.includes(keyPath)

        if (entry.gap) return <MenuGap key={entry.href} />

        return (
          <MenuEntry
            key={entry.href}
            isPushed={isPushed}
            disabled={entry.disabled}
            textItem={entry.icon == null}
            isActive={isActive}
            className={calloutClass}
          >
            <MenuLink
              href={entry.href}
              rel="noreferrer noopener"
              target={entry.external ? '_blank' : '_self'}
              onClick={handleClick}
            >
              <LinkLabel isActive={isActive}>{entry.label}</LinkLabel>
            </MenuLink>
          </MenuEntry>
        )
      })}
    </Container>
  )
}

export default PanelBody
