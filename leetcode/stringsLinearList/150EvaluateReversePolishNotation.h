#pragma once
#include <string>
#include <vector>
#include <stack>
using namespace std;

class Solution {
public:
    int evalRPN(const vector<string>& tokens) {
        stack<int> stack1;
        for (string str : tokens) {
            if (isdigit(str[0]) || str.size() > 1) {
                stack1.push(atoi(str.c_str()));
            }
            else {
                int op2 = stack1.top();
                stack1.pop();
                int op1 = stack1.top();
                stack1.pop();

                int result = conductOp(op1, op2, str[0]);
                stack1.push(result);
            }
        }

        return stack1.top();
    }

    int conductOp(int op1, int op2, char op) {
        switch (op) {
        case '+': return op1 + op2;
        case '-': return op1 - op2;
        case '*': return op1 * op2;
        case '/': return op1 / op2;
        }
        return 0;
    }
};