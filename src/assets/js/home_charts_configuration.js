/*
* FUNCTIONS TO HANDLE DISPLAY OF CHARTS
*/
//get parameters for chart based on user's view
const getChartParams = (target) => {
  const container = document.getElementById(`chartOptions_${target}`);
  let chart_type = container.querySelectorAll('.chartTypeSelectBox')[0].value;
  const chart_option = container.querySelectorAll('.chartOptionSelectBox')[0].value;
  const weekOptions = getWeekSelectBoxOptions();
  const budgetNumber = weekOptions['budgetNumber'];
  const params = {
    "target":target,
    "budgetNumber":budgetNumber,
    "chart_type":chart_type,
    "chart_option":chart_option,
  }
  return params;
};
//get options to create chart
const getChartConfiguration = (params) => {
  const budgetStatistics = self.statistics[`budget${params.budgetNumber}`];
  const datasets = getDataForChart(budgetStatistics, params.target, params.chart_type, params.chart_option);
  const labels = getChartLabels(budgetStatistics, params.target);
  const title = getChartTitle(params.target, params.chart_type, params.chart_option);
  const legends = getChartLegend(params.chart_type, params.chart_option);
  let charts = [params.chart_type];
  const display_labels = getLabelsForChartDisplay(labels);
  if (params.chart_type==="comparison") {
    charts = getChartTypes(params.chart_option);
    const basicStyles = getBasicChartStyles(charts[0], "amount_total", datasets[0].length);
    const compareStyles = getBasicChartStyles(charts[1], "amount_total", datasets[1].length);
    const options = {
      "target": params.target,
      "type": charts[0],
      "basic_type": charts[0],
      "compare_type": charts[1],
      "title": title,
      "labels": display_labels,
      "basic_legend": "goal amounts",
      "compare_legend": "amount spent",
      "basic_data": datasets[0],
      "compare_data": datasets[1],
      "basic_fills": basicStyles['backgroundColors'],
      "compare_fills":compareStyles['backgroundColors'],
      "basic_borders": basicStyles['borderColors'],
      "compare_borders":compareStyles['borderColors'],
      "borderwidth": 2,
      "cutout_percentage": basicStyles['cutoutPercentage']
    }
    const chartOptions = updateComparisonChartOptions(options);
    const chartConfig = {
      "chartOptions":chartOptions,
      "chartCreator":getChartCreator(charts)
    };
    return chartConfig;
  }else{
    let color_param = params.chart_option;
    if (params.chart_option==="amount_avg_categories" || params.chart_option==="amount_avg_payments" || params.chart_option==="amount_avg_goals") {
      color_param="amount_avg_per";
    }else if(params.chart_option==="expnumb_avg_categories" || params.chart_option==="expnumb_avg_payments" || params.chart_option==="expnumb_avg_goals"){
      color_param="expnumb_avg_per";
    }
    const chartStyles = getBasicChartStyles(params.chart_type, color_param, datasets[0].length);
    const chartOptions = {
      "target": params.target,
      "type": charts[0],
      "title": title,
      "legend": legends[0],
      "labels": display_labels,
      "data": datasets[0],
      "fills": chartStyles['backgroundColors'],
      "borders": chartStyles['borderColors'],
      "borderwidth": chartStyles['borderWidth'],
      "cutout_percentage": chartStyles['cutoutPercentage']
    }
    if (params.target==="goals" || params.target==="categories") {
      if (charts[0]==="bar" || charts[0]==="pie" || charts[0]==="doughnut") {
        const categoryColors = getChartCategoryColors(labels);
        chartOptions.fills=categoryColors;
      }
    }
    if (charts[0]==="filled_line") {
      chartOptions.type="line";
    }
    const chartConfig = {
      "chartOptions":chartOptions,
      "chartCreator":getChartCreator(charts)
    };
    return chartConfig;
  }
};
//get function to create chart
const getChartCreator = (charts) => {
  let functionName = createLinearChart;
  if (charts.length===1 && (charts[0]==="doughnut" || charts[0]==="pie")) {
    functionName = createRoundChart;
  }else if(charts.length>1){
    if (charts[0]==="radar") {
      functionName = createRadarChart;
    }else{
      functionName = createMixedChart;
    }
  }
  return functionName;
};
//get chart types for comparison chart
const getChartTypes = (option) =>{
  option = option.split(" ")[0];
  let charts=["bar", "bar"];
  if (option==="bar_line") {
    charts=["bar", "line"];
  }else if (option==="lines") {
    charts=["line", "line"];
  }else if (option==="radar") {
    charts=["radar", "radar"];
  }
  return charts;
};
//get basic chart styles
const getBasicChartStyles = (chart, color_param, iterationNumber) => {
  let colors = [];
  colors["amount_total"]='#009933';
  colors["amount_total_0"]='rgba(0, 153, 51, 0.2)';
  colors["amount_total_1"]='rgba(0, 153, 51, 0.4)';
  colors["amount_total_2"]='rgba(0, 153, 51, 0.6)';
  colors["amount_total_3"]='rgba(0, 153, 51, 0.8)';
  colors["amount_total_4"]='rgba(0, 102, 0, 0.8)';
  colors["amount_total_5"]='rgba(0, 102, 0, 0.6)';
  colors["amount_total_6"]='rgba(0, 102, 0, 0.4)';
  colors["amount_total_7"]='rgba(0, 102, 0, 0.2)';
  colors["amount_total_8"]='rgba(0, 153, 51, 1)';
  colors["amount_total_9"]='rgba(0, 102, 0, 1)';
  colors["amount_total_full"]='rgba(0, 153, 51, 1)';
  colors["expnumb"]='#ff6600';
  colors["expnumb_0"]='rgba(255, 102, 0, 0.2)';
  colors["expnumb_1"]='rgba(255, 102, 0, 0.4)';
  colors["expnumb_2"]='rgba(255, 102, 0, 0.6)';
  colors["expnumb_3"]='rgba(255, 102, 0, 0.8)';
  colors["expnumb_4"]='rgba(230, 184, 0, 0.8)';
  colors["expnumb_5"]='rgba(230, 138, 0, 0.6)';
  colors["expnumb_6"]='rgba(230, 138, 0, 0.4)';
  colors["expnumb_7"]='rgba(230, 138, 0, 0.8)';
  colors["expnumb_8"]='rgba(255, 102, 0, 1)';
  colors["expnumb_9"]='rgba(230, 138, 0, 1)';
  colors["expnumb_full"]='rgba(255, 102, 0, 1)';
  colors["amount_avg_daily"]='#008b8b';
  colors["amount_avg_daily_0"]='rgba(0, 139, 139, 0.2)';
  colors["amount_avg_daily_1"]='rgba(0, 139, 139, 0.4)';
  colors["amount_avg_daily_2"]='rgba(0, 139, 139, 0.6)';
  colors["amount_avg_daily_3"]='rgba(0, 139, 139, 0.8)';
  colors["amount_avg_daily_4"]='rgba(0, 102, 102, 0.8)';
  colors["amount_avg_daily_5"]='rgba(0, 102, 102, 0.6)';
  colors["amount_avg_daily_6"]='rgba(0, 102, 102, 0.4)';
  colors["amount_avg_daily_7"]='rgba(0, 102, 102, 0.2)';
  colors["amount_avg_daily_8"]='rgba(0, 139, 139, 1)';
  colors["amount_avg_daily_9"]='rgba(0, 102, 102, 1)';
  colors["amount_avg_daily_full"]='rgba(0, 139, 139, 1)';
  colors["amount_max"]='#dc143c';
  colors["amount_max_0"]='rgba(220, 20, 60, 0.2)';
  colors["amount_max_1"]='rgba(220, 20, 60, 0.4)';
  colors["amount_max_2"]='rgba(220, 20, 60, 0.6)';
  colors["amount_max_3"]='rgba(220, 20, 60, 0.8)';
  colors["amount_max_4"]='rgba(255, 0, 0, 0.8)';
  colors["amount_max_5"]='rgba(255, 0, 0, 0.6)';
  colors["amount_max_6"]='rgba(255, 0, 0, 0.4)';
  colors["amount_max_7"]='rgba(255, 0, 0, 0.2)';
  colors["amount_max_8"]='rgba(220, 20, 60, 1)';
  colors["amount_max_9"]='rgba(255, 0, 0, 1)';
  colors["amount_max_full"]='rgba(220, 20, 60, 1)';
  colors["amount_min"]='#1e90ff';
  colors["amount_min_0"]='rgba(30, 144, 255, 0.2)';
  colors["amount_min_1"]='rgba(30, 144, 255, 0.4)';
  colors["amount_min_2"]='rgba(30, 144, 255, 0.6)';
  colors["amount_min_3"]='rgba(30, 144, 255, 0.8)';
  colors["amount_min_4"]='rgba(0, 45, 179, 0.8)';
  colors["amount_min_5"]='rgba(0, 45, 179, 0.6)';
  colors["amount_min_6"]='rgba(0, 45, 179, 0.4)';
  colors["amount_min_7"]='rgba(20, 45, 179, 0.2)';
  colors["amount_min_8"]='rgba(30, 144, 255, 1)';
  colors["amount_min_9"]='rgba(20, 45, 179, 1)';
  colors["amount_min_full"]='rgba(30, 144, 255, 1)';
  colors["expnumb_avg_per"]='#e600e6';
  colors["expnumb_avg_per_0"]='rgba(230, 0, 230, 0.2)';
  colors["expnumb_avg_per_1"]='rgba(230, 0, 230, 0.4)';
  colors["expnumb_avg_per_2"]='rgba(230, 0, 230, 0.6)';
  colors["expnumb_avg_per_3"]='rgba(230, 0, 230, 0.8)';
  colors["expnumb_avg_per_4"]='rgba(115, 0, 153, 0.8)';
  colors["expnumb_avg_per_5"]='rgba(115, 0, 153, 0.6)';
  colors["expnumb_avg_per_6"]='rgba(115, 0, 153, 0.4)';
  colors["expnumb_avg_per_7"]='rgba(115, 0, 153, 0.2)';
  colors["expnumb_avg_per_8"]='rgba(230, 0, 230, 1)';
  colors["expnumb_avg_per_9"]='rgba(115, 0, 153, 1)';
  colors["expnumb_avg_per_full"]='rgba(230, 0, 230, 1)';
  colors["amount_avg_per"]='#336699';
  colors["amount_avg_per_0"]='rgba(51, 102, 153, 0.2)';
  colors["amount_avg_per_1"]='rgba(51, 102, 153, 0.4)';
  colors["amount_avg_per_2"]='rgba(51, 102, 153, 0.6)';
  colors["amount_avg_per_3"]='rgba(51, 102, 153, 0.8)';
  colors["amount_avg_per_4"]='rgba(38, 38, 38, 0.8)';
  colors["amount_avg_per_5"]='rgba(38, 38, 38, 0.6)';
  colors["amount_avg_per_6"]='rgba(38, 38, 38, 0.4)';
  colors["amount_avg_per_7"]='rgba(38, 38, 38, 0.2)';
  colors["amount_avg_per_8"]='rgba(51, 102, 153, 1)';
  colors["amount_avg_per_9"]='rgba(38, 38, 38, 1)';
  colors["amount_avg_per_full"]='rgba(51, 102, 153, 1)';
  colors["white_full"]='rgba(255, 255, 255, 1)';
  colors["transparent"]='rgba(255, 255, 255, 0.0)';
  let results = [];
  let backgroundColors = [];
  let borderColors = [];
  let borderWidth = [];
  let cutoutPercentage = 0;
  for (let i = 0; i < iterationNumber; i++) {
    if (chart==="line") {
      backgroundColors = colors["transparent"];
      borderColors[borderColors.length] = colors[`${color_param}_full`];
      borderWidth[borderWidth.length] = 2;
    }else{
      if(chart==="bar"){
        backgroundColors[backgroundColors.length] = colors[`${color_param}_2`];
        borderColors[borderColors.length] = colors["transparent"];
        borderWidth[borderWidth.length] = 0;
      }else if (chart==="filled_line") {
        backgroundColors[backgroundColors.length] = colors[`${color_param}_0`];
        borderColors[borderColors.length] = colors[`${color_param}_full`];
        borderWidth[borderWidth.length] = 1;
      }else if (chart==="doughnut" || chart==="pie") {
        let number_selector = 0;
        number_selector = (i%iterationNumber);
        backgroundColors[backgroundColors.length] = colors[`${color_param}_${number_selector}`];
        borderColors[borderColors.length] = colors["white_full"];
        if (chart==="doughnut") {
          cutoutPercentage=50;
          borderWidth[borderWidth.length] = 4;
        }else{
          borderWidth[borderWidth.length] = 2;
        }
      }
    }
  }
  results['backgroundColors']=backgroundColors;
  results['borderColors']=borderColors;
  results['borderWidth']=borderWidth;
  results['cutoutPercentage']=cutoutPercentage;
  return results;
};
//capitalize labels for proper display
const getLabelsForChartDisplay =(labels)=>{
  let capitalized = [];
  for (let i = 0; i < labels.length; i++) {
    capitalized[capitalized.length]=capitalizeFirstLetter(labels[i]);
  }
  return capitalized;
};
//get legend for chart
const getChartLegend = (chart_type, chart_option) => {
  let legend="";
  const legends = {
    "expnumb":'# of expenses',
    "amount_total":'total amount',
    "amount_avg_daily":'avg daily amount',
    "amount_max":'max amount',
    "amount_min":'min amount',
    "amount_avg_categories":'avg amount per category',
    "expnumb_avg_categories":'avg # of exp per category',
    "amount_avg_payments":'avg amount per payment',
    "expnumb_avg_payments":'avg # of exp per payment',
    "amount_avg_goals":'avg amount of exp per goal',
    "expnumb_avg_goals":'avg # of exp per goal',
    "legend_goals":'goals max amount',
    "legend_amount":'amount spent'
  }
  if (chart_type==="comparison") {
    return legend=[legends["legend_goals"],legends["legend_amount"]];
  }else{
    return legend=[legends[`${chart_option}`]];
  }
};
//get data for charts
const getDataForChart = (budgetStatistics, target, chart_type, chart_option) => {
  let data = [];
  if (chart_type==="comparison") {
    const spend_on_goal = budgetStatistics.goals_stats.amount_total;
    const goals_amounts = budgetStatistics.goals_stats.goals_amounts;
    return data = [goals_amounts, spend_on_goal];
  }else{
    return data = [budgetStatistics[`${target}_stats`][`${chart_option}`]];
  }
};
//get labels for chart
const getChartLabels = (budgetStatistics, target)=>{
  let labels = [];
  if(target==="categories" || target==="payments"){
    labels = budgetStatistics[`${target}_stats`][`${target}`];
  } else if (target==="goals") {
    labels = budgetStatistics[`${target}_stats`].categories;
  }else{
    let budget_days = budgetStatistics.overall_stats.budget_days;
    for (var i = 0; i < budget_days.length; i++) {
      let dayNumber = budget_days[i].split("-").pop();
      let daymonth = budget_days[i].split("-")[1];
      labels[labels.length] = dayNumber+" / "+daymonth;
    }
  }
  return labels;
};
//get title for chart
const getChartTitle = (target, chart_type, chart_option) => {
  let title="";
  const titles = {
    "expnumb":'number of expenses per',
    "amount_total":'total amount of expenses per',
    "amount_avg_daily":'average daily amount of expenses per',
    "amount_max":'max amount of expenses per',
    "amount_min":'min amount of expenses per',
  }
  if (chart_type==="comparison") {
    title = 'total amount of expenses per goal';
  }else{
    if (target==="daily") {
      if (chart_option==="amount_avg_daily") {
        title = 'average amount of expenses per day';
      }else{
        title=titles[chart_option]+" "+"day";
      }
    }else if (target==="categories") {
      if (chart_option==="amount_avg_categories") {
        title="average amount of expenses per category";
      }else if (chart_option==="expnumb_avg_categories") {
        title="average number of expenses per category";
      }else {
        title=titles[chart_option]+" "+"category";
      }
    }else if (target==="payments") {
      if (chart_option==="amount_avg_payments") {
        title="average amount of expenses per payment method";
      }else if (chart_option==="expnumb_avg_payments") {
        title="average number of expenses per payment method";
      }else {
        title=titles[chart_option]+" "+"payment method";
      }
    }else if (target==="goals") {
      if (chart_option==="amount_avg_goals") {
        title="average amount of expenses per goal";
      }else if (chart_option==="expnumb_avg_goals") {
        title="average number of expenses per goal";
      }else {
        title=titles[chart_option]+" "+"goal";
      }
    }
  }
  return capitalizeFirstLetter(title);
};
//get comparison charts
const getComparisonCharts = (option) => {
  option = option.split(" ")[0];
  let charts=["bar", "bar"];
  if (option==="bar-line") {
    charts=["bar", "line"];
  }else if (option==="lines") {
    charts=["line", "line"];
  }else if (option==="radar") {
    charts=["radar", "radar"];
  }
  return charts;
};
//get category colors for chart
const getChartCategoryColors = (categories) =>{
  let colors = [];
  colors["bar"]='rgba(255, 102, 0, 1)';
  colors["bills"]='rgba(179, 0, 0, 1)';
  colors["clothing"]='rgba(71, 107, 107, 1)';
  colors["communication"]='rgba(30, 144, 255, 1)';
  colors["cosmetics"]='rgba(255, 102, 153, 1)';
  colors["donations"]='rgba(153, 0, 204, 1)';
  colors["education"]='rgba(0, 102, 153, 1)';
  colors["entertainment"]='rgba(255, 165, 0, 1)';
  colors["gifts"]='rgba(255, 136, 77, 1)';
  colors["health"]='rgba(0, 128, 43, 1)';
  colors["housing"]='rgba(179, 89, 0, 1)';
  colors["investments"]='rgba(0, 128, 96, 1)';
  colors["restaurant"]='rgba(204, 0, 0, 1)';
  colors["sports"]='rgba(255, 26, 117, 1)';
  colors["supermarket"]='rgba(255, 64, 0, 1)';
  colors["technology"]='rgba(31, 64, 96, 1)';
  colors["transportation"]='rgba(179, 134, 0, 1)';
  colors["traveling"]='rgba(0, 153, 77, 1)';
  colors["vehicle"]='rgba(38, 38, 38, 1)';
  colors["miscellaneous"]='rgba(115, 77, 38, 1)';
  colors["etiq_0"]='rgba(46, 184, 46, 1)';
  colors["etiq_1"]='rgba(0, 255, 0, 1)';
  let results = [];
  for (let i = 0; i < categories.length; i++) {
    let colorname = categories[i].split(" ")[0];
    let color = colors[`${colorname}`];
    if (color === undefined || color === null) {
      let numberselector = (i%2);
      color = colors[`etiq_${numberselector}`];
    }
    results[results.length] = color;
  }
  return results;
};
//update comparison charts options
const updateComparisonChartOptions =(options) => {
  let colors = [];
  colors["transparent"]='rgba(255, 255, 255, 0.0)';
  colors["green"]='rgba(0, 153, 51, 1)';
  colors["green7"]='rgba(0, 153, 51, 0.7)';
  colors["black7"]='rgba(26, 26, 26, 0.7)';
  colors["black"]='rgba(26, 26, 26, 1)';
  colors["green5"]='rgba(0, 153, 51, 0.5)';
  colors["black6"]='rgba(26, 26, 26, 0.6)';
  let results = [];
  let goals_fills = [];
  let spent_fills = [];
  let goals_borders = [];
  let spent_borders = [];
  let compare_legend = options.compare_legend;
  let legend_goals = options.basic_legend;
  let spent_amounts = options.basic_data;
  let compare_data = options.compare_data;
  if (options.basic_type==="bar" && options.compare_type==="bar") {
    options.borderwidth=0;
    for (let i = 0; i < options.basic_data.length; i++) {
      goals_fills[goals_fills.length] = colors["green7"];
      goals_borders[goals_borders.length] = colors["transparent"];
      spent_fills[spent_fills.length] = colors["black7"];
      spent_borders[spent_borders.length] = colors["transparent"];
    }
    options.basic_fills=goals_fills;
    options.basic_borders=goals_borders;
    options.compare_fills=spent_fills;
    options.compare_borders=spent_borders;
  }else if (options.basic_type==="bar"&& options.compare_type==="line") {
    options.basic_legend=compare_legend;
    options.compare_legend=legend_goals;
    options.basic_data=spent_amounts;
    options.compare_data=compare_data;
    for (let i = 0; i < options.basic_data.length; i++) {
      goals_fills[goals_fills.length] = colors["transparent"];
      goals_borders[goals_borders.length] = colors["black"];
      spent_fills[spent_fills.length] = colors["green5"];
      spent_borders[spent_borders.length] = colors["transparent"];
    }
    options.basic_fills=spent_fills;
    options.basic_borders=spent_borders;
    options.compare_fills=goals_fills;
    options.compare_borders=goals_borders;
  }else if (options.basic_type==="line" && options.compare_type==="line") {
    for (let i = 0; i < options.basic_data.length; i++) {
      goals_fills[goals_fills.length] = colors["transparent"];
      goals_borders[goals_borders.length] = colors["green"];
      spent_fills[spent_fills.length] = colors["transparent"];
      spent_borders[spent_borders.length] = colors["black"];
    }
    options.basic_fills=goals_fills;
    options.basic_borders=goals_borders;
    options.compare_fills=spent_fills;
    options.compare_borders=spent_borders;
  }else if (options.basic_type==="radar") {
    options.basic_legend=compare_legend;
    options.compare_legend=legend_goals;
    options.basic_data=spent_amounts;
    options.compare_data=compare_data;
    for (let i = 0; i < options.basic_data.length; i++) {
      goals_fills[goals_fills.length] = colors["green5"];
      goals_borders[goals_borders.length] = colors["green"];
      spent_fills[spent_fills.length] = colors["black6"];
      spent_borders[spent_borders.length] = colors["black"];
    }
    options.basic_fills=spent_fills;
    options.basic_borders=spent_borders;
    options.compare_fills=goals_fills;
    options.compare_borders=goals_borders;
  }
  return options;
};
