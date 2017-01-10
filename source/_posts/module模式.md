---
title: module模式
date: 2016-09-05 23:52:30
tags:
    - 设计模式
---

### Module(模块)模式

能**清晰分离和组织项目中的代码单元**

通常有以下四种方式实现：
- 对象字面量
```javascript
var myModule = {
    myProperty: 'someProperty',
    myMethod: function() {
        return "this is myMethod"
    }
}
myModule.myMethod();    // 调用方法
```

- Module模式
```javascript
var myModule = (function() {
    var myProperty;
    return {
        myMethod: function() {
            return "this is myMethod";
        }
    }
})();
```
- AMD模式
- CommonJS模块
- ECMAScript Harmmory模块
上面三种迟点写例子介绍、

Module模式： 在传统软件工程中，是为类提供私有和公有的封装方法，主要是使用闭包封装私有状态和组织，提供一种包装公有私有和变量的方式，防止其泄露至全局作用域。
![module](/img/module1.png)

### 模式变化

包括以下两种：
> 引入混入

这种就是DOJO，ExtJS，JQ等的实现

> 引出

就是上面Module模式的实现

### 优缺点

优点： 支持私有数据
缺点： 
1. 改变数据可见性，修改时，需要每个修改
2. 无法为使用为私有成员创建自动化测试