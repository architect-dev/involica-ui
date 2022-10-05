import type { TooltipPositionerFunction } from 'chart.js';

declare module 'chart.js' {
  // Extend tooltip positioner map
  interface TooltipPositionerMap {
    dcasCountChart: TooltipPositionerFunction<ChartType>;
    performanceChart: TooltipPositionerFunction<ChartType>;
  }
}