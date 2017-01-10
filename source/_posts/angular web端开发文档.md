---
title: angular web端开发文档
date: 2016-08-30 23:28:57
tags:
    - angular
    - fis
---


##  目录结构
> components    //第三方组件
>> bootstrap-datatimepicker    //基于boostrap的日期选择器
>> font-awesome-4.5.0    //字体图标
>> layer    //弹出层插件
>> qrcode    //JQuery二维码插件

> framework    //全局框架
>> angular-1.3.0.14    //Anguler
>> angular-ui-router    //基于Angular的第三方路由
>> bootstrap-3.3.5    //UI框架
>> jquery 

> src    //源代码
>> common    //公共资源
>>> css
>>>> base.css    //基础样式：标签初始化
>>>> common.css    //自定义公共UI组件

>>> js
>>>> app.js    //Angular启动js：主要是配置路由代码
>>>> controllers.js    //Controller（控制器）：主要js代码都在里面
>>>> filters.js    //Filter（过滤器）：过滤data，类似handlebars里面的Handlebars.register
>>>> services.js    //Service（服务）：自定义服务

>>page    //子页面
>>> bank.html    //提现帐户
>>> comment.html    //评价管理
>>> commodity.html    //商品管理（未完成）
>>> home.html    //主子页
>>> member.html    //会员管理
>>> notice.html    //公告设置
>>> qrcode.html    //二维码
>>> recharge.html    //积分充值
>>> withdraw.html    //提现

>>panel    //面板（子页面中的功能板块区域）
>>> account.html    //子主页面 - 用户帐户板块
>>> finance.html    //子主页面 - 用户账务板块
>>> shortCut.html    //子主页面 - 快捷功能板块

> api-conf.js    //路径配置
> fis-conf.js    //fis配置
> index.html    //入口页面：包括页面头部和左菜单列表

<!--more-->

## FIS+ Angular 会遇到的坑
### 变量命名问题
* 下面是Angular官方推荐写法：

```javascript
moduleName.run(function($rootScope, $state, $stateParams) {
    do something; 
});
moduleName.controller('moduleCtrl', function($scope, $http, $state, $stateParams) {
    do something;
});
```
代码经fis部署后会进行压缩，变量名会强行改为简写，angular内部变量会被改成t,u,o之类的变量名导致浏览器报错。

* **在FIS下要把内部变量放在数组里面，像下面这样**

```javascript
moduleName.run(['$rootScope','$state','$stateParams',function($rootScope, $state, $stateParams) {
    do something; 
}]);
moduleName.controller('moduleCtrl',['$scope','$http','$state','$stateParams', function($scope, $http, $state, $stateParams) {
    do something;
}]);
```

### Ajax 相关问题
* angular下仍然可以使用JQuery的AJAX，但是经常会遇到不请求或延迟请求的问题，所以angular下尽量不要使用Ajax。
* angular封装了一个叫$http的服务，类似ajax，官方API文档是下面这种写法：

```javascript
$http.get('http:\\static...', {
    key1:value1,
    key2:value2
}).success(function(data) { 
    do something;
}).error(function(){
    do something;
});  
```

同样，在FIS下这么写还是会报错，data对象内部还要再加一个params对象才可以，像这样：

```javascript
$http.get('http:\\static...', {
    params:{
        key1:value1,
        key2:value2
    }
}).success(function(data) { 
    do something;
}).error(function(){
    do something;
});  
```

### Angular下 计时器 setTimeout 和 setInterval 问题；
* Angular下，setTimeout 和 setInterval 虽然可以用，但是如果用setTimeout对数据进行操作，会解除数据与视图的绑定，数据的变化无法体现在视图上，要换成$timeout服务，用法与setTimeout差不多：

```javascript
 $timeout(function(){
     dosomething();
 },1000)
```

<!--more-->

## Router 路由
Angular本身自带了一个原生路由ngRouter，但是功能简单，而且不能嵌套页面。

商家WEB端用了一个基于angular的第三方路由ui-router，可以进行页面的嵌套。

ui-router使用方法：

* 声明router模块，并注入主业务模块business：

```javascript
var routerApp = angular.module('routerApp', ['ui.router','business']);    //数组变量表示依赖的模块名；
```

* 初始化路由：

```javascript
routerApp.run(['$rootScope','$state','$stateParams',function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}]);
```

* 配置路由：

```javascript
routerApp.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');    //如果#后无参或找到参数，则跳转至'/home'
    $stateProvider
        .state('home', {    //#号的索引值
            url: '/home',    //url
            views: {     //嵌套页面
                '': {    
                    templateUrl: 'src/page/home.html'    //子页面路径
                },
                'shortCut@home': {    //二级子页面：‘二级页面名@上一级页面名’
                    templateUrl: 'src/panel/shortCut.html'    //二级子页面路径
                },
                'account@home': {
                    templateUrl: 'src/panel/account.html'
                },
                'finance@home': {
                    templateUrl: 'src/panel/finance.html'
                }
            }
        })
        .state('commodity', {    //非嵌套页面
            url: '/commodity',
            templateUrl: 'src/page/commodity.html'
        })
}]);
```

## $Scope 作用域
Angular中，scope起媒介的作用，将view视图（页面结构）、controller控制器（业务逻辑代码）和model模型（数据）链接起来，controller可以通过改变model控制view，也可以通过改变view操作model。

* scope 可以嵌套，内层scope可以访问外层scope对象，同层scope之间互不影响，下图为商家WEB端首页的scope作用域视图：
![scope](/img/angular.png)
 
* 以下是商家WEB端首页的页面结构：

```javascript
<div ng-controller="rootCtrl">
    ...
    <div ng-controller="shortCutCtrl">
        ...
    </div>
    <div ng-controller="accountCtrl">
        ...
    </div>
    <div ng-controller="financeCtrl">
        ...
    </div>
</div>
```

**通过给标签添加ng-controller，声明该controller的控制区域，与此同时，该区域的scope对象自动生成，可在页面直接调用scope中的方法和对象，最外层的scope中可以存放全局方法/变量（商家名称，ID之类）以便子层controller可以方便调用。**

## Controller 控制器
### 使用方法
* 声明业务模块：

```javascript
var business = angular.module("business", []);
```

* 声明controller：

```javascript
business.controller('recharge',['$scope','$http',function($scope,$http){    //$scope一定要有，如没有数据请求，可不加$http服务
    $scope.active = true;    
    $scope.rechargeIntegral = function(){
        $http.get(''+$api_url+'businessStore!cashAccountRechargeIntegral.do?_id='+parseInt(Math.random()*100000), {
            params: {
                cash: $scope.integral / 10,
                integral: $scope.integral
            }  
        }).success(function(data) { 
            if(data.status){layer.msg(data.msg);return;} 
            layer.msg("充值成功")
            $scope.root.cash -= ($scope.integral / 10);
            $scope.root.integral += $scope.integral;
        }).error(function(){});  
    }
}])
```

* html调用

```html
<div>
	<div ng-show="active">    //$scope.active 为 true 时显示
	        <input type="number" placeholder="请输入充值积分" ng-model="integral">    //ng-model：与$scope.integral 双向数据绑定
		<p>
			<span>积分余额</span>
			<span>{{root.integral | number:1}}</span> 积分    //root.integral：调用最外层根scope变量
		</p>
		<p>
			<span>需支付</span>
			<span>{{integral/10 || 0}}</span> 元
		</p>
		<button ng-click="rechargeIntegral()">确定充值</button>    //调用$scope.rechargeIntegral()方法
	</div>
	<div ng-hide="active" >     //$scope.active 为 true时隐藏
		功能维护中...
	</div>
</div>
```