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

To support endianness, I had to limit the signal bit lengths to either 8, 16, 32 or 64 bits.

## Telemetry
The streaming-service crashes because it tries to parse invalid JSON passed to it by the data-emulator, as shown here in the docker terminal:
```
/app/src/server.ts:20
streaming-service-1  |     const jsonData: VehicleData = JSON.parse(msg.toString());
streaming-service-1  |                                        ^
streaming-service-1  | SyntaxError: Unexpected token } in JSON at position 67
streaming-service-1  |     at JSON.parse (<anonymous>)
streaming-service-1  |     at Socket.<anonymous> (/app/src/server.ts:20:40)
streaming-service-1  |     at Socket.emit (node:events:517:28)
streaming-service-1  |     at Socket.emit (node:domain:489:12)
streaming-service-1  |     at addChunk (node:internal/streams/readable:368:12)
streaming-service-1  |     at readableAddChunk (node:internal/streams/readable:341:9)
streaming-service-1  |     at Socket.Readable.push (node:internal/streams/readable:278:10)
streaming-service-1  |     at TCP.onStreamRead (node:internal/stream_base_commons:190:23)
```

This is confirmed by the fact that the data-emulator randomly adds a "}" to the message as shown:
```
    if (error_flag === 3) {
      json_string += "}";
    }
```

To fix it, we can catch the exception and log a message to the terminal rather than crashing the service.

To add the battery temp check on the streaming-service, a timeout was added that starts whenever an out of range temp is detected, and then we check for more than 3 out of range temps before the timeout times out.

## Cloud