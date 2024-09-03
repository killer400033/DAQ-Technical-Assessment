# Brainstorming

This file is used to document your thoughts, approaches and research conducted across all tasks in the Technical Assessment.

## Firmware
List of requirements:
- Not hard coded to just the given DBC definition
- Supports all the possible DBC definitions
- Given a string of the format given in the SensorBus.dbc file, the program should automatically know how to extract the data

To do this, I implemented 3 scripts, stage1.cpp, DBCFrame.cpp and DBCSignal.cpp (and header files). stage1.cpp containes the main function and simply reads command line args, initializes a DBCFrame, and loops through all the can bus data, checking if any of them match the required ID and if so, passing the data along to be processes.

DBCFrame is a class that contains the id, name and references to the signals that are part of a certain CAN frame. At the beginning, it is passed the SensorBus.dbc description. From this, it extracts the information about the frame and its signals.

DBCSignal is a class that contains all the details of a single signal in the database. From the DBCFrame, it is given just the information about one specific signal. It can also use this information to process a given 64 bit peice of information.

To make an implementation of this fast, I made tried to make the processing required to calculate the value minimal, where if lots of dbc frames were being used, a hashmap could be used to quickly look up which DBCFrame matches the given ID, then extract the data.

## Telemetry

## Cloud