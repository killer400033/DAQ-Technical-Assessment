#include "DBCSignal.h"

namespace dbc {
    class DBCFrame {
    public:
        DBCFrame(std::string dbc);
        void print(std::string time, uint32_t dataId, uint64_t data, std::ostream &outFile);

    private:
        std::string name;
        uint32_t id;
        std::vector<DBCSignal> signals;
    };
}