---
title: 动态创建html节点方法
tags: 
	- DOM
	- 性能
---

### 常见方法

《JavaScript高级程序》里介绍到动态创建html节点的几种方法，常见的有以下几种： 

- crateAttribute(name)：　　　　　 　　用指定名称name创建特性节点

- createComment(text)：　　　　　　　创建带文本text的注释节点

- createDocumentFragment()：　　　　创建文档碎片节点

- createElement(tagname)：　　　　　  创建标签名为tagname的节点

- createTextNode(text)：　　　　　　   创建包含文本text的文本节点

<!--more-->

属于菜鸟的我，在做项目时，通过ajax获取了后台数据做表格数据渲染时，用的是dom节点的拼接append方法。后来才知道这种方法对于前端的性能优化来说是最慢的，虽然说这是最简单的方法。

举个栗子： 我从后台获取到一个有很多元素的data[]数组，要把里面的数据遍历到ul的li里。

```javascript
var liNode, i, len;
var ulNode = document.getElementById('container');
for(i = 0; len = data.length; i++) {
    liNode = document.createElement('li');
    liNode.innerHtml = data[i];
    ulNode.appendChild(liNode);
}
```
这段代码是能实现需求的，但是，在循环里调用data.length次的document.xxx.appendChild(),这里就每一次的调用就回产生一次页面渲染，所以对于页面优化来说，这是大打折扣的，这就要说说下面要说的创建碎片啦。

由于DOM操作会导致浏览器的回流，回流需要花费大量的时间进行样式计算和节点重绘与渲染，所以应当尽量减少回流次数。一种可靠的方法就是加入元素时不要修改页面上已经存在的元素，而是在内存中的节点进行大量的操作，最后再一并将修改运用到页面上。DOM操作本身提供一个创建内存节点片段的功能:document.createDocumentFragment()，我们可以将其运用于上述代码中：

```javascript
var oFragment = document.createDocumentFragment();
var ulNode = document.getElementById('container');

for(var i = 0; i < data.length; i++){
    var liNode = document.createElement('li');
    var txt = document.createTextNode(data[i]);
    liNode.innerHtml = txt;
    oFragment.appendChild(liNode);
}
ulNode.appendChild(fragment);

```
这样就只会触发一次回流，效率会得到很大的提升。如果需要对一个元素进行复杂的操作（删减、添加子节点），那么我们**应当先将元素从页面中移除，然后再对其进行操作**，或者将其复制一个（cloneNode()），在内存中进行操作后再替换原来的节点。


