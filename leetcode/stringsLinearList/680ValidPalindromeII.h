#pragma once
#include <string>
using namespace std;

class Solution {
private:
    bool validPalindrome(const string& s, int left, int right) {
        while (left < right) {
            if (s[left++] != s[right--])
                return false;
        }
        return true;
    }

public:
    bool validPalindrome(const string& s) {
        int length = s.size();
        
        int left = 0;
        int right = length - 1;
        while (left < right) {
            if (s[left] == s[right]) {
                left++;
                right--;
                continue;
            }
                        
            bool canRemoveLeft = s[left + 1] == s[right];
            bool canRemoveRight = s[left] == s[right - 1];

            if (!canRemoveLeft && !canRemoveRight)
                return false;

            if (canRemoveLeft && !canRemoveRight) {
                left += 2;
                right--;
                return validPalindrome(s, left, right);
            }

            if (canRemoveRight && !canRemoveLeft) {
                right -= 2;
                left++;
                return validPalindrome(s, left, right);
            }

            return validPalindrome(s, left + 2, right - 1) || validPalindrome(s, left + 1, right - 2);
            // can move it both way
        }
        
        return true;
    }
};