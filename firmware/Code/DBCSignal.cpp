#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <algorithm>
#include "DBCSignal.h"

using namespace dbc;
using namespace std;

template <typename T, typename V>
float ApplyEndianAndSign(T val);

DBCSignal::DBCSignal(string signal) {
    string prefix, colon, bitData, scaleData, rangeData;

    istringstream stringStream(signal);
    stringStream >> prefix >> name >> colon >> bitData >> scaleData >> rangeData;

    size_t pipePos = bitData.find('|');
    size_t atPos = bitData.find('@');
    startBit = stoi(bitData.substr(0, pipePos));
    length = stoi(bitData.substr(pipePos + 1, atPos - pipePos));
    isSmallEndian = (bitData[atPos + 1] == '1') ? true : false;
    isSigned = (bitData[atPos + 2] == '-') ? true : false;
    
    size_t commaPos = scaleData.find(',');
    scale = stod(scaleData.substr(1, commaPos - 1));
    offset = stod(scaleData.substr(commaPos + 1, scaleData.length() - commaPos - 1));

    pipePos = rangeData.find('|');
    min = stoi(rangeData.substr(1, pipePos - 1));
    max = stoi(rangeData.substr(pipePos + 1, rangeData.length() - pipePos - 1));

    stringStream >> ws;
    char ch;
    stringStream.get(ch);
    getline(stringStream, unit, '"');
}

float DBCSignal::getValue(uint64_t data) {
    float output;
    uint64_t mask = ((uint64_t)(1 << length) - 1) << (64 - length - startBit);
    data = (data & mask) >> (64 - length - startBit);

    switch (length) {
        case 8:
            output = (isSigned) ? ApplyEndianAndSign<uint8_t, int8_t>(data) : ApplyEndianAndSign<uint8_t, uint8_t>(data);
            break;
        case 16:
            output = (isSigned) ? ApplyEndianAndSign<uint16_t, int16_t>(data) : ApplyEndianAndSign<uint16_t, uint16_t>(data);
            break;
        case 32:
            output = (isSigned) ? ApplyEndianAndSign<uint32_t, int32_t>(data) : ApplyEndianAndSign<uint32_t, uint32_t>(data);
            break;
        case 64:
            output = (isSigned) ? ApplyEndianAndSign<uint64_t, int64_t>(data) : ApplyEndianAndSign<uint64_t, uint64_t>(data);
            break;
        default:
            throw runtime_error("Unsupported signal bit length");
            break;
    }

    output += offset;
    output *= scale;
    return output;
}

string DBCSignal::getName(void) {
    return name;
}

template <typename T, typename V>
float ApplyEndianAndSign(T val) {
    union U {
        T val;
        V outVal;
        uint8_t bytes[sizeof(T)];
    } src, dst;

    dst.val = 0;
    src.val = val;
    reverse_copy(begin(src.bytes), end(src.bytes), begin(dst.bytes));
    return dst.outVal;
}