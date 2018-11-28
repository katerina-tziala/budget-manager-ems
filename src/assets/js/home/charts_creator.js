/*
* CREATE CHART ELEMENTS FOR STATISTICS VIEW INTERFACE
*/
//create canvas for chart
const createChartCanvas = (type) => {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('id', `chartCanvas_${type}`);
  canvas.classList.add("chartCanvas");
  canvas.setAttribute('width', '400');
  canvas.setAttribute('height', '400');
  return canvas;
};
//populate chart options for statistics type
const populateChartOptionsSelectBox = (container, sectionname) => {
  let sectiontype = {categories:"category", payments:"payment", goals:"goal", daily:"day"}
  let options = {
    "values":["amount_total", "expnumb", "amount_avg_daily", "amount_max", "amount_min"],
    "texts":["total amount","number of expenses", "average amount", "max amount", "min amount"]
  };
  if (sectionname!="daily") {
    options.texts[2]="average amount (per day)";
    options.values.splice(3, 0, "amount_avg_"+sectionname, "expnumb_avg_"+sectionname);
    options.texts.splice(3, 0, "average amount (per "+sectiontype[sectionname]+")", "average number of expenses");
  }
  const selectBoxChecker = document.getElementById(`selectChartOption_${sectionname}`);
  if(selectBoxChecker != null){
    container.querySelectorAll('.chartOptionContainer')[0].remove();
  }
  const selectbox_element = createChartSelectBox(`selectChartOption_${sectionname}`, options, 'chartOptionContainer',
  'chartOptionSelectBox', `chartOption_${sectionname}`, options.values[0]);
  container.append(selectbox_element);
  if(sectionname==="goals"){
    const selectContainer = container.querySelectorAll('.chartOptionContainer')[0];
    selectContainer.classList.add("goalStatsOptionContainer");
  }
  const selectBox = document.getElementById(`selectChartOption_${sectionname}`);
  selectBox.blobSelect.init({
    "placeholder": options.texts[0],
    "placeholderOption": options.values[0],
    "search":false});
  selectBox.addEventListener('change', changeChart);
};
//populate available chart types
const populateChartTypeSelectBox = (container, sectionname) => {
  let options = {
    "values":["bar", "doughnut", "line", "filled_line", "pie"],
    "texts":["bar chart", "doughnut chart", "line chart", "filled line chart", "pie chart"]
  };
  if(sectionname === "goals"){
    options.values.unshift("comparison");
    options.texts.unshift("comparison chart");
  }
  const selectBoxChecker = document.getElementById(`selectChartType_${sectionname}`);
  if(selectBoxChecker != null){
    container.querySelectorAll('.chartTypeContainer')[0].remove();
  }
  const selectbox_element = createChartSelectBox(`selectChartType_${sectionname}`, options,'chartTypeContainer', 'chartTypeSelectBox', `chartOption_${sectionname}`, options.values[0]);
  container.append(selectbox_element);
  const selectBox = document.getElementById(`selectChartType_${sectionname}`);
  selectBox.blobSelect.init({
    "orderType":"string",
    "order":"ASC",
    "placeholder": options.texts[0],
    "placeholderOption": options.values[0],
    "search":false});
  selectBox.addEventListener('change', changeChart);
};
//create chart select box
const createChartSelectBox = (selectid, options, containerclass, selectclass, selectname, placeholder) => {
  const selectContainer = document.createElement('div');
  selectContainer.className = containerclass;
  const selectBox = document.createElement('select');
  selectBox.setAttribute('id',selectid);
  selectBox.classList.add("formInputs", selectclass);
  selectBox.name = selectname;
  let selectedoption = document.createElement('option');
  selectedoption.value = placeholder;
  selectedoption.innerHTML = options.texts[0];
  selectBox.append(selectedoption);
  for (var i = 0; i < options.values.length; i++) {
    if(options.values[i]!=placeholder){
      let option = document.createElement('option');
      option.value = options.values[i];
      option.innerHTML = options.texts[i];
      selectBox.append(option);
    }
  }
  selectContainer.append(selectBox);
  return selectContainer;
};
//populate chart comparison select box
const populateChartComparisonsSelectBox = (container, sectionname) => {
  let options = {
    "values":["bar", "bar_line", "lines", "radar"],
    "texts":["bar chart", "bar-line chart", "lines chart", "radar chart"]
  };
  const selectBoxChecker = document.getElementById(`selectChartOption_${sectionname}`);
  if(selectBoxChecker != null){
    container.querySelectorAll('.chartOptionContainer')[0].remove();
  }
  const selectbox_element = createChartSelectBox(`selectChartOption_${sectionname}`, options, 'chartOptionContainer',
  'chartOptionSelectBox', `chartOption_${sectionname}`, options.values[0]);
  container.append(selectbox_element);
  const selectBox = document.getElementById(`selectChartOption_${sectionname}`);
  const selectContainer = container.querySelectorAll('.chartOptionContainer')[0];
  selectContainer.classList.add("compareOptionContainer");
  selectBox.blobSelect.init({
    "placeholder": options.texts[0],
    "placeholderOption": options.values[0],
    "search":false});
  selectBox.addEventListener('change', changeChart);
};
/*
* CREATE CHARTS
*/
//create bar, line and filled line chart
const createLinearChart = (chartOptions) => {
  const chart = document.getElementById(`chartCanvas_${chartOptions.target}`).getContext('2d');
  let linearChart = new Chart(chart, {
    type: chartOptions.type,
      data: {
        labels: chartOptions.labels,
          datasets: [{
            label: chartOptions.legend,
            data: chartOptions.data,
            backgroundColor: chartOptions.fills,
            borderColor: chartOptions.borders,
            borderWidth:chartOptions.borderwidth[0],
            pointBorderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor:chartOptions.borders,
        }]
      },
      options: {
        title: {
          display: true,
          text: chartOptions.title,
          fontSize: 20,
          fontColor:"#1a1a1a",
          fontFamily:"'Roboto', 'Helvetica', 'Verdana', sans-serif"
        },
        tooltips :{
          backgroundColor: "#1a1a1a",
          titleFontFamily:"'Roboto', 'Helvetica', 'Verdana', sans-serif",
          titleFontSize:16,
          bodyFontFamily:"'Roboto', 'Helvetica', 'Verdana', sans-serif",
          bodyFontSize:16
        },
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
    }
  });
};
//create pie and doughnut chart
const createRoundChart = (chartOptions) => {
  const chart = document.getElementById(`chartCanvas_${chartOptions.target}`).getContext('2d');
  let roundChart = new Chart(chart, {
        type: chartOptions.type,
        data: {
            labels: chartOptions.labels,
            datasets: [{
                label: chartOptions.legend,
                data: chartOptions.data,
                backgroundColor: chartOptions.fills,
                borderColor: chartOptions.borders,
                borderWidth:chartOptions.borderwidth
            }]
        },
        options: {
          title: {
            display: true,
            text: chartOptions.title,
            fontSize: 20,
            fontColor:"#1a1a1a",
            fontFamily:"'Roboto', 'Helvetica', 'Verdana', sans-serif"
          },
          cutoutPercentage:chartOptions.cutout_percentage,
          tooltips :{
            backgroundColor: "#1a1a1a",
            titleFontFamily:"'Roboto', 'Helvetica', 'Verdana', sans-serif",
            titleFontSize:16,
            bodyFontFamily:"'Roboto', 'Helvetica', 'Verdana', sans-serif",
            bodyFontSize:16
          },
          legend: {
            display: true,
            labels:{
              fontSize:16
            }
          },
        }
    });
};
//create comaprison chart
const createMixedChart = (chartOptions) => {
  const target = "goals";
  const chart = document.getElementById(`chartCanvas_${chartOptions.target}`).getContext('2d');
  let mixedChart = new Chart(chart, {
    type: chartOptions.basic_type,
    data: {
      datasets: [{
        label: chartOptions.basic_legend,
        data: chartOptions.basic_data,
        backgroundColor: chartOptions.basic_fills,
        borderColor: chartOptions.basic_borders,
        borderWidth:chartOptions.borderwidth,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor:chartOptions.basic_borders,
      }, {
        label: chartOptions.compare_legend,
        data: chartOptions.compare_data,
        backgroundColor: chartOptions.compare_fills,
        borderColor: chartOptions.compare_borders,
        borderWidth:chartOptions.borderwidth,
        type: chartOptions.compare_type,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor:chartOptions.compare_borders,
      }],
    labels: chartOptions.labels
  },
  options: {
    title: {
      display: true,
      text: chartOptions.title,
      fontSize: 20,
      fontColor:"#1a1a1a",
      fontFamily:"'Roboto', 'Helvetica', 'Verdana', sans-serif"
    },
    tooltips :{
        backgroundColor: "#1a1a1a",
        titleFontFamily:"'Roboto', 'Helvetica', 'Verdana', sans-serif",
        titleFontSize:16,
        bodyFontFamily:"'Roboto', 'Helvetica', 'Verdana', sans-serif",
        bodyFontSize:16
      },
    legend: {
        display: true,
        labels:{
          fontSize:16
        }
      },
    scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }],
      }
  }
  });
};
//create radar chart
const createRadarChart = (chartOptions) => {
  const chart = document.getElementById(`chartCanvas_${chartOptions.target}`).getContext('2d');
  let radarChart = new Chart(chart, {
    type: 'radar',
    data: {
      datasets: [{
        label: chartOptions.basic_legend,
        data: chartOptions.basic_data,
        backgroundColor: chartOptions.basic_fills,
        borderColor: chartOptions.basic_borders,
        borderWidth:chartOptions.borderwidth,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor:chartOptions.basic_borders,
        pointLabelFontSize: 20
      }, {
      label: chartOptions.compare_legend,
      data: chartOptions.compare_data,
      backgroundColor: chartOptions.compare_fills,
      borderColor: chartOptions.compare_borders,
      borderWidth:chartOptions.borderwidth,
      pointBorderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor:chartOptions.compare_borders,
      pointLabelFontSize: 20
    }],
    labels: chartOptions.labels
    },
    options: {
      title: {
        display: true,
        text: chartOptions.title,
        fontSize: 20,
        fontColor:"#1a1a1a",
        fontFamily:"'Roboto', 'Helvetica', 'Verdana', sans-serif"
      },
      tooltips :{
        backgroundColor: "#1a1a1a",
        titleFontFamily:"'Roboto', 'Helvetica', 'Verdana', sans-serif",
        titleFontSize:16,
        bodyFontFamily:"'Roboto', 'Helvetica', 'Verdana', sans-serif",
        bodyFontSize:16
      },
      legend: {
        display: true,
        labels:{
          fontSize:16,
          padding:8
        }
      },
      scale: {
        pointLabels: {
          fontSize: 15,
          fontColor:'#000'
        }
      }
    }
  });
};
