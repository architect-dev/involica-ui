/* eslint-disable react/default-props-match-prop-types */
import React from 'react'
import styled from 'styled-components'
import { pressableMixin } from 'uikit/util/styledMixins'
import getExternalLinkProps from '../../util/getExternalLinkProps'
import { Text } from '../Text/Text'
import { LinkProps } from './types'

const StyledLink = styled(Text)<LinkProps>`
  display: flex;
  align-items: center;
  width: fit-content;
  gap: 6px;
  color: ${({ theme }) => theme.colors.quartz};

  ${pressableMixin};

  &:hover {
    font-weight: bold;
    text-decoration: underline;
    > * {
      stroke-width: 3;
    }
  }

  &:focus-visible {
    outline: none;
  }
`

const Link: React.FC<LinkProps> = ({ external, ...props }) => {
  const internalProps = external ? getExternalLinkProps() : {}
  return <StyledLink as="a" bold {...internalProps} {...props} />
}

Link.defaultProps = {
  color: 'primary',
}

export default Link
