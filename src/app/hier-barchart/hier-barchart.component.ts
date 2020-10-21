import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { RestService } from '../app.restservice';

@Component({
  selector: 'app-hier-barchart',
  templateUrl: './hier-barchart.component.html',
  styleUrls: ['./hier-barchart.component.css']
})
export class HierBarchartComponent implements OnInit {

  constructor(private restService: RestService) { 

  }

  private width;
  private height;
  root;
  margin;
  x;
  color;
  barStep;
  barPadding;
  duration;
  xAxis;
  yAxis;
  data : any;

  ngOnInit() {

    this.width = 960;
    this.height = 600;
    this.restService.getHierBarchartData().subscribe(data => {
        this.data=data;
        this.initialize();
    });
    
  }

  bar(svg, d, selector) {
    const g = svg.insert("g", selector)
        .attr("class", "enter")
        .attr("transform", `translate(0,${this.margin.top + this.barStep * this.barPadding})`)
        .attr("text-anchor", "end")
        .style("font", "10px sans-serif");
  
    const bar = g.selectAll("g")
      .data(d.children)
      .join("g")
        .attr("cursor", d => {!d.children ? null : "pointer"})
        .on("click", (event, d) => this.down(svg, d));
  
    bar.append("text")
        .attr("x", this.margin.left - 6)
        .attr("y", this.barStep * (1 - this.barPadding) / 2)
        .attr("dy", ".35em")
        .text(d => d.data.name);
  
    bar.append("rect")
        .attr("x", this.x(0))
        .attr("width", d => this.x(d.value) - this.x(0))
        .attr("height", this.barStep * (1 - this.barPadding));
  
    return g;
  }

  down(svg, d) {

    if (!d.children || d3.active(svg.node())) return;  

    // Rebind the current node to the background.
    svg.select(".background").datum(d);
  
    svg.attr('height', this.getHeight(this.barStep, this.margin, d.data.children.length));

    // Define two sequenced transitions.
    const transition1 = svg.transition().duration(this.duration);
    const transition2 = transition1.transition();
  
    // Mark any currently-displayed bars as exiting.
    const exit = svg.selectAll(".enter")
        .attr("class", "exit");
  
    // Entering nodes immediately obscure the clicked-on bar, so hide it.
    exit.selectAll("rect")
        .attr("fill-opacity", p => p === d ? 0 : null);
  
    // Transition exiting bars to fade out.
    exit.transition(transition1)
        .attr("fill-opacity", 0)
        .remove();
  
    // Enter the new bars for the clicked-on data.
    // Per above, entering bars are immediately visible.
    const enter = this.bar(svg, d, ".y-axis")
        .attr("fill-opacity", 0);
  
    // Have the text fade-in, even though the bars are visible.
    enter.transition(transition1)
        .attr("fill-opacity", 1);
  
    // Transition entering bars to their new y-position.
    enter.selectAll("g")
        .attr("transform", this.stack(d.index))
      .transition(transition1)
        .attr("transform", this.stagger());
  
    // Update the x-scale domain.
    this.x.domain([0, d3.max(d.children, d => d['value'])]);
  
    // Update the x-axis.
    svg.selectAll(".x-axis").transition(transition2)
        .call(this.xAxis);
  
    // Transition entering bars to the new x-scale.
    enter.selectAll("g").transition(transition2)
        .attr("transform", (d, i) => `translate(0,${this.barStep * i})`);    

    // Color the bars as parents; they will fade to children if appropriate.
    enter.selectAll("rect")
        .attr("fill", this.color(true))
        .attr("fill-opacity", 1)
      .transition(transition2)
        .attr("fill", d => this.color(!!d.children))
        .attr("width", d => this.x(d.value) - this.x(0));

  }

  up(svg, d) {
    
    if (!d.parent || !svg.selectAll(".exit").empty()) return;
  
    // Rebind the current node to the background.
    svg.select(".background").datum(d.parent);

    svg.attr('height', this.getHeight(this.barStep, this.margin, d.parent.children.length));

    // Define two sequenced transitions.
    const transition1 = svg.transition().duration(this.duration);
    const transition2 = transition1.transition();
  
    // Mark any currently-displayed bars as exiting.
    const exit = svg.selectAll(".enter")
        .attr("class", "exit");
  
    // Update the x-scale domain.
    this.x.domain([0, d3.max(d.parent.children, d => d['value'])]);
  
    // Update the x-axis.
    svg.selectAll(".x-axis").transition(transition1)
        .call(this.xAxis);
  
    // Transition exiting bars to the new x-scale.
    exit.selectAll("g").transition(transition1)
        .attr("transform", this.stagger());
  
    // Transition exiting bars to the parent’s position.
    exit.selectAll("g").transition(transition2)
        .attr("transform", this.stack(d.index));
  
    // Transition exiting rects to the new scale and fade to parent color.
    exit.selectAll("rect").transition(transition1)
        .attr("width", d => this.x(d.value) - this.x(0))
        .attr("fill", this.color(true));
  
    // Transition exiting text to fade out.
    // Remove exiting nodes.
    exit.transition(transition2)
        .attr("fill-opacity", 0)
        .remove();
  
    // Enter the new bars for the clicked-on data's parent.
    const enter = this.bar(svg, d.parent, ".exit")
        .attr("fill-opacity", 0);
  
    enter.selectAll("g")
        .attr("transform", (d, i) => `translate(0,${this.barStep * i})`);
  
    // Transition entering bars to fade in over the full duration.
    enter.transition(transition2)
        .attr("fill-opacity", 1);
  
    // Color the bars as appropriate.
    // Exiting nodes will obscure the parent bar, so hide it.
    // Transition entering rects to the new x-scale.
    // When the entering parent rect is done, make it visible!
    enter.selectAll("rect")
        .attr("fill", d => this.color(!!d.children))
        .attr("fill-opacity", p => p === d ? 0 : null)
      .transition(transition2)
        .attr("width", d => this.x(d.value) - this.x(0))
        .on("end", function(p) { d3.select(this).attr("fill-opacity", 1); });
  }

  stack(i) {
    let value = 0;
    return d => {
      const t = `translate(${this.x(value) - this.x(0)},${this.barStep * i})`;
      value += d.value;
      return t;
    };
  }

  stagger() {
    let value = 0;
    return (d, i) => {
      const t = `translate(${this.x(value) - this.x(0)},${this.barStep * i})`;
      value += d.value;
      return t;
    };
  }

  initialize(){
    
    var root = d3.hierarchy(this.data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value)
        .eachAfter(d => d['index'] = d.parent ? d.parent['index'] = d.parent['index'] + 1 || 0 : 0)
    this.root = root;

    var margin = ({top: 30, right: 30, bottom: 0, left: 100});
    this.margin = margin;

    var x = d3.scaleLinear().range([margin.left, this.width - margin.right])
    this.x = x;

    const color = d3.scaleOrdinal([true, false], ["steelblue", "#aaa"])
    this.color = color;

    const barStep = 27
    this.barStep = barStep;

    const barPadding = 3 / barStep
    this.barPadding = barPadding;

    const duration = 750
    this.duration = duration;

    var xAxis = g => g
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${margin.top})`)
        .call(d3.axisTop(x).ticks(this.width / 80, "s"))
        .call(g => (g.selection ? g.selection() : g).select(".domain").remove());
    this.xAxis = xAxis;

    var yAxis = g => g
        .attr("class", "y-axis")
        .attr("transform", `translate(${margin.left + 0.5},0)`)
        .call(g => g.append("line")
            .attr("stroke", "currentColor")
            .attr("y1", margin.top)
            .attr("y2", this.getMaxHeight()));
    this.yAxis = yAxis;    

    var height = this.getHeight(barStep, margin, this.root.children.length);  
    this.height = height;

    const svg = d3.select("svg")
        .attr("width", this.width)
        .attr("height", this.height);
              
    this.x.domain([0, this.root.value]);
              
    svg.append("rect")
        .attr("class", "background")
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("cursor", "pointer")
        .on("click", (event, d) => this.up(svg, d));
  
    svg.append("g")
        .call(this.xAxis);
              
    svg.append("g")
        .call(this.yAxis);
  
    this.down(svg, this.root);

  }
  
  getMaxHeight(){
    var max = 0;
    this.root.each(d => d.children && (max = Math.max(max, d.children.length)));
    return max * this.barStep + this.margin.top + this.margin.bottom;
  }

  getHeight(barStep, margin, noOfChildren){

      //add one extra unit to height so that always there will be empty space to click and go back
      noOfChildren = noOfChildren+1;

      //calculate new height based on number of childern
      this.height = noOfChildren * barStep + margin.top + margin.bottom;

      return this.height;
  }


}