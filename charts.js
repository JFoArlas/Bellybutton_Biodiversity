function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1.1. Create the buildCharts function.
function buildCharts(sample) {
  // 1.2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 1.3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 1.4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);

    // 3.1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var metaArray = metadata.filter(sampleObj => sampleObj.id == sample);

    // 1.5. Create a variable that holds the first sample in the array.
    var result = samplesArray[0];

    // 3.2. Create a variable that holds the first sample in the metadata array.
    var result2 = metaArray[0];

    // 1.6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // 3.3. Create a variable that holds the washing frequency.
    var wfreq = parseFloat(result2.wfreq);

    // 1.7. Create the yticks for the bar chart so the otu_ids with the most bacteria are last. 
    var yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();

    // 1.8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      text: otu_labels.slice(0,10).reverse(),
      orientation: 'h'
    }
    ];
    // 1.9. Create the layout for the bar chart. 
    var barLayout = {      
      title: "Top 10 Bacteria Cultures Found (OTUs)",
      xaxis: {title: "Samples"},    
      }
    // 1.10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    
    // 2.1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids.slice(0,10).reverse(),
      y: sample_values.slice(0,10).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      mode: 'markers',
      marker: {
        size: sample_values.slice(0,10).reverse(),
        color: otu_ids.slice(0,10).reverse(),
        colorscale: 'Emrld'
      }
    }
    ];
    // 2.2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      hovermode: "closest"
    };
    // 2.3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 3.4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: {x: [0, 1], y: [0, 1]},
        value: wfreq,
        type: "indicator",
        mode: "gauge+number",
        title: {text: "Belly Button Washing Frequency"},
        gauge: {
          axis: {range: [0, 10]},
          bar: { color: "black" },
          steps: [
            {range: [0, 2], color: "darkred"},
            {range: [2, 4], color: "darkorange"},
            {range: [4, 6], color: "gold"},
            {range: [6, 8], color: "yellowgreen"},
            {range: [8, 10], color: "darkgreen"}]
        },
      }
    ];

    // 3.5. Create the layout for the gauge chart.
    var gaugeLayout = {width: 600, height: 450, margin:{t: 0, b: 0}};

    // 3.6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}