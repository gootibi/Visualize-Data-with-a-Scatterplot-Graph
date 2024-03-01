/** Main values */
let url ='https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

let values = [];

let xScale;
let yScale;

let width = 800;
let height = 600;
let padding = 45;

let svg = d3.select('svg');
let tooltip = d3.select('#tooltip');

/** Create canvas size */
const drawCanvas = () => {
    svg.attr('width', width);
    svg.attr('height', height);
};

/** Generate x scale and y scale */
const generateScale = () => {
    xScale = d3.scaleLinear()
                .domain([d3.min(values, item => {
                    return item['Year'] - 1
                }), d3.max(values, item => {
                    return item['Year'] + 1
                })]) // -1 year in minimum year and +1 year in maximum just for style
                .range([padding, width - padding])

    yScale = d3.scaleTime()
                .domain([d3.min(values, item => {
                    return new Date(item['Seconds'] * 1000 - 5000) // -5000 milisecund ust for style
                }), d3.max(values, item => {
                    return new Date(item['Seconds']* 1000 + 5000) // +5000 milisecund ust for style
                })])
                .range([padding, height - padding])
};

/** Create points and tooltip */
const drawPoints = () => {

    svg.selectAll('circle')
        .data(values)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', 6)
        .attr('data-xvalue', (item) => {
            
            return item['Year']
        })
        .attr('data-yvalue', (item) => {
            return new Date(item['Seconds'] * 1000) // milliseconds => seconds
        })
        .attr('cx', (item) => {
            return xScale(item['Year'])
        })
        .attr('cy', (item) => {
            return yScale(new Date(item['Seconds'] * 1000))
        })
        .attr('fill', (item) => {
            return item['Doping'] ? 'red' : 'green'
        })
        .on('mouseover', (e, item) => {
            tooltip.transition()
                    .style('visibility', 'visible')
                    .attr('data-year', item['Year'])

            if ( item['Doping'] != '' ) {
                tooltip.text(`${item['Year']} - ${item['Name']} - ${item['Time']} - ${item['Doping']}`)
            } else {
                tooltip.text(`${item['Year']} - ${item['Name']} - ${item['Time']} - No Doping`)
            }

        })
        .on('mouseout', (e, item) => {
            tooltip.transition()
                    .style('visibility', 'hidden')
        })
};

/** Generate x axis (number => year) and y axis (secund => minutes:seconds) */
const generateAxes = () => {
    let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d')) // x axis number format (d = decimal)

    let yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat('%M:%S')) // y axis minutes:seconds format

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${height - padding})`)
    
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', `translate(${padding}, 0)`)
};

/** Windows onload (async function) => data fetching and functions */
window.onload = async () => {
    const res = await fetch(url);
    values = await res.json();

    drawCanvas();
    generateScale();
    drawPoints();
    generateAxes();
};