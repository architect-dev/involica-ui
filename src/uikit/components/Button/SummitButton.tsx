import React, { cloneElement, ElementType, isValidElement, useCallback } from 'react'
import styled from 'styled-components'
import getExternalLinkProps from '../../util/getExternalLinkProps'
import { Dots } from '../Dots'
import { Lock } from '../Svg'
import SummitStyledButton from './SummitStyledButton'
import { ButtonProps, scales, variants } from './types'

const StyledLock = styled(Lock)`
  position: absolute;
  align-self: center;
  transform: rotate(20deg);
  fill: white;
  filter: drop-shadow(1px 1px 4px black);
`

const SummitButton = <E extends ElementType = 'button'>(props: ButtonProps<E>): JSX.Element => {
  const {
    startIcon,
    endIcon,
    external,
    className,
    isLoading,
    isLocked,
    disabled,
    children,
    onClick,
    activeText,
    loadingText,
    changed,
    variant,
    ...rest
  } = props
  const internalProps = external ? getExternalLinkProps() : {}
  const isDisabled = isLoading || disabled
  const classNames = className ? [className] : []

  if (isLoading) {
    classNames.push('summit-button--loading')
  }

  if (isDisabled && !isLoading) {
    classNames.push('summit-button--disabled')
  }

  const handleClick = useCallback(() => {
    if (isLoading || isLocked || isDisabled || onClick == null) return
    onClick()
  }, [isLoading, isLocked, isDisabled, onClick])

  return (
    <SummitStyledButton
      $isLoading={isLoading}
      $isLocked={isLocked}
      className={classNames.join(' ')}
      disabled={isDisabled || isLocked}
      variant={variant}
      onClick={handleClick}
      changed={changed}
      {...internalProps}
      {...rest}
    >
      <Children>
        {isValidElement(startIcon) && cloneElement(startIcon)}
        {children != null && children}
        {activeText != null && !isLoading && activeText}
        {loadingText != null && isLoading && loadingText}
        {isLoading && <Dots />}
        {isValidElement(endIcon) && cloneElement(endIcon)}
        {isLocked && <StyledLock width="28px" />}
      </Children>
    </SummitStyledButton>
  )
}

const Children = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  filter: brightness(1);
`

SummitButton.defaultProps = {
  isLoading: false,
  isLocked: false,
  external: false,
  scale: scales.MD,
  variant: variants.PRIMARY,
  disabled: false,
  elevation: null,
  href: null,
}

export default SummitButton
