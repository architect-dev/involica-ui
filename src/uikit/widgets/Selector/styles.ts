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
        transition: box-shadow 100ms ease-in-out, transform 100ms ease-in-out;
        box-shadow: ${(disabled || isLocked) ? 'none' : `inset 0px 0px 0px ${theme.colors.text}`};
        transform: none;
        ${ invalid && css`
            box-shadow: ${(disabled || isLocked) ? 'none' : `inset 2px 2px 0px ${theme.colors.failure}`};
            transform: translate(1px, 1px);
        `}
        :hover, :focus-within {
            box-shadow: ${(disabled || isLocked) ? 'none' : `inset 2px 2px 0px ${invalid ? theme.colors.failure : theme.colors.text}`};
            transform: translate(1px, 1px);
        }
    `
}

export const SelectorWrapperBase = styled.div<{ disabled?: boolean, isLocked?: boolean, invalid?: boolean }>`
    ${selectorWrapperMixin}
`