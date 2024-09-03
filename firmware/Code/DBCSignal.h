namespace dbc {
    class DBCSignal {
    public:
        DBCSignal(std::string signal);
        float getValue(uint64_t data);
        std::string getName(void);
        
    private:
        std::string name;
        int startBit;
        int length;
        bool isSmallEndian;
        bool isSigned;
        float scale;
        float offset;
        float min;
        float max;
        std::string unit;
    };
}