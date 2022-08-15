import styled, { css, DefaultTheme } from "styled-components";

export const selectorWrapperMixin = ({
    theme,
    disabled = false,
    isLocked = false,
}: {
    theme: DefaultTheme
    disabled?: boolean
    isLocked?: boolean
}) => {
    return css`
        background-color: ${theme.colors.selectorBackground};
        box-shadow: ${(disabled || isLocked) ? 'none' : `inset 1px 1px 1px ${theme.colors.textShadow}`};
    `
}

export const SelectorWrapperBase = styled.div<{ disabled?: boolean, isLocked?: boolean }>`
    ${selectorWrapperMixin}
`