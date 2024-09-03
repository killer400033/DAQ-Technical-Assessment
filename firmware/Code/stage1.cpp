#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <algorithm>
#include "DBCFrame.h"

using namespace std;
using namespace dbc;

int main(int argc, char *argv[]) {
    string dbcDefinition = "BO_ 1797 ECU_WheelSpeed: 8 Vector__XXX\n"
                        "SG_ WheelSpeedFR : 0|16@1+ (0.1,0) [0|0] \"km/h\" Vector__XXX\n"
                        "SG_ WheelSpeedRR : 32|16@1+ (0.1,0) [0|0] \"km/h\" Vector__XXX\n";
    DBCFrame dbcFrame(dbcDefinition);

    if (argc != 3) {
        cerr << "Usage: stage1 <log file> <output file>" << endl;
        return 1;
    }

    ifstream logFile(argv[1]);
    ofstream outFile(argv[2]);

    if (!logFile) {
        cerr << "Error opening file: " << argv[1] << endl;
        return 1;
    }
    if (!outFile) {
        cerr << "Error opening file: " << argv[2] << endl;
        return 1;
    }

    string line;
    while (getline(logFile, line)) {
        istringstream lineStream(line);
        string time, can, idAndData;

        if (!(lineStream >> time >> can >> idAndData)) {
            cerr << "Error parsing line: " << line << endl;
            continue;
        }
    
        size_t hashPos = idAndData.find('#');
        string idStr = idAndData.substr(0, hashPos);
        string dataStr = idAndData.substr(hashPos + 1);
        
        int id;
        stringstream ss1;
        ss1 << hex << idStr;
        ss1 >> id;
        
        uint64_t data;
        stringstream ss2;
        ss2 << hex << dataStr;
        ss2 >> data;

        if (dbcFrame.getId() == id) {
            dbcFrame.print(time, data, outFile);
        }
    }

    logFile.close();
    outFile.close();
    return 0;
}