#pragma once
class Solution {
private:
    int bitLength(int n) {
        int length = 0;
        while (n > 0) {
            length++;
            n = (n >> 1);
        }
        return length;
    }
public:
    int rangeBitwiseAnd(int m, int n) {
        int bitLengthM = bitLength(m);
        int bitLengthN = bitLength(n);

        if (bitLengthM != bitLengthN)
            return 0;
        if (bitLengthM == 0 || bitLengthN == 0)
            return 0;

        int mask = 1 << (bitLengthM - 1);
        return mask + rangeBitwiseAnd(m -mask, n -mask);
    }
};