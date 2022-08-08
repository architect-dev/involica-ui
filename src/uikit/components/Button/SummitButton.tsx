import React, { cloneElement, ElementType, isValidElement, useCallback } from 'react'
import styled from 'styled-components'
import getExternalLinkProps from '../../util/getExternalLinkProps'
import { Lock, Spinner } from '../Svg'
import SummitStyledButton from './SummitStyledButton'
import { ButtonProps, scales, variants } from './types'

const StyledLock = styled(Lock)`
  position: absolute;
  align-self: center;
  transform: rotate(20deg);
  fill: white;
  filter: drop-shadow(1px 1px 4px black);
`
const StyledSpinner = styled(Spinner)`
  position: absolute;
  align-self: center;
  filter: drop-shadow(0px 0px 4px black);
`

const SecondaryInset = styled.div<{ insetColor?: string }>`
  position: absolute;
  top: 2px;
  right: 2px;
  left: 2px;
  bottom: 2px;
  border-radius: 50px;
  background-color: ${({ theme, insetColor }) => theme.colors[insetColor || 'cardHover']};
`

const ChildWrapper = styled.div`
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
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
    secondary = false,
    children,
    summitPalette,
    onClick,
    freezeSummitButton,
    insetColor,
    InsetComponent = null,
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
      $summitPalette={summitPalette}
      $secondary={secondary}
      disabled={isDisabled || isLocked}
      onClick={handleClick}
      $freezeSummitButton={freezeSummitButton}
      {...internalProps}
      {...rest}
    >
      <>
        { secondary && (InsetComponent != null ? InsetComponent : <SecondaryInset className='secondary-inset' insetColor={insetColor}/>) }
        {isValidElement(startIcon) &&
          cloneElement(startIcon, {
            mr: '0.5rem',
          })}
        <ChildWrapper>
          {children}
        </ChildWrapper>
        {isValidElement(endIcon) &&
          cloneElement(endIcon, {
            ml: '0.5rem',
          })}
        {isLocked && <StyledLock width="28px" />}
        {isLoading && <StyledSpinner className="spinner" />}
      </>
    </SummitStyledButton>
  )
}

SummitButton.defaultProps = {
  isLoading: false,
  isLocked: false,
  external: false,
  variant: variants.PRIMARY,
  scale: scales.MD,
  disabled: false,
  elevation: null,
  href: null,
  secondary: false,
}

export default SummitButton
