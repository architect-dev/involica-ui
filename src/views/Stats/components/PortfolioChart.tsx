import React from 'react'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns'
import { enUS } from 'date-fns/locale'
import { useInvolicaDCAChartData } from 'state/uiHooks'
import {
  Chart as ChartJS,
  CategoryScale,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { ChartDataOption, useChartOptionsState } from './chartOptionsState'

let chartHalfHeight = 0

ChartJS.register(CategoryScale, TimeScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend)
Tooltip.positioners.average = (elements, position) => {
  if (!elements.length) {
    return false
  }

  const height = (position as any).chart?.chartArea?.height
  if (height != null) {
    chartHalfHeight = height / 2
  }
  const minY = elements.reduce((min, { element }) => Math.min(min, element.y), elements[0].element.y)

  return {
    x: elements[0].element.x,
    y: minY,
    yAlign: minY > chartHalfHeight ? 'bottom' : 'top',
  }
}

const PortfolioChart: React.FC = () => {
  const { dataOption, focusedToken, dcasCountChart } = useChartOptionsState()
  const chartData = useInvolicaDCAChartData(
    dataOption === ChartDataOption.User,
    dataOption === ChartDataOption.User ? focusedToken : null,
    false,
  )
  const { timestamps, tradeValData, currentValData, dcasCountData } = chartData ?? {
    timestamps: [],
    tradeValData: [],
    currentValData: [],
    dcasCountData: [],
  }

  return (
    <Line
      options={{
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          yAxis: {
            type: 'linear',
            grace: '70%',
            beginAtZero: true,
            ticks: {
              // Include a dollar sign in the ticks
              callback: (value): string => {
                if (dcasCountChart) return value.toString()
                return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                  parseFloat(`${value}`),
                )
              },
              font: {
                family: 'Courier Prime, monospace',
              },
            },
          },
          xAxis: {
            adapters: {
              date: {
                locale: enUS,
              },
            },
            type: 'time',
            time: {
              unit: 'day',
              round: 'day',
              displayFormats: {
                day: 'MMM d',
              },
              tooltipFormat: 'MMM d, yyyy',
            },
            grid: {
              display: true,
              drawOnChartArea: false,
            },
            ticks: {
              font: {
                family: 'Courier Prime, monospace',
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },
          tooltip: {
            xAlign: 'center',
            caretPadding: 20,
            displayColors: false,
            position: 'average',
            bodyFont: {
              family: 'Courier Prime, monospace',
            },
            titleFont: {
              family: 'Courier Prime, monospace',
            },
            footerFont: {
              family: 'Courier Prime, monospace',
            },
            titleAlign: 'right',
            titleMarginBottom: 6,
            footerAlign: 'right',
            footerMarginTop: 6,
            footerColor: '#F7CAC9',
            callbacks: {
              afterTitle: (context) => {
                if (dcasCountChart || context == null || context.length === 0) return null
                const { chart, dataIndex } = context[0]
                const { datasets } = chart.data
                const dcas =
                  (datasets[2].data[dataIndex] as number) -
                  (dataIndex === 0 ? 0 : (datasets[2].data[dataIndex - 1] as number))
                if (dcas === 0) return null
                return `${dcas} DCAs`
              },
              label: (context) => {
                const datasets = context?.chart?.data?.datasets
                const { dataIndex, datasetIndex, dataset, parsed } = context

                // Remove DCAs count dataset
                if (dcasCountChart) {
                  if (datasetIndex === 2) {
                    return `Total DCAs: ${parsed.y}`
                  }
                  return null
                }
                if (datasetIndex === 2) return null

                const digits0 = `${datasets?.[0]?.data?.[dataIndex]}`.split('.')[0].length
                const digits1 = `${datasets?.[1]?.data?.[dataIndex]}`.split('.')[0].length
                const maxDigits = Math.max(digits0, digits1)
                const digitsOffset = datasetIndex === 0 ? maxDigits - digits0 : maxDigits - digits1
                const titleOffset = 2
                const spaces = ' '.repeat(titleOffset + digitsOffset)

                let label = dataset.label || ''

                if (label) {
                  label += `:${spaces}`
                }
                if (parsed.y !== null) {
                  label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parsed.y)
                }
                return label
              },
              footer: (tooltipItems) => {
                const { dataIndex } = tooltipItems[0]
                const { datasets } = tooltipItems[0].chart.data
                if (dcasCountChart) {
                  const dcas =
                    (datasets[2].data[dataIndex] as number) -
                    (dataIndex === 0 ? 0 : (datasets[2].data[dataIndex - 1] as number))
                  return `${dcas} DCAs`
                }

                const current = datasets[1].data[dataIndex] as number
                const trade = datasets[0].data[dataIndex] as number
                const delta = current - trade
                const perc = trade === 0 ? 0 : ((current - trade) * 100) / trade
                return [
                  `${delta === 0 ? '' : delta >= 0 ? '+' : '-'}$${Math.abs(delta).toFixed(2)}`,
                  `${delta === 0 ? '' : delta >= 0 ? '+' : '-'}${Math.abs(perc).toFixed(2)}%`,
                ]
              },
              labelTextColor: (context) => {
                return context.datasetIndex === 1 ? '#F7CAC9' : '#ffffff'
              },
            },
          },
        },
      }}
      plugins={[
        {
          id: 'hover_vertical_line',
          beforeDraw: (chart) => {
            if (chart.tooltip?.getActiveElements()?.length > 0) {
              const { caretX } = chart.tooltip
              const { yAxis } = chart.scales
              const { ctx } = chart
              ctx.save()
              ctx.beginPath()
              ctx.moveTo(caretX, yAxis.top)
              ctx.lineTo(caretX, yAxis.bottom)
              ctx.lineWidth = 1
              ctx.strokeStyle = ChartJS.defaults.borderColor.toString()
              ctx.stroke()
              ctx.restore()
            }
          },
        },
      ]}
      data={{
        labels: timestamps,
        datasets: [
          {
            label: '@ Trade',
            data: tradeValData,
            fill: false,
            borderColor: dcasCountChart ? 'transparent' : '#575757',
            backgroundColor: dcasCountChart ? 'transparent' : undefined,
            tension: 0.1,
            spanGaps: true,
            borderWidth: 2,
            hidden: dcasCountChart,
          },
          {
            label: 'Current',
            data: currentValData,
            fill: dcasCountChart
              ? undefined
              : {
                  target: '-1',
                  above: '#f7cac96d', // Area will be red above the origin
                  below: 'transparent', // And blue below the origin
                },
            borderColor: dcasCountChart ? 'transparent' : '#F7CAC9',
            backgroundColor: dcasCountChart ? 'transparent' : '#F7CAC9',
            tension: 0.1,
            spanGaps: true,
            borderWidth: 2,
            hidden: dcasCountChart,
          },
          {
            label: 'DCAs',
            data: dcasCountData,
            borderColor: dcasCountChart ? '#575757' : 'transparent',
            backgroundColor: 'transparent',
            spanGaps: true,
            hidden: !dcasCountChart,
          },
        ],
      }}
    />
  )
}

export default PortfolioChart
