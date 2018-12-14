# hermès

Data Visualization project

dataset : ./data/dataviz.csv

script : .script/\*

# Abstract

The goal of our project, related to the company Smood, is to provide a powerful visualization tool for managers and salespeople, in order to allow them to draw information about their customers, for the purpose of commercial expansion.
Our project proposes not only a visualization of important facts but also the tool which allowed us to draw this information.
Based exclusively on JavaScript technology and the D3 library, our tool is simple to use and adapt to another comparable dataset. In addition, many features can be added quickly if the initial dataset expands.


# Research questions

We would like to answer the following questions:

What is the distribution of the restaurant market?
What is the distribution of orders for customers?
How are the orders distributed over time?
How are the orders distributed in the space?

# Dataset

The dataset corresponds to the initial smood dataset. It was chosen not to extend it in order to focus on the visualization and discovery of facts in this dataset.
The dataset was correctly formatted when imported into D3 in order to generate coherent objects in our searches like a Restaurant object (id, longitute, latitute, number of commands), a Client object (id, longitute, latitute, number of orders) and a delivery item (restaurant id, customer id, distance, time and road).
We've just used Google's Location API to generate restaurant and customer addresses through longitude and latitude.

# Project Steps

The project respected the different steps as described below:

## Step 1
data exploring
Familiarization with D3 tools
Implementation of the project architecture and define research questions
## Step 2
Development of the visualization tool
Implementation of different filters
Project submission to the TA
## Step 3
Creation of the data story
Finalization of the process book
Realization of the video

# Technical Implementation
Exclusively based on JavaScript technology, all the drawing features are realized by D3. We only use Jquery for the navigation bar of the visualization.
All the js functions are started inside the index.html which provide the support div for the D3.
In scripts, you can find implementations of all the features, drawing features inside drawer.js, utilitaries.js provided utilitaries functions (filters, data story updated, ..) and objects.js provided the model of our project.
The entire project is based on the updating of 3 arrays : restaurantLis, customerList and DeliveryList which are created into constantes.js and first init into import.js, based on the csv data file.
The drawer update the SVG container relative to theirs content and utilitaries update theirs content relative to user interactions.

# Getting started with this tool

To start our project, simply place the entire repository in an HTTP server.
It is also possible to use a compressed version of D3 to gain space and add an external import of Jquery (not realized here for an access problem of the github page).

# Some useful links
https://d3js.org
https://beta.observablehq.com/@mbostock/d3-force-directed-graph

