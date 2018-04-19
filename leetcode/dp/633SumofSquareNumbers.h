#pragma once
#include <algorithm>

class Solution {
public:
    bool judgeSquareSum(int c) {
        int r = sqrt(c);
        int l = 0;
        while (l <= r)
        {
            int sum = l*l + r*r;
            if (sum == c)
                return true;
            if (sum < c)
                l++;
            else
                r--;
        }
        return false;
    }
};