import re
class Solution(object):
    def complexNumberMultiply(self, a, b):
        """
        :type a: str
        :type b: str
        :rtype: str
        """
        regex = re.compile('(-*[0-9]+)\+(-*[0-9]+)i')
        match1 = regex.match(a)
        match2 = regex.match(b)
        (x1, y1) = (int(match1.group(1)), int(match1.group(2)))
        (x2, y2) = (int(match2.group(1)), int(match2.group(2)))

        (x3, y3) = self.multiply((x1, y1), (x2, y2))
        return "{0}+{1}i".format(x3, y3)

    def multiply(self, number1, number2):
        a = number1[0]*number2[0]
        b = number1[0]*number2[1]
        c = number1[1]*number2[0]
        d = number1[1]*number2[1]
        print(a, b, c, d)
        return (a-d, b+c)


if __name__ == "__main__":
    sln = Solution()
    print(sln.complexNumberMultiply("78+-76i", "-86+72i"))