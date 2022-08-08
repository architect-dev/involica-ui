import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'
import { MenuEntry, LinkLabel, MenuGap } from './MenuEntry'
import MenuLink from './MenuLink'
import { PanelProps, PushedProps } from '../types'
import { Elevation, elevationUtils } from 'config/constants/types'
import SelectableIcon from './SelectableIcon'
import { useExpeditionUserDeity } from 'state/hooksNew'

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
  const userDeity = useExpeditionUserDeity()

  // Close the menu when a user clicks a link on mobile
  const handleClick = useCallback(() => {
    if (isMobile) {
      pushNav(false)
    }
  }, [isMobile, pushNav])

  const entryIcon = useCallback(
    (elevation, icon) => {
      if (elevation == null) return icon
      if (elevation === Elevation.OASIS) return 'totemIcons/OTTER.png'
      if (elevation === Elevation.EXPEDITION) return `totemIcons/${elevationUtils.getElevationTotemName(
        Elevation.EXPEDITION,
        userDeity
      )}.png`
      return ''
    },
    [userDeity]
  )

  return (
    <Container>
      {links.map((entry) => {
        const calloutClass = entry.calloutClass ? entry.calloutClass : undefined

        const isActive = !entry.neverHighlight && entry.icon != null && entry.keyPaths.includes(keyPath)

        const backgroundIcon =
          entry.elevation === Elevation.EXPEDITION ? 'totemIcons/expeditionIconBackground.png' : null

        if (entry.gap) return <MenuGap key={entry.href} />

        return (
          <MenuEntry
            key={entry.href}
            isPushed={isPushed}
            disabled={entry.disabled}
            textItem={entry.icon == null}
            isActive={isActive}
            className={calloutClass}
            elevation={entry.elevation || entry.palette || entry.label}
          >
            <MenuLink
              href={entry.href}
              rel="noreferrer noopener"
              target={entry.external ? '_blank' : '_self'}
              onClick={handleClick}
            >
              {entry.icon != null && (
                <SelectableIcon
                  isActive={isActive}
                  elevation={entry.elevation || entry.palette || entry.label}
                  icon={entryIcon(entry.elevation, entry.icon)}
                  backgroundIcon={backgroundIcon}
                  elevationLocked={false}
                />
              )}
              <LinkLabel isActive={isActive} isPushed={isPushed} elevation={entry.elevation || entry.palette || entry.label}>
                {entry.icon == null && ' - '}
                {entry.label.split('|').map((text) => (text === 'br' ? <br key={text} /> : text))}
              </LinkLabel>
            </MenuLink>
          </MenuEntry>
        )
      })}
    </Container>
  )
}

export default PanelBody
