#pragma once
#include <vector>
using namespace std;

class Solution {
public:
    int singleNonDuplicate(vector<int>& nums) {
        return binary(nums, 0, nums.size()-1);
    }

    int binary(const vector<int>& nums, int left, int right) {
        if (left == right)
            return nums[left];

        int mid = left + (right - left) / 2;
        bool leftEqual = nums[mid] == nums[mid - 1];
        bool rightEqual = nums[mid] == nums[mid + 1];
                
        if (!leftEqual && !rightEqual)
            return nums[mid];

        int halfSize = mid;
        bool halfOdd = (mid & 1) != 0;
        bool lookLeft = leftEqual ^ halfOdd;
        if (lookLeft)
            return binary(nums, left, mid - 1);
        else
            return binary(nums, mid + 1, right);
    }
};