import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js/lib/core';

import * as locale from 'plotly.js/lib/locales/de';

import BarChart from 'plotly.js/lib/bar';
import HeatmapChart from 'plotly.js/lib/heatmap';
import HistogramChart from 'plotly.js/lib/histogram';
import ScatterChart from 'plotly.js/lib/scatter';
import PointCloud from 'plotly.js/lib/pointcloud';
import WaterfallChart from 'plotly.js/lib/waterfall';

Plotly.register([locale]);

Plotly.setPlotConfig({ locale: 'de' });

Plotly.register([
  BarChart,
  HeatmapChart,
  HistogramChart,
  ScatterChart,
  PointCloud,
  WaterfallChart
]);

export default createPlotlyComponent(Plotly);
