import React from 'react'
import FusionCharts from 'fusioncharts';
import Widgets from 'fusioncharts/fusioncharts.widgets';
import ReactFC from 'react-fusioncharts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

ReactFC.fcRoot(FusionCharts, Widgets, FusionTheme);

export default function PieChart({ budget, expenses }) {
    let border = (expenses/budget).toFixed(2)*100;
    const dataSource = {
        chart: {
            caption: "Money Tug O War",
            numbersuffix: "%",
            gaugefillmix: "{dark-20},{light+70},{dark-10}",
            theme: "candy",
        },
        colorrange: {
            
          color: [
            {
            // baseFontSize: "30",
              minvalue: "0",
              maxvalue: `${border}`,
              label: `${expenses}`,
              code: "#F2726F"
            },
            {
              minvalue: `${border}`,
              maxvalue: "100",
              label: `${budget - expenses}`,
              code: "#62B58F"
            }
          ]
        },
        pointers: {
          pointer: [
            {
              value: `${border}`
            }
          ]
        }
      };
    
    const chartConfigs = {
      type: 'hlineargauge',
      width: '100%',
      height: 120,
      dataFormat: 'json',
      dataSource: dataSource
    };
    return <ReactFC {...chartConfigs} />;
}
