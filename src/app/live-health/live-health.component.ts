import { Component, OnInit, OnDestroy } from '@angular/core';
import * as d3 from 'd3';
import { RestService } from '../app.restservice';
import { interval, timer, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-live-health',
  templateUrl: './live-health.component.html',
  styleUrls: ['./live-health.component.css']
})
export class LiveHealthComponent implements OnInit, OnDestroy {

    data1: any[];
    data2: any[];

    private margin = {top: 20, right: 20, bottom: 30, left: 50};
    private width: number;
    private height: number;

    private x: any;
    private y: any;
    private svg1: any;
    private svg2: any;
    private line: d3.Line<[number, number]>; // this is line definition

    private onDestroy = new Subject<void>();

  constructor(private restService: RestService) {
   // configure margins and width/height of the graph
   this.width = 960 - this.margin.left - this.margin.right;
   this.height = 300 - this.margin.top - this.margin.bottom;
  }

  ngOnInit() {


    this.initalizeForFirstTime();

    this.reload();

  }

  ngOnDestroy(){
    setTimeout(() => { clearInterval(this.timerId); }, 0);
  }
  
  timerId;
  
  subscription: Subscription;
  private reload(){
      this.timerId = setInterval(x => {
      
      //removing g alone from svg, so that data can be refreshed
      d3.selectAll("g > *").remove();

      this.restService.getConnectivityStatsData().subscribe(data => {
        this.data1 = data;
        this.buildSvg1();
        this.addXandYAxis1();
        this.drawLineAndPath1();
      });

      this.restService.getDownloadSpeedData().subscribe(data => {
        this.data2 = data;
        this.buildSvg2();
        this.addXandYAxis2();
        this.drawLineAndPath2();
      });

    }, 10000);
    
  }

  private initalizeForFirstTime(){
    this.restService.getConnectivityStatsData().subscribe(data => {
      this.data1 = data;
      this.buildSvg1();
      this.addXandYAxis1();
      this.drawLineAndPath1();
    });

    this.restService.getDownloadSpeedData().subscribe(data => {
      this.data2 = data;
      this.buildSvg2();
      this.addXandYAxis2();
      this.drawLineAndPath2();
    });
  };

  private buildSvg1() {
        this.svg1 = d3.select('#svg1')
            .append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    }
    private addXandYAxis1() {
         // range of data configuring
         this.x = d3.scaleLinear().range([0, this.width]);
         this.y = d3.scaleLinear().range([this.height, 0]);
         this.x.domain(d3.extent(this.data1, (d) => d.time ));
         this.y.domain(d3.extent(this.data1, (d) => d.value ));

        // Configure the Y Axis
        this.svg1.append('g')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(d3.axisBottom(this.x));
        // Configure the Y Axis
        this.svg1.append('g')
            .attr('class', 'axis axis--y')
            .call(d3.axisLeft(this.y));

    }

    private drawLineAndPath1() {
        this.line = d3.line()
          .x( (d: any) => this.x(d.time) )
          .y( (d: any) => this.y(d.value) );
        
        //to fill path
        /*// Configuring line path
        this.svg.append('path')
            .datum(this.data)
            .attr('class', 'line')
            .attr('d', this.line);*/

        // Add the line
        this.svg1.append("path")
        .datum(this.data1)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
            .attr("d", this.line);
        
    }


    private buildSvg2() {
      this.svg2 = d3.select('#svg2')
          .append('g')
          .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }
  private addXandYAxis2() {

      // range of data configuring
      this.x = d3.scaleLinear().range([0, this.width]);
      this.y = d3.scaleLinear().range([this.height, 0]);
      this.x.domain(d3.extent(this.data2, (d) => d.time ));
      this.y.domain(d3.extent(this.data2, (d) => d.value ));

      // Configure the Y Axis
      this.svg2.append('g')
          .attr('transform', 'translate(0,' + this.height + ')')
          .call(d3.axisBottom(this.x));
      // Configure the Y Axis
      this.svg2.append('g')
          .attr('class', 'axis axis--y')
          .call(d3.axisLeft(this.y));

  }

  private drawLineAndPath2() {
      this.line = d3.line()
        .x( (d: any) => this.x(d.time) )
        .y( (d: any) => this.y(d.value) );
      
      //to fill path
      /*// Configuring line path
      this.svg.append('path')
          .datum(this.data)
          .attr('class', 'line')
          .attr('d', this.line);*/

      // Add the line
      this.svg2.append("path")
      .datum(this.data2)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
          .attr("d", this.line);
      
  }

}