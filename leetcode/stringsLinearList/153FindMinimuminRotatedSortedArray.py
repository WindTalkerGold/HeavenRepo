def findPivot(nums, left, right):
    if left >= right-1:
        if nums[left] < nums[0]:
            return left
        if nums[right] < nums[0]:
            return right
        return -1
    
    mid = int((left+right) / 2)
    return findPivot(nums, left, mid) if nums[mid] <= nums[0] else findPivot(nums, mid, right)

class Solution(object):
    def findMin(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        length = len(nums)
        if length == 1:
            return nums[0]
        pivotIndex = findPivot(nums, 1, length-1)
        return nums[0] if pivotIndex == -1 else nums[pivotIndex]
        
if __name__ == '__main__':
    sln = Solution()
    print(sln.findMin([3,4,5,1,2]))