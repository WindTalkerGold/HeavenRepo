using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MultiThread
{
    /// <summary>
    /// Use this class to read a file, will separate the file line by line, do specfied action
    /// </summary>
    public class ConcurrentFileReader
    {
        private readonly string filePath;
        private readonly long totalFileSizeInBytes;
        private readonly Action<string> actionOnEachLine;
        // each block will be 4096 bytes in size;
        private const int BlockSize = 4096;

        public ConcurrentFileReader(string filePath, Action<string> actionOnEachLine)
        {
            this.filePath = filePath;
            this.totalFileSizeInBytes = new FileInfo(filePath).Length;
            this.actionOnEachLine = actionOnEachLine;
        }

        public long ReadLines()
        {
            int blockNumber = (int)(totalFileSizeInBytes / BlockSize) + 1;
            IEnumerable<long> startOffsets = Enumerable.Range(0, blockNumber).Select(blockIndex => (long)blockIndex * BlockSize);

            long total = 0;
            Parallel.ForEach<long, long>(
                startOffsets,
                () => 0,
                BlockReadImpl,
                taskLocalTotal => { Interlocked.Add(ref total, taskLocalTotal); }
            );

            return total;
        }

        private long BlockReadImpl(long offset, ParallelLoopState state, long index, long taskLocal)
        {
            FileStream fileStream = File.OpenRead(filePath);
            fileStream.Seek(offset, SeekOrigin.Begin);
            byte[] block = new byte[BlockSize];
            int count = fileStream.Read(block, 0, BlockSize);
            string content = Encoding.UTF8.GetString(block);
            actionOnEachLine(content);
            return count;
        }
    }
}
