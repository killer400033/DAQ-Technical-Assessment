#include "DBCSignal.h"

namespace dbc {
    class DBCFrame {
    public:
        DBCFrame(std::string dbc);
        void print(std::string time, uint64_t data, std::ostream &outFile);
        int getId(void);

    private:
        std::string name;
        uint32_t id;
        std::vector<DBCSignal> signals;
    };
}