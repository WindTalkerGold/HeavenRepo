#pragma once
#include <string>
#include <vector>
#include <algorithm>
#include <sstream>

using namespace std;
class Solution {
public:
    string getHint(const string& secret, const string& guess) {
        vector<int> digitsSecret(10, 0);
        vector<int> digitsGuess(10, 0);
        int bulls = 0;
        for (int i = 0; i < secret.size(); i++) {
            if (secret[i] == guess[i])
                bulls++;
            else {
                int s = secret[i] - '0';
                int g = guess[i] - '0';
                digitsSecret[s]++;
                digitsGuess[g]++;
            }
        }
        int cows = 0;
        for (int i = 0; i < 10; i++) {
            cows += min(digitsGuess[i], digitsSecret[i]);
        }
        
        stringstream stream;
        stream <<  bulls << "A" << cows << "B" ;
        return stream.str();
    }
};