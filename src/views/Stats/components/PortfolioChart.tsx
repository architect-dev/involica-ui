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
import { getSymbol } from 'config/tokens'

ChartJS.register(CategoryScale, TimeScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend)
Tooltip.positioners.average = (elements) => {
  if (!elements.length) {
    return false
  }

  const minY = Math.min(elements[0].element.y, elements[1].element.y)

  return {
    x: elements[0].element.x,
    y: minY,
  }
}

const PortfolioChart: React.FC = () => {
  const { dataOption, focusedToken } = useChartOptionsState()
  const chartData = useInvolicaDCAChartData(
    dataOption === ChartDataOption.User,
    dataOption === ChartDataOption.User ? focusedToken : null,
    false,
  )
  const { timestamps, tradeValData, currentValData } = chartData ?? {
    timestamps: [],
    tradeValData: [],
    currentValData: [],
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
            grace: '50%',
            beginAtZero: true,
            ticks: {
              // Include a dollar sign in the ticks
              callback: (value): string => {
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
            display: true,
            text: `${dataOption === ChartDataOption.User ? 'Portfolio' : 'Involica'} Performance${dataOption === ChartDataOption.User && focusedToken != null ? ` (${getSymbol(focusedToken)})` : ''}:`,
            align: 'start',
            padding: {
              bottom: 10,
            },
            font: {
              family: 'Courier Prime, monospace',
              weight: 'normal',
              size: 12,
              style: 'italic'
            },
          },
          tooltip: {
            xAlign: 'center',
            yAlign: 'bottom',
            caretPadding: 20,
            displayColors: false,
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
              label: (context) => {
                const datasets = context?.chart?.data?.datasets
                const { dataIndex, datasetIndex, dataset, parsed } = context
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
                const current = tooltipItems[1].raw as number
                const trade = tooltipItems[0].raw as number
                const delta = current - trade
                return `${delta === 0 ? '' : delta > 0 ? '▲' : '▼'} ${new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(delta)}`
              },
              labelTextColor: (context) => {
                return context.datasetIndex < 0.1 ? '#ffffff' : '#F7CAC9'
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
            borderColor: '#575757',
            tension: 0.1,
            spanGaps: true,
            borderWidth: 2,
          },
          {
            label: 'Current',
            data: currentValData,
            fill: {
              target: '-1',
              above: '#f7cac96d', // Area will be red above the origin
              below: 'transparent', // And blue below the origin
            },
            borderColor: '#F7CAC9',
            tension: 0.1,
            spanGaps: true,
            borderWidth: 2,
          },
        ],
      }}
    />
  )
}

export default PortfolioChart
