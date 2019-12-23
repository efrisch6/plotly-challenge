
function optionChanged(event) { 

    // var dropDownMenu = d3.select("#selDataset");
    
    // var dataset = dropDownMenu.property("value");
    console.log(event);

    

    d3.json("data/samples.json").then(function(data) {
        var index = data.names.findIndex(d => d === event);

        // Demographic Panel
        var panel = d3.select("#sample-metadata")
        panel.html("");
        Object.entries(data.metadata[index]).forEach(([key, value]) => panel.append("p").text(`${key}: ${value}`))
        var samples = data.samples[index];

        // Bar Chart
        var topTen = Object.assign({},samples);
        topTen.sample_values = samples.sample_values.slice(0,10);
        topTen.otu_ids = samples.otu_ids.slice(0,10);
        topTen.otu_labels = samples.otu_labels.slice(0,10);
        
        Plotly.restyle("bar","x",[topTen.sample_values.reverse()]);
        Plotly.restyle("bar","y",[topTen.otu_ids.reverse().map(id => `OTU ${id}`)]);
        Plotly.restyle("bar","text",[topTen.otu_labels.reverse()]);

        // Bubble Chart
        samples = data.samples[index];

        Plotly.restyle("bubble","x",[samples.otu_ids]);
        Plotly.restyle("bubble","y",[samples.sample_values]);
        Plotly.restyle("bubble","marker.size",[samples.sample_values]);
        Plotly.restyle("bubble","marker.color",[samples.otu_ids]);
        Plotly.restyle("bubble","text",[samples.otu_labels]);

        // Gauge Chart

        Plotly.restyle("gauge","value",[data.metadata[index].wfreq]);
    
    });
}


d3.json("data/samples.json").then(function(data) {
    var names = data.names;
    console.log(typeof names);
    // Dropdown Menu
    var menu = d3.select("#selDataset");

    var option = menu.selectAll("option");
    option.data(names)
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d=>d)
    
    function init() {
        // Demographic Panel
        var panel = d3.select("#sample-metadata")
        Object.entries(data.metadata[0]).forEach(([key, value]) => panel.append("p").text(`${key}: ${value}`))
        var samples = data.samples[0];

        // Bar Chart
        var topTen = Object.assign({},samples);
        topTen.sample_values = samples.sample_values.slice(0,10);
        topTen.otu_ids = samples.otu_ids.slice(0,10);
        topTen.otu_labels = samples.otu_labels.slice(0,10);
        console.log(topTen);


        var trace1 = {
            type: 'bar',
            x: topTen.sample_values.reverse(),
            y: topTen.otu_ids.reverse().map(id => `OTU ${id}`),
            orientation: 'h',
            text: topTen.otu_labels.reverse()
            };

        Plotly.newPlot("bar",[trace1]);

        samples = data.samples[0];
        console.log(samples);
        
        // Bubble Chart
        var trace2 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values, 
                sizemode:"area", 
                sizeref: ".1",
                colorscale: 'Earth',
                color: samples.otu_ids},
            text: samples.otu_labels
        }

        Plotly.newPlot("bubble",[trace2]);


        // Gauge Chart
        var trace3 = {
            domain: { x: [0, 1], y: [0, 1] },
            gauge: { axis: { visible: true, range: [0, 9] } },
            value: data.metadata[0].wfreq,
            title: { text: "<b> Belly Button Washing Frequency </b> <br> Scrubs Per Week" },
            type: "indicator",
            mode: "gauge+number"
        }

        Plotly.newPlot("gauge",[trace3])
        

    };



    init();
    


});