import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { barChart } from "./barChart.js";


d3.csv("./csv/Netflix_Movies_and_TV_Shows.csv").then(data => {
    console.log(data);    
   barChart("#barchart", data);
});