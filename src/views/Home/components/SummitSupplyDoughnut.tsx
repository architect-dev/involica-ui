import React from 'react'
import styled from 'styled-components'
import { Doughnut } from 'react-chartjs-2'
import { ChartOptions } from 'chart.js'

const StyledDoughnut = styled(Doughnut)`
  overflow: visible;
`

interface Props {
  circSupply: number
  lockedSupply: number
  burnedSupply: number
}

const SummitSupplyDoughnut: React.FC<Props> = ({ circSupply, lockedSupply, burnedSupply }) => {
  const totalSupply = circSupply + lockedSupply + burnedSupply
  const summitBalancesChartData = {
    labels: [
      `Circulating (${(circSupply * 100 / totalSupply).toFixed(1)}%)`,
      `In EVEREST (${(lockedSupply * 100 / (circSupply + lockedSupply)).toFixed(1)}%)`,
      `Burned (${(burnedSupply * 100 / totalSupply).toFixed(1)}%)`
    ],
    datasets: [
      {
        data: [circSupply, lockedSupply, burnedSupply],
        backgroundColor: ['#154463', '#90B7B4', '#3E80A2'],
        hoverBackgroundColor: ['#255a7e', '#AECEBF', '#609CB6'],
        hoverOffset: [5, 7, 5],
        borderColor: ['transparent', 'transparent', 'transparent'],
        borderWidth: 2,
        rotation: 90,
        // offset: [20, 10],
      },
    ],
  }

  const summitBalancesChartOptions: ChartOptions = {
    responsive: false,
    layout: {
      padding: { top: 20 },
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 12,
            family: 'Courier Prime, monospace',
          },
        },
      },
    },
  }

  return <StyledDoughnut width={200} height={250} options={summitBalancesChartOptions} data={summitBalancesChartData} />
}

export default React.memo(SummitSupplyDoughnut)
