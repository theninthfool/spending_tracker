import React from 'react'
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";


charts(FusionCharts);

export default function PieChart({ categories, type }) {
    const chartData = categories.map(function(item) {
        return {"label": item.name, "value": item.total}
      });
    const chartConfigs = {
        type: "pie2d",
        width: "100%",
        height: "300",
        dataFormat: "json",
        dataSource: {
            chart: {
            caption: type,
            subCaption: "",
            numberPrefix: "$",
            showvalues: "1",
            showPercentInTooltip: "0",
            decimals: "1",
            useDataPlotColorForLabels: "1",
            theme: "fusion"
            },
            // Chart Data - from step 2
            data: chartData
        }
    };
    return (
        <ReactFC className='chart' {...chartConfigs} />
    )
}
