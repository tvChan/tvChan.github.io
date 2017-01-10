---
title: webpack学习一之配置环境
tags: 
	- webpack
---

### 起始篇

1. 模块是你需要哪个模块才自己手动当初模块，包括jq也一样。
2. 配环境步骤  https://zhuanlan.zhihu.com/p/20367175?refer=FrontendMagazine  傻瓜式教程

#### 我会遇到的坑：

- 在进行css预编译时，换成sass写，教程没说要安装什么东西，但是就是一直出现这个问题，后来查了一下是还要安装 node-sass

    ![webpack1](/img/webpack1.jpg)

    `npm install node-sass --save-dev`

- 在二“加载jQuery plugin或者其他legacy第三方库”中，第一种方法，使用webpack.ProvidePlugin,在config中加入代码时，
```javascript
 ...
  plugins: [
    new HtmlwebpackPlugin({
      title: 'Hello World app'
    }),
    //provide $, jQuery and window.jQuery to every script
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
  ]
  ...
```

出现了以下的错误：
    
![webpack2](/img/webpack2.jpg)


原来是，在config开始时没有对引入webpack，引入代码并定义：
`var webpack = require('webpack');`

<!--more-->

#### webpack理解：

webpack其实就是一个配置文件，所有东西都放在一个config文件里。配置文件主要分为三大块：
1. entry，入口文件 让webpack用哪个文件作为项目的入口
2. output 出口 让webpack把处理完成的文件放在哪里
3. module 模块 要用什么不同的模块来处理各种类型的文件

#### 步骤：

- 安装webpack `npm install webpack --save-dev`
- 初始化项目 `npm init`
- 新增项目需要的文件
- 配置webpack ，安装一个plugin，可以自动快速在对应文件夹里生成html，把webpack将多个js合并成一个js文件，然后把它引用到build文件夹里的html文件里（每安装一个工具，都要在config文件里进行配置）
```javascript
...
plugin: [
    new HtmlwebpackPlugin({
         title: "hello webpack app!"
     })
]
...
```

- 配置webpack-dev-server，新建一个开发服务器，可以serve我们打包后的代码，并在代码更新时，自动刷新浏览器
安装webpack-dev-server
`npm install webpack-dev-server --save-dev`

修改config配置
```javascript
module.exports = {
    ...
    devServer: {
         historyApiFallback: true,
         hot: true,
         inline: true,
         progress: true

     },
    ...
}
```
然后在package.json里配置一下运行的命令，npm支持自定义的一些命令
```javascript
...
"scripts": {
    "start": "webpack-dev-server --hot --inline"
}
...
```
在命令行里输入`npm start`,然后浏览器输入 localhost:8080
- 添加CSS样式，**webpack使用loader的方式来处理各种各样的资源**，如样式文件，会用css-loader和style-loader，css-loader会遍历css文件，找到所有的url(...)并处理，style.loader会吧所有的样式插入到你页面的style tag中
安装loader
`npm install css-loader style-loader --save-dev`

在config文件中，配置loader
```javascript
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true
    },
    ...
    module: {
        loaders: [
            {
                test: /\.css$/,
                loaders: ['style', 'css'],
                include: APP_PATH
            }
        ]
    },
    ...
    plugins: [
        new HtmlwebpackPlugin({
            title: "hello world app"
        })
    ]
    ...
```
新建main.css文件，并把css在入口文件中引用：
`require('./main.css');`

- css预编译程序，sass，其实再添加一个loader就行啦，但是，在我实践之后，出现了上面的坑1，就要按照上面的方法解决，即可

`npm install sass-loader --save-dev`

修改config文件，删去之前添加的css规则，加上下面的loader
```javascript
{
    test: /\.scss$/,
    loaders: ['style', 'css', 'sass'],
    include: APP_PATH
},
```
再添加两个sass文件，variables.sass和main.scss
variables.scss
`$red: red`

main.scss
```css
@import "./variables.scss";
h1 {
    color: $red;
}
```

- 处理图片和其他静态文件 和上面一样，安装loader，处理文件。eg: 图片，字体等等，图片可以根据你的需求，将一些图片自动转成base64编码的，减轻不少网络请求吧
安装url-loader:
`npm install url-loader --save-dev`

配置config文件：
```javascript
{
    test: /\.(png|jpg)$/,
    loader: 'url?limit=40000' // 当图片大小小于这个限制时，就会自动转成base64编码
}
```

- 添加第三方库 当你需要jquery，moment，underscore等库时，webpack很容易就能做到这点
安装jq，moment
`npm install jquery moment --save-dev`

在js中引用

```javascript
var $ = require('jquery');
var moment = require('moment');
$('p').append('<p> hello world ' + moment().format() + '</p>');
```

- 添加ES6的支持，用babel转译

装各种loader
`npm install babel-loader babel-preset-es2015 --save-dev`
配置config文件
```javascript
...
{
    test: /\.jsx?$/,
    loader: 'babel',
    include: APP_PATH,
    query: {
        presets: ['es2015']
    }
},
...
```