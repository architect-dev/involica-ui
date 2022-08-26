import styled, { css, DefaultTheme } from "styled-components";

export const selectorWrapperMixin = ({
    theme,
    disabled = false,
    isLocked = false,
    invalid = false,
}: {
    theme: DefaultTheme
    disabled?: boolean
    isLocked?: boolean
    invalid?: boolean
}) => {
    return css`
        background-color: ${theme.colors.selectorBackground};
        box-shadow: ${(disabled || isLocked) ? 'none' : `inset 1px 1px 1px ${invalid ? theme.colors.failure : theme.colors.textShadow}`};
    `
}

export const SelectorWrapperBase = styled.div<{ disabled?: boolean, isLocked?: boolean, invalid?: boolean }>`
    ${selectorWrapperMixin}
`