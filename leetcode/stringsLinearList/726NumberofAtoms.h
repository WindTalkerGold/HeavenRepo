#pragma once
#include <string>
#include <map>
#include <iostream>
#include <sstream>
using namespace std;

class Solution {
private:
    map<string, int> processParentheses(const string& formula, int startIndex) {
        // startIndex is '(' or -1
        map<string, int> elementsInside;
        int currentIndex = startIndex+1;
        string currentAtom;
        int currentAtomCount = 0;
        while(currentIndex < formula.size()) {
            char ch = formula[currentIndex];
            if (ch == ')') {
                if (!currentAtom.empty()) {
                    elementsInside[currentAtom] += currentAtomCount == 0 ? 1 : currentAtomCount;
                    currentAtom.clear();
                }
                currentIndex++;
                break;
            }

            if (ch == '(') {
                if (!currentAtom.empty()) {
                    elementsInside[currentAtom] += currentAtomCount == 0 ? 1 : currentAtomCount;
                    currentAtom.clear();
                }
                
                map<string, int> elementsInner = processParentheses(formula, currentIndex);
                currentIndex = elementsInner[")"];
                elementsInner.erase(")");
                for (auto innerPair : elementsInner) {
                    elementsInside[innerPair.first] += elementsInner[innerPair.first];
                }
                continue;
            }

            if (isupper(ch)) {
                if (!currentAtom.empty())
                    elementsInside[currentAtom] += currentAtomCount == 0 ? 1 : currentAtomCount;
                // start of an element
                currentAtom.clear();
                currentAtomCount = 0;
                currentAtom.push_back(ch);
            }
            else if (islower(ch)) {
                currentAtom.push_back(ch);
            }
            else if (isdigit(ch)) {
                currentAtomCount = currentAtomCount * 10 + (ch - '0');
            }

            currentIndex++;
        }

        int elementsCount = 0;
        for (; currentIndex < formula.size(); currentIndex++) {
            if (isdigit(formula[currentIndex])) {
                elementsCount = elementsCount * 10 + (formula[currentIndex] - '0');
            }
            else {
                break;
            }
        }

        for (auto pair : elementsInside) {
            elementsInside[pair.first] = pair.second * elementsCount;
        }
        //
        elementsInside[")"] = currentIndex;
        return elementsInside;
    }


public:
    string countOfAtoms(const string& formula) {
        string formula2 = formula + ")1";
        map<string, int> counts = processParentheses(formula2, -1);
        counts.erase(")");
        stringstream ss;
        for (auto pair : counts) {
            ss << pair.first;
            if(pair.second > 1)
            {
                ss << pair.second;
            }
        }
        return ss.str();

    }
};