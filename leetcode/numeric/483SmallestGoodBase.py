import math

def compare(n, x, target):
    """
    Sum(x, n) = 1+x+x^2+...+x^n = ( x^(n+1) - 1 ) / ( x -1 )
    return 0 if Sum(x, n) == target
    return 1 if Sum(x, n) > target
    return -1 if Sum(x, n) < target
    """
    x_1 = x - 1
    x_n_plus_1 = x ** (n+1) - 1
    prod = target * x_1
    if prod == x_n_plus_1:
        return 0
    if prod < x_n_plus_1:
        return 1
    return -1
    
class Solution(object):
    def smallestGoodBase(self, n):
        """
        The range of n is [3, 10^18]. so n -1 is always a candidate
        """
        n_int = int(n)
        n_int_minus1 = n_int-1
        ret_base = n_int_minus1
        for i in range(2, 64, 1):
            base = int(math.pow(n_int_minus1, 1/i))
            if base < 2:
                break
            if self.test(base, n_int):
                ret_base = base
        return str(ret_base)

    def test(self, candidate, value):
        """ check if there is any n that compare(n, candidate, value) == 0"""
        if value % candidate != 1:
            return False

        n = int(math.log(value) / math.log(candidate))
        ret = False
        while True:
            compare_result = compare(n, candidate, value)
            if compare_result == 0:
                ret = True
                break
            if compare_result < 0:
                break
            n = n - 1
        return ret
    
if __name__ == "__main__":
    solution = Solution()
    print(solution.smallestGoodBase("14919921443713777"))
