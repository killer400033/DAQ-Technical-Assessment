#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <algorithm>
#include <iomanip>
#include "DBCFrame.h"

using namespace dbc;
using namespace std;

DBCFrame::DBCFrame(string dbc) {
    istringstream dbcStream(dbc);
    string line;
    while (getline(dbcStream, line)) {
        istringstream lineStream(line);
        string prefix;
        lineStream >> prefix;

        if (prefix.compare("BO_") == 0) {
            lineStream >> id;
            lineStream >> name;
        }
        else if (prefix.compare("SG_") == 0) {
            signals.push_back(DBCSignal(line));
        }
    }
}

void DBCFrame::print(string time, uint32_t dataId, uint64_t data, ostream &outFile) {
    if (id == dataId) {
        for (int i = 0; i < signals.size(); i++) {
            outFile << time << ": "
                << signals[i].getName() << ": "
                << fixed << setprecision(1)
                << signals[i].getValue(data) << "\n";
        }
    }
}