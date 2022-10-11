import React, { useCallback } from 'react'
import styled from 'styled-components'
import * as IconModule from '../icons'
import { SvgProps } from '../../../components/Svg'
import { MENU_ENTRY_HEIGHT } from '../config'
import { MenuEntry, PanelProps, PushedProps } from '../types'
import SocialLinks from './SocialLinks'
import { LinkLabel, MenuEntry as MenuEntryComponent } from './MenuEntry'
import MenuLink from './MenuLink'

interface Props extends PanelProps, PushedProps {
  additionals: MenuEntry[]
  isMobile: boolean
}

const Container = styled.div<{ isPushed: boolean }>`
  flex: none;
  padding: ${({ isPushed }) => (isPushed ? '8px 16px' : '0 0 0 4px')};
`

const AdditionalContainer = styled.div`
  padding-bottom: 16px;
`

const SettingsEntry = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${MENU_ENTRY_HEIGHT}px;
  margin-top: 8px;
  padding: 0 8px;
`

const Icons = (IconModule as unknown) as { [key: string]: React.FC<SvgProps> }

const PanelFooter: React.FC<Props> = ({ pushNav, additionals, isMobile }) => {
  // Close the menu when a user clicks a link on mobile
  const handleClick = useCallback(
    () => {
      if (isMobile) pushNav(false)
    },
    [isMobile, pushNav]
  )

  return (
    <Container isPushed={false}>
      <AdditionalContainer>
        {(additionals || []).map((entry) => {
          const Icon = Icons[entry.icon]
          const iconElement = <Icon width="24px" mr="8px" />
          const calloutClass = entry.calloutClass ? entry.calloutClass : undefined

          return (
            <MenuEntryComponent
              key='hi'
              isPushed={false}
              textItem={false}
              isActive={entry.href === window.location.pathname}
              className={calloutClass}
            >
              <MenuLink
                href={entry.href}
                rel="noreferrer noopener"
                target={entry.external ? '_blank' : '_self'}
                onClick={handleClick}
              >
                {iconElement}
                <LinkLabel isPushed={false}>{entry.label}</LinkLabel>
              </MenuLink>
            </MenuEntryComponent>
          )
        })}
      </AdditionalContainer>

      <SettingsEntry>
        <SocialLinks />
      </SettingsEntry>
    </Container>
  )
}

export default PanelFooter
