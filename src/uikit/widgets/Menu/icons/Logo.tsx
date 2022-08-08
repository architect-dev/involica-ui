import React from 'react'
import { SummitPalette } from 'config/constants/types'
import Svg from '../../../components/Svg/Svg'
import { SvgProps } from '../../../components/Svg/types'

interface LogoProps extends SvgProps {
  isDark: boolean
  summitPalette: SummitPalette | null
}

const Logo: React.FC<LogoProps> = ({ isDark, summitPalette, ...props }) => {
  return (
    <Svg viewBox="0 0 697 134" {...props}>
      <image height="134" href={`/images/summit/logo${summitPalette || 'BASE'}.png`} />
      <image height="73" x="235" y="30.5" href={`/images/summit/logoTypography${isDark ? 'Dark' : 'Light'}.png`} />
    </Svg>
  )
}

export default React.memo(Logo, (prev, next) => prev.isDark === next.isDark && prev.summitPalette === next.summitPalette)
