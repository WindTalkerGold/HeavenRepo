def string_distance(str1, str2):
    zipped = zip(str1, str2)
    return len([a for a,b in zipped if a != b])

class Solution(object):
    def minMutation(self, start, end, bank):
        """
        :type start: str
        :type end: str
        :type bank: List[str]
        :rtype: int
        """
        self.bank = bank
        self.start = start
        
        checked_indexes = [set([-1])]
        unchecked_indexes = set(range(0, len(bank)))
        
        for currentSteps in range(1, 9):
            checked_indexes.append(set([]))
            previousStep = currentSteps - 1
            
            for index in unchecked_indexes:
                string_to_test = bank[index]
                for previousIndex in checked_indexes[previousStep]:
                    previous_checked_str = self.getFromBank(previousIndex)
                    dist = string_distance(previous_checked_str, string_to_test)
                    if dist == 1:
                        if string_to_test == end:
                            return currentSteps
                        checked_indexes[currentSteps].add(index)

            for index in checked_indexes[currentSteps]:
                unchecked_indexes.remove(index)
        return -1

    def getFromBank(self, index):
        return self.start if index == -1 else self.bank[index]

if __name__ == "__main__":
    sln = Solution()
    print(sln.minMutation("AAAACCCC", "CCCCCCCC",
        ["AAAACCCA","AAACCCCA","AACCCCCA","AACCCCCC","ACCCCCCC","CCCCCCCC","AAACCCCC","AACCCCCC"]))

        