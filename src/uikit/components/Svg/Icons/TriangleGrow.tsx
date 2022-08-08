import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

export interface MarkProp {
  displayPerc: number
  positionPerc: number
}

interface Props {
  marks: MarkProp[]
  currPositionPerc: number
  currDisplayPerc: number
}


const width = 250
const height = 16
const halfHeight = height / 2

const Icon: React.FC<SvgProps & Props> = ({ marks, currPositionPerc, currDisplayPerc, ...props }) => {
  const markPercs = marks.map((mark) => mark.displayPerc)
  const max = Math.max(...markPercs)

  const barCoords: string[] = new Array(marks.length * 2)
  const progressCoordsTop: string[] = []
  const progressCoordsBottom: string[] = []

  marks.forEach((mark, index) => {
    const topCoord = [
      (mark.positionPerc / 100) * width,
      halfHeight + Math.max(2, (mark.displayPerc / max) * halfHeight)
    ].join(',')
    const bottomCoord = [
      (mark.positionPerc / 100) * width,
      halfHeight - Math.max(2, (mark.displayPerc / max) * halfHeight)
    ].join(',')
    barCoords[index] = topCoord
    barCoords[(marks.length * 2) - 1 - index] = bottomCoord

    if (currPositionPerc > mark.positionPerc) {
      progressCoordsTop.push(topCoord)
      progressCoordsBottom.push(bottomCoord)
    }
  })

  progressCoordsTop.push([
    (currPositionPerc / 100) * width,
    halfHeight + Math.max(2, (currDisplayPerc / max) * halfHeight)
  ].join(','))
  progressCoordsBottom.push([
    (currPositionPerc / 100) * width,
    halfHeight - Math.max(2, (currDisplayPerc / max) * halfHeight)
  ].join(','))

  const barPoints = barCoords.join(' ')
  const progressPoints = [progressCoordsTop.join(' '), progressCoordsBottom.reverse().join(' ')].join(' ')

  return (
    <Svg viewBox={`0 0 ${width} ${height}`} {...props} preserveAspectRatio='none' overflow='visible'>
      <polygon points={barPoints} fillOpacity={0.3}/>
      <polygon className='progress-fill' points={progressPoints} fillOpacity={1}/>
    </Svg>
  )
}

export default React.memo(Icon)
