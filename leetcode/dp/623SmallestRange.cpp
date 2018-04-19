#include <vector>
#include <tuple>
#include <set>
#include <functional>
using namespace std;

class Solution {
public:
    vector<int> smallestRange(vector<vector<int>>& nums) {
        vector<int> result;
        if (nums.size() == 1) {
            result.push_back(nums[0][0]);
            result.push_back(nums[0][0]);
            return result;
        }

        set<tuple<int, int, int>> ranges;
        for (int i = 0; i < nums.size(); i++) {
            ranges.insert(make_tuple(nums[i][0], 0, i));
        }
        int L = 0, R = -1;
        while (true) {
            tuple<int, int, int> currentMin = *ranges.begin();
            tuple<int, int, int> currentMax = *ranges.rbegin();

            int l = get<0>(currentMin);
            int r = get<0>(currentMax);

            int currentMinRange = R - L;
            int currentRange = r - l;

            if (currentMinRange < 0 || currentRange < currentMinRange) {
                L = l;
                R = r;
            }

            int index = get<1>(currentMin);
            int arrayIndex = get<2>(currentMin);

            if (index == nums[arrayIndex].size() - 1)
                break;
            ranges.erase(currentMin);
            ranges.insert(make_tuple(nums[arrayIndex][index + 1], index + 1, arrayIndex));
        }

        result.push_back(L);
        result.push_back(R);
        return result;
    }
};