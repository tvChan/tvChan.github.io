---
title: 数组迭代方法之reduce
tags: 
	- JavaScript
	- js数组方法
---

昨天因为数据结构的封装上有点问题，就分别在开源中国和segmentFault上面提了问题，别问为什么不在stackoverflow里面提。。。

segmentFault里面的大神的答案果然不失所望。

其中有个答案是结合了reduce和map来编写的。map留着下次再说~请期待O(∩_∩)O~

所以今晚就看了一下关于reduce()的资料，才发现自己底子不行，之前理解的很多细节都没有注意到。翻回犀牛书认真读了一遍才茅塞顿开。

<!--more-->

### reduce()的参数

reduce()有两个参数，一个是回调函数（必选），另一个是传递给回调函数里prev参数的初始值（可选），**这里的可选参数我就经常会把它忽略，导致产生理解误区**

### reduce()回调函数里面的参数

举个栗子：

```javascript
var arr = [1,2,3,4];
var sum = arr.reduce(function(prev,cur,index,arr) {
    console.log(prev, cur, index);
    return prev + cur;
});
console.log(arr, sum);

/* console结果

1  2  1
3  3  2
6  4  3
[1,2,3,4] 10

*/
```

- prev     函数第二项的值或是回调函数返回的累积值
- cur      当前的迭代值
- index    当前迭代值的索引
- arr      数组本身

这里的prev很容易被误解，有很多人都会以为是数组里的cur的前一位数，其实一开始我也这么认为，console出来见真相啊。

前方高能，**当第一次执行时，reduce方法里的没有第二个参数时，会默认把数组的第一位当成prev的值**，上面的例子就是如此，所以第二位就成了cur值，所以index值是从1开始的。**如果reduce的第二个参数设置了，则第一次执行，prev的值就是第二个参数。**，如果要把prev设置为num型，第二个参数就为`0`，对象类型的话就设置为`{}`,当然数组的就设置为`[]`

举些栗子：（栗子都是从前端三人行公众号上找的，比较懒。。。）

统计字符串有多少个相同字符
```javascript

// 这里的reduce第二个参数是{}，所以prev的初始值就是{}
var arrString = 'abcdaabc';  
arrString.split('').reduce(function(res, cur) {  
    res[cur] ? res[cur] ++ : res[cur] = 1  
    return res;  
}, {}) 
```

```javascript

// 这里的reduce第二个参数是[]，所以prev的初始值就是[]
[1, 2].reduce(function(res, cur) {   
    res.push(cur + 1);   
    return res;   
}, []);  
```


### reduce()和reduceRight()

reduce和reduceRight的原理其实是一样的，但是不同的是，它们是按照数组索引从高到低（从右到左）处理数组的。

下面例子就很适合用reduceRight()

```javascript
var a = [2,3,4];

// 计算2^(3^4)，乘方操作的优先顺序是从右到左
var big = a.reduceRight(function(accumulator,value) {
    return Math.pow(value, accumulator);
});
```

### 兼容问题

虽然reduce大法好用，但是在`ie9以下的浏览器`是不支持它的噢O__O "…

所以要请慎用！