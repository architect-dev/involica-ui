import React from 'react'
import Svg from '../../../components/Svg/Svg'
import { SvgProps } from '../../../components/Svg/types'

interface LogoProps extends SvgProps {
  isDark: boolean
}

const Logo: React.FC<LogoProps> = ({ isDark, ...props }) => {
  return (
    <Svg viewBox="0 0 697 134" {...props}>
      <image height="134" href='/images/summit/logoBASE.png' />
      <image height="73" x="235" y="30.5" href={`/images/summit/logoTypography${isDark ? 'Dark' : 'Light'}.png`} />
    </Svg>
  )
}

export default React.memo(Logo, (prev, next) => prev.isDark === next.isDark)
