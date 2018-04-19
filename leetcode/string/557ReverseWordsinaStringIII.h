#pragma once
#include <string>
using namespace std;
class Solution {
public:
	string reverseWords(const string& s) {
		string result(s);
		// no more touching to s anymore

		auto leftIter = result.begin();
		while (true)
		{
			while (leftIter != result.end() && *leftIter == ' ')
				leftIter++;
			if (leftIter == result.end())
				break;
			auto rightIter = leftIter;
			while (rightIter != result.end() && *rightIter != ' ')
				rightIter++;
			// now right iter is the end or the whitespace
			reverse(leftIter, rightIter);

			leftIter = rightIter;
		}

		return result;
	}
};