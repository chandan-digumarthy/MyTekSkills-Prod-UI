import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { RestService } from '../app.restservice';

@Component({
  selector: 'app-force-disjoint',
  templateUrl: './force-disjoint.component.html',
  styleUrls: ['./force-disjoint.component.css']
})
export class ForceDisjointComponent implements OnInit {



    private width: number;
    private height: number;
    private root;
    private svg = null; 
    private g = null;
  
    constructor(private restService: RestService) { 
        
    }
  
    ngOnInit() {
      this.width = 960;
      this.height = 600;
      this.restService.getForceDirectedData().subscribe(data => {
        this.root=data;
        this.generateChart();
      });     
    }
  
  generateChart(){
     // declares a tree layout and assigns the size
     var treemap = d3.tree().size([this.height, this.width]);
  
     // Assigns parent, children, height, depth
     this.root = d3.hierarchy(this.root, function(d) { return d.children; });
  
     // Assigns the x and y position for the nodes
     var treeData = treemap(this.root);
  
     // Compute the new tree layout.
     var nodes = this.root.descendants(),
         links = this.root.links();
    
     var link = null;
     var node = null;
  
     var link_force =  d3.forceLink(links);
  
     this.svg = d3.select('svg')
       .attr('width', this.width).attr('height', this.height);  
  
     this.g = this.svg.append("g")
               .attr("class", "everything");
   
               link = this.g.selectAll(".link"),
               node = this.g.selectAll(".node");
               
               //add zoom capabilities 
               var zoom_handler = d3.zoom()
                 .on("zoom", (event, d) => { return this.zoom_actions(this.g, event) });
           
               zoom_handler(this.svg); 
           
               var simulation = d3.forceSimulation(nodes);
           
               simulation
               .force("charge_force", d3.forceManyBody())
               .force("center_force", d3.forceCenter(this.width / 2, this.height / 2))
               .force("links",link_force)
               .force("x", d3.forceX())
               .force("y", d3.forceY());
             
               simulation.on("tick", () => this.tick(node, link) );
           
               simulation.restart();  
               
               link = this.g.append("g")
                     .attr("stroke", "#999")
                     .attr("stroke-opacity", 0.6)
                   .selectAll("line")
                   .data(links)
                   .join("line")
                     .attr("stroke-width", d => Math.sqrt(d['value']));
            
               var i = 0;
           
               var node = this.g.selectAll(".node")
                 .data(nodes)
               .enter().append("g")
                 .attr("class", "node")
                 .call(this.drag(simulation));
                
                
               node
                   .append("circle")
                   .attr("r", function(d) { return Math.sqrt(d.data.value) / 10 || 4.5; })
                   .attr("fill", function(d) {
                            if(i==0) {
                               i++;
                               return "#8cff66";
                             } else if(d.data.type == "Continent") {
                               return "#ffff66";
                             } else if(d.data.type == "Country") {
                                return "#ff9999";
                              } else if(d.data.type == "State") {
                                return "#3182bd";
                              } else {
                                return "#fd8d3c";
                             }
                         }
                   )
                   .attr("stroke", "blue")
                   .attr("stroke-width", 0.5);
           
                 node.append("text")
                     .attr("dx", 8)
                     .attr("dy", ".35em")
                     .style("fill", "blue")
                     .style("font", "normal 3px Arial")
                     .text(function(d) { 
                       if(d.data.value!=undefined) {
                         return d.data.name+" : "+d.data.value;
                        } else {
                          return d.data.name;
                        }
                      });
           
                 node.append("title")
                     .text(d => { 
                          if(d.data.value!=undefined) {
                            return d.data.name+" : "+d.data.value;
                          } else {
                            return d.data.name;
                          }
                        }
                      );
   }
  
  // Color leaf nodes orange, and packages white or blue.
  color(d) {
   return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
  }
  
  tick(nodeElements, linkElements) {
  
   // nodeElements.attr("cx", function(d,i) {return d.x; })
   // .attr("cy", function(d) { return d.y; })
   nodeElements.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  
   linkElements.attr("x1", function(d) { return d.source.x; })
   .attr("y1", function(d) { return d.source.y; })
   .attr("x2", function(d) { return d.target.x; })
   .attr("y2", function(d) { return d.target.y; });
  
  }
  
  // Toggle children on click.
  click(d) {
   if (!d3.event.defaultPrevented) {
     if (d.children) {
       d._children = d.children;
       d.children = null;
     } else {
       d.children = d._children;
       d._children = null;
     }
     this.generateChart();
   }
  }
  
  drag(simulation) {

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event,d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event,d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
  }
  
  //Zoom functions 
  zoom_actions(g, event){
    g.attr("transform", event.transform)
  }

}