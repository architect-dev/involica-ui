import React from 'react'
import { keyframes } from 'styled-components'
import Svg from '../Svg'
import { SvgProps } from '../types'

export const SpinnerKeyframes = keyframes`
  0%: {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

export const Spinner: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 33 33" {...props}>
      <path d="M16.5 0.116211C13.5649 0.116211 10.6863 0.923596 8.17924 2.45001C5.67223 3.97643 3.63339 6.16305 2.28586 8.77058C0.93833 11.3781 0.334032 14.3061 0.539097 17.2341C0.744162 20.162 1.75069 22.9772 3.44853 25.3714L5.85949 23.6617C4.47529 21.7098 3.6547 19.4147 3.48751 17.0276C3.32033 14.6405 3.813 12.2534 4.9116 10.1275C6.01021 8.00167 7.67241 6.21898 9.71632 4.97453C11.7602 3.73009 14.1071 3.07185 16.5 3.07185L16.5 0.116211Z" />
    </Svg>
  )
}
