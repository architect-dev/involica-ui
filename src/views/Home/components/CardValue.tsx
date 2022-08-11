import React, { useEffect, useRef } from 'react'
import { useCountUp } from 'react-countup'
import { textGold } from 'theme/colors'
import { HighlightedText } from 'uikit'

interface CardValueProps {
  value: number
  decimals?: number
  fontSize?: string
  prefix?: string
  postfix?: string
  postfixFontSize?: string
  gold?: boolean
  isMultiplier?: boolean
  color?: string
}

const CardValue: React.FC<CardValueProps> = ({
  value,
  decimals,
  fontSize = '40',
  prefix,
  postfix,
  isMultiplier,
  postfixFontSize,
  gold = false,
  color,
}) => {
  const { countUp, update } = useCountUp({
    start: 0,
    end: value,
    duration: 1,
    separator: ',',
    decimals:
      // eslint-disable-next-line no-nested-ternary
      decimals !== undefined ? decimals : value < 0 ? 4 : value > 1e5 ? 0 : 3,
  })

  const updateValue = useRef(update)

  useEffect(() => {
    updateValue.current(value)
  }, [value, updateValue])

  return (
    <HighlightedText color={gold ? textGold : color} bold monospace fontSize={fontSize} header>
      {prefix}
      {countUp}
      {isMultiplier && 'X'}
      {postfix != null && (
        <HighlightedText color={gold ? textGold : color} bold fontSize={postfixFontSize || fontSize} header ml="6px" mt='2px'>
          {postfix}
        </HighlightedText>
      )}
    </HighlightedText>
  )
}

export default CardValue
