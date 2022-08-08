import React from 'react'
import { SvgProps } from '../../../components/Svg'
import Flex from '../../../components/Box/Flex'
import Link from '../../../components/Link/Link'
import * as IconModule from '../icons'
import { socials } from '../config'
import { pressableMixin } from 'uikit/util/styledMixins'
import styled from 'styled-components'
import { Text } from '../../../components/Text'

const Icons = (IconModule as unknown) as { [key: string]: React.FC<SvgProps> }

const StyledLink = styled(Link)`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  display: flex;
  gap: 6px;
  &:hover {
    text-decoration: none;
  }
  ${pressableMixin}
`

const StyledText = styled(Text)`
  color: ${({ theme }) => theme.colors.textSubtle};
`

const SocialLinks: React.FC = () => (
  <Flex flexWrap='wrap' gap='24px' alignItems='center' justifyContent='center' margin='32px auto 24px auto'>
    {socials.map((social) => {
      const Icon = Icons[social.icon]
      const iconProps = { width: '28px', height: '28px', color: 'textSubtle', style: { cursor: 'pointer' } }
      return (
        <StyledLink external key={social.label} href={social.href} aria-label={social.label}>
          <StyledText bold monospace>{social.label}</StyledText>
          <Icon {...iconProps} />
        </StyledLink>
      )
    })}
  </Flex>
)

export default React.memo(SocialLinks, () => true)
