import React from 'react'
import Svg from '../../../components/Svg/Svg'
import { SvgProps } from '../../../components/Svg/types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 1000 1000" {...props}>
      <path d="M336.5,240.2v641.5c0,9.1-2.3,16.9-6.8,23.2s-11.2,9.6-20,9.6c-6.2,0-12.2-1.5-18-4.4L37.3,782.7c-7.7-3.6-14.1-9.8-19.4-18.3S10,747.4,10,739V115.5c0-7.3,1.8-13.5,5.5-18.6c3.6-5.1,8.9-7.7,15.9-7.7c5.1,0,13.1,2.7,24.1,8.2l279.5,140C335.9,238.6,336.5,239.5,336.5,240.2L336.5,240.2z M371.5,295.5l292,473.6l-292-145.5V295.5z M990,305.3v576.4c0,9.1-2.6,16.5-7.7,22.1c-5.1,5.7-12,8.5-20.8,8.5s-17.3-2.4-25.7-7.1L694.7,784.9L990,305.3z M988.4,239.7c0,1.1-46.8,77.6-140.3,229.4C754.6,621,699.8,709.8,683.8,735.7L470.5,389l177.2-288.2c6.2-10.2,15.7-15.3,28.4-15.3c5.1,0,9.8,1.1,14.2,3.3l295.9,147.7C987.6,237.1,988.4,238.2,988.4,239.7L988.4,239.7z" />
    </Svg>
  )
}

export default Icon
