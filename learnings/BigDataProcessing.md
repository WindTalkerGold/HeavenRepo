﻿﻿工作这三年，来几乎天天跟大数据打交道，对大数据也算是有一定的认识。

# 什么是大数据
那么什么是大数据呢？窃以为大数据就是字面的意思，很多很多的数据，多到什么程度？多到无法在一台机器上处理的地步。

常规的个人计算机的配置，大约是2~4核的CPU，配上4~16G的内存，以及500G~1T的硬盘。
在工业界，使用的机器一般要强劲一些，通常内存是8~32G，硬盘有的能达到2T，或者配备了SSD。但是无论如何，单台机器的处理能力上限也差不多就是这样。
单台机器的处理、存储能力，都是有限的，而数据，几乎是无上限的。

要去处理海量的数据，一种思路是增加单个计算机的性能。我们知道，有各种超级计算机在，也就相当于我们人类的最强大脑，处理能力超强。
但是，培养最强大脑的难度太大了，全中国这么多人，能有几个最强大脑呢？对于绝大部分企业的机构来说，这种思路并不现实。
因此在大部分情况下，我们的选择是使用大量的普通配置的计算机协同工作，一起处理这些数据。

##### 一个简单的类比
假设我们有50000个数要求和（或者求最大值，乘积，最小值等），然后我们可以雇佣人来做这样的事情，一般一个人，一分钟差不多可以做5次加法，那么也就是说总共需要10000分钟才能做完这些任务。但是10000分钟，差不多是一个星期的时间，太长了啊，我们需要更快，比如两小时以内，就得出结果。

那么怎么办呢？一种办法就是去找最强大脑！那种只要看一遍，马上就能出结果的人。可是在绝大部分情况下这种思路不现实，因为最强大脑太少了，少到你几乎找不到，或者找到的代价太高了。

于是，你跑到一所中学里面，抓了100个中学生来帮你做这个任务。怎么分配任务呢？

1. 你把50000个数分成100组，让每个中学生每次取5个数，求和，将和写在一张小纸条上，然后放到一个筐里。这一步，花费了100分钟，筐里有10000个数了。

2. 你把上一步的10000个数再分成100组，每个中学生做的事情不变，5个数求和，将和写在一张小纸条上，然后放到一个筐里。这一步，每个中学生只有100个数要算，20分钟搞定，剩2000个数。

3. 仍然重复这个过程，4分钟搞定，剩400个数。

4. 你发现每个学生都分不到5个数了，于是你只留下了20个人，仍然重复这个书城，也是4分钟搞定，剩100个数。

5. 还是重复这个过程，1分钟，剩20个数。

6. 这时候你发现，只剩20个数了啊，于是你只留下最后一个人，花了20分钟算完了最后的和，结束。

这个过程总共花了多少时间？大约不到150分钟的样子，就完成了本来一周的工作。

这就是大数据处理的最基本思路：将海量的运算任务分摊给大量的常规性能的运算节点去处理。每个节点的运算性能其实都很一般，都不是最强大脑。
当然，刚刚这个例子太简单了，大数据处理过程中有很多可能出现的问题，包括但不限于：如果有的节点计算得特别慢怎么办？ 有多个计算任务要同时处理的时候，如何用有限的资源进行调度，保证大家都能满足各自的SLA?

等等。 实际处理大数据的过程中，这些问题几乎都会遇到。有些问题，有通用的解法，有些问题，也许只能作为单个案例去解决。


# Map-Reduce模型

Map-Reduce是当下最流行的大数据处理模型。最早处理大数据的工程师们发现，大数据处理的过程很多都可以分成分别叫做Map和Reduce的两个步骤。

## Map
所谓的Map，就是将一个输入拆分成0个，或者1个，或者多个输出的过程。每个输出会有一个key。
## Reduce
所谓的Reduce，就是将Map的数据，按照各自的key聚合，然后相同的key一起处理，得到一个最终的输出的过程。

Map-Reduce最经典的例子是词频统计。

## 数据倾斜问题（Data Skew）

#### 计算过程应尽可能减少副作用，尽可能满足分配律和结合律

# 流式计算

### 计算资源调配的问题

