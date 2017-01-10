---
title: handlerbars的使用
date: 2016-08-10 22:11:17
tags:
    - 模板
    - handlebars
---

<span style="color:red">p.s: 文中出现的==  ==，均为大胡子**两对花括号**的替换，好像是hexo不支持两对花括号，编译时会出错，又找到一个坑(⊙﹏⊙)b</span>

### 自定义helper

```html
<div class="post">
  <h1>By {{fullName author}}</h1>
  <div class="body">{{body}}</div>

  <h1>Comments</h1>

  {{#each comments}}
  <!--下面{{fullName author}}调用自定义模板，fullName是模板名，后面的author才是函数参数-->
  <h2>By {{fullName author}}</h2>   
  <div class="body">{{body}}</div>
  {{/each}}
</div>
```

```javascript
var context = {
  author: {firstName: "Alan", lastName: "Johnson"},
  body: "I Love Handlebars",
  comments: [{
    author: {firstName: "Yehuda", lastName: "Katz"},
    body: "Me too!"
  }]
};
//自定义Helper
Handlebars.registerHelper('fullName', function(person) {
  return person.firstName + " " + person.lastName;
});
```

<!--more-->

#### helper会把当前上下文作为函数中的==this==上下文

此时上下文指的是items
```html
<ul>
  {{#each items}}
  <li>{{agree_button}}</li>
  {{/each}}
</ul>
```

使用下面的this上下文和helpers:
```javascript
var context = {
  items: [
    {name: "Handlebars", emotion: "love"},
    {name: "Mustache", emotion: "enjoy"},
    {name: "Ember", emotion: "want to learn"}
  ]
};

Handlebars.registerHelper('agree_button', function() {
  return new Handlebars.SafeString(
    "<button>I agree. I " + this.emotion + " " + this.name + "</button>"
  );
});
```

结果如下：

```html
<ul>
  <li><button>I agree. I love Handlebars</button></li>
  <li><button>I agree. I enjoy Mustache</button></li>
  <li><button>I agree. I want to learn Ember</button></li>
</ul>
```

> 如果你不希望你的 helper 返回的 HTML值被编码，就请务必返回一个 ==new Handlebars.SafeString==

<!--more-->

### 内置Helpers (with,each,if,unless,log)

#### ==with== helper (p.s.:不太懂)

==#with==一般情况下，Handlebars模板会在编译的阶段的时候进行context传递和赋值。使用with的方法，我们可以将context转移到数据的一个section里面（如果你的数据包含section）。 这个方法在操作复杂的template时候非常有用。

一般情况下，Handlebars 模板在计算值时，会把传递给模板的参数作为上下文。

```javascript
var source   = "<p>{{lastName}}, {{firstName}}</p>";
var template = Handlebars.compile(source);
template({firstName: "Alan", lastName: "Johnson"});
```

结果如下：

```html
<p>Johnson, Alan</p>
```

不过也可以在模板的某个区域切换上下文，使用内置的 with helper即可。

```html
<div class="entry">
  <h1>{{title}}</h1>

  {{#with author}}
  <h2>By {{firstName}} {{lastName}}</h2>
  {{/with}}
</div>
```

在使用下面数据作为上下文时：

```javascript
{
  title: "My first post!",
  author: {
    firstName: "Charles",
    lastName: "Jolley"
  }
}
```

会得到如下结果：

```html
<div class="entry">
  <h1>My first post!</h1>
  <h2>By Charles Jolley</h2>
</div>
```

### handlebarJS 模板传参到html里

```javascript
var handle = __inline('./test.handlebars');
$('#test').append(handle(context));  //context是放参数的变量，如需要传参则handle(data)，如不需要传参则handle
```