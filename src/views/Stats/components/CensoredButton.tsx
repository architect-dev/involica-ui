import React from 'react'
import { Camera, CameraOff } from 'react-feather';
import { SummitButton } from 'uikit';

export const CensoredButton: React.FC<{ censored: boolean; toggleCensored: () => void }> = ({
  censored,
  toggleCensored,
}) => {
  return (
    <SummitButton padding='0 12px' onClick={toggleCensored}>
      {censored ? <CameraOff size='18px'/> : <Camera size='18px'/>}
    </SummitButton>
  )
}
