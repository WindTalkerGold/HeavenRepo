#include <string>
#include <unordered_set>
#include <vector>
using namespace std;

class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> dict(wordDict.begin(), wordDict.end());
        vector<bool> dp(s.size() + 1, false);
        dp[0] = true;

        for (int i = 1; i <= s.size(); i++) {
            for (int j = 1; j <= i; j++) {
                if (!dp[i - j])
                    continue;
                string word = s.substr(i - j, j);
                if (dict.count(word)) {
                    dp[i] = true;
                    break;
                }
            }
        }

        return *dp.rbegin();
    }

};