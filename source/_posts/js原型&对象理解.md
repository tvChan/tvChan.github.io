---
title: js原型&对象理解
date: 2016-06-01 16:48:47
tags:
    - JavaScript
    - 原型
---

## 对象

对象：在js里，除了字符串，数字，boolean，null和undefined之外，其他的js值都是对象。

js中对象可以分为普通对象和函数对象。

普通对象：是除函数对象外的，都可以成为普通对象。

函数对象：是通过new Function产生的对象。

这一种是最常见的定义函数的方法：

```javascript
function foo1(){
}
```

这一种就是定义了一个匿名函数，然后赋值到foo2　　

```javascript
var foo2=function{
}
```
而以下这一种是通过对象实例的方式定义了一个匿名函数，赋值到foo3

```javascript
var foo3=new Function('x','console.log('I'm a Function!')');
```
以上三个都属于函数对象，不信？咱来瞅瞅：

![pro1](/img/prototype1.png)
　　
<!--more-->

tvtvtv,前面两个例子看起来不像是new Function创建的啊！那怎么解释呢？

其实前面两个例子是这样的，因为Function是JS自带的对象，所以在foo1，foo2创建时，JS就自动通过new Function来构建函数啦、

所以上面三个对象都属于函数对象啦。

再看看普通对象：

这是最简单创建对象的方式：

```javascript
var obj1={}
```
通过new创建并实例化一个新对象：

```javascript
var obj2=new Object();
```

通过new创建并实例化了一个foo1对象：

```javascript
var obj3=new foo1();
```
通过Object.create()创建一个对象：

```javascript
var obj4=Object.create({

});
```

![pro2](/img/prototype2.png)

所以以上方式创建的对象，都是属于普通对象。

 

说到对象，必然会和对象扯上关系的那肯定是prototype和__proto__啦。

## 原型

prototype就是原型，每创建一个函数对象都会内置一些属性，包括prototype和__proto__，但值得注意的是，普通对象是没有prototype这个属性的哦。

让我们来看看真假：

![pro3](/img/prototype3.png)

这里就是普通对象点出来的属性，你看没有prototype吧，再看看函数对象的；

![pro4](/img/prototype4.png)

函数对象继承下来的属性，明显要比普通对象的多，你看，那不就有prototype了吗、

但是呢，prototype对foo1是不可见的，也就是说，foo1是不会查找prototype上的属性和方法的。

写个例子检验一下：

```javascript
function foo(){

}

foo.prototype.name='tv';
console.log(foo.name);    //undefined
```
prototype的主要作用其实是：继承。把prototype的属性和方法都留给自己的后代，子类就可以访问prototype的属性和方法啦、

![pro5](/img/prototype5.png)

怎么来解释上面那张图呢，

只要创建了一个新函数，就会给该函数创建一个prototype属性，这个prototype属性时指向该函数的原型对象的，也就是foo.prototype。默认情况，所有的原型对象都会获得一个constructor（构造函数）属性，这个属性包含一个指向函数对象上的prototype属性的指针，这就是为什么上图的constructor会指向foo啦

 

接下来说说：__proto__原型链，实现继承就靠它啦！

__proto__：在普通对象和函数对象上都存在，上面图点出来的已经很明显啦。

 再写个例子画画图来理解理解：
 
![pro6](/img/prototype6.png)
 
```javascript
function foo{

}
foo.prototype.name='tv';
var test1=new foo();　　//调用构造函数创建一个新实例对象
console.log(test1.name);    //tv
``` 

当调用构造函数创建一个新实例后，实例的内部会包含一个指针（内部属性），指向构造的原型对象，ECMA-262第5版把这个指针叫[prototype]，脚本中没有标准的方式访问[prototype],但是在chrome，Firefox等浏览器中，都支持一个属性__proto__;所以可以把[prototype]当作__proto__，这就形成了实例和函数原型对象的关联，就实现了继承啦
 

所以整个原型链继承下来的效果是这样的：

![pro7](/img/prototype7.png)

 



