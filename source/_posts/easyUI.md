---
title: easyUI使用心得
date: 2016-08-31 18:18:58
tags:
    - easyUI
---


## easyUI渲染方式（html&js二者只能选其一）

### 渲染遇到的坑啊，<span style="background:yellow">attention！！！</span>

关于问题：
Q：为什么只能二者选其一？
A：就是两种渲染方式其实是一样，如果两种都使用，就重复了。

我自己的坑：
Q：用html的方式渲染了之后，用js的方式操作添加（add）等方法，**会出现js写的方法里的出不来甚至报错**！
A：这是因为，js是异步的，可能是在html方式渲染之前就已经执行了js的代码（是要渲染后才能执行的），所以就会出现显示不出来或报错问题！

可以做个试验检验：用下面代码加上这里，加个定时器，就可以进行检验
```javascript
setTimeout(function() {
    $('#tt').tabs('add', {
        title: 'New Tab',
        content: 'Tab Body',
        closable: true,
        tools: [{
            iconCls: 'icon-mini-refresh',
            handler: function() {
                alert('refresh');
            }
        }] 
    });
}, 5000);
```
<!--more-->

### 使用html(class)渲染：（class='easyui-tabs'）

1. 标题使用：**title='myTitle'**
2. 其他属性就放在自定义标签：**data-options=' '** 里
3. 样式用：**style**设置

例子如下：
```javascript
 <div id="tt" class="easyui-tabs" style="width:400px;height:250px;">
    <div title="Home" data-options="iconCls:'icon-add'">
    </div>
    <div title="Home" data-options="iconCls:'icon-edit'">
    </div>
    <div title="Home" data-options="closable:true">
    </div>
 </div>
```
### 使用js方式渲染 （$('#tt').tabs();）

- 初始化方式： **$('#tt').tabs();**，才能使用组件相应的方法

## 组件学习问题

### tree组件

> tree 用url:'treeData.json' 渲染数据用下面的方式不成功？

```javascript
$('#tree-demo').tree({
    url:'treeData.json'
});
```

treeData.json数据
```javascript
[{
    "id": 1,
    "text": "Node 1",
    "state": "closed",
    "children": [{
    "id": 11,
    "text": "Node 11"
},{
    "id": 12,
    "text": "Node 12"
    }]
},{
    "id": 2,
    "text": "Node 2",
    "state": "closed"
}]
```

### 表格封装

通常用easyUI的datagrid都是这样的~~~
columns里都是带一片的重复的表格的key值~，要是数据一多起来，那重复的东西就更加多、、、
```javascript
$('#tv').datagrid({  
    url:null,  
    ...,
    columns: [
        [{
            field: 'no',
            title: '订单号',
            width: 100
        }, {
            field: 'payType',
            title: '支付方式'
        }]
    ]
});
```
要是能封装成这个样子，就完美啦~\(≧▽≦)/~啦啦啦，用数据的形式表示~就完美啦
```javascript
$('#tv').datagrid({  
    url:null,  
    ...,
    columns: [
        [[
           'no',
           '订单号',
           100
        ],[
            'payType',
            '支付方式'
        ]]
    ]
});
```
所以就有了下面的封装方法，写了个函数方便调用。
colValue就是我们上面简化掉要传的参。

colKey是可以根据你当前datagrid需要的值进行设置，比如说，有些列时需要formatter方法的，可以传入`var colKey = ['field', 'title', 'formatter']`
我这里是根据项目需要，初始化colKey。
```javascript
// col的key和value值封装
function transM(colValue, colKey) {
    if(!colKey) {
        colKey = ['field', 'title', 'width'];
    }
    var result = colValue.map(function(oneItem) {
        return colKey.reduce(function(res, twoItem, i) {
            oneItem[i] && (res[twoItem] = oneItem[i]);
            return res;
        }, {});
    });
    return result;
}
```
<!-- more -->

最后举个栗子：
```javascript
var colValue = [
    [
        'no',
        '订单号',
        function() { alert('my name is tv'); }
    ],
    [
        'payType',
        '支付方式'
    ]
];
var colKey = ['field', 'title', 'formatter'];

var cols =transM(colValue, colKey);

$('#tv').datagrid({  
    url:null,  
    ...,
    columns: [
        cols
    ]
});
```

## 遇到最大的坑，重点！！！（关于easyUI datagrid 表格数据加载问题）

在easyUI给的官方文档里提及，easyUI datagrid加载数据的方式只有两种。
1. 第一种是通过ajax加载相应url返回的json数据；
2. 第二种是加载js对象，就是使用loadDate方法

> url方式加载数据

结合上面所说，可以通过两种方式进行调用

- html

```html
<table id="tv" style="width:700px;height:auto" title="DataGrid" idField="itemid" url="datagridData.json">
```

- javascript

```javascript 
$('#tv').datagrid({  
    url:'datagridData.json'  
});  
```

| 方法          |  使用须知                                   |
| ------------:| -----------------------------------------------------------------------------------------------------:|
| load         |  加载第一页数据，param将代替默认查询参数，注意的是该方法只适用于url方式.                                     |
| reload       |  刷新当前页数据，与load方法不同的时候reload方法刷新当前页数据，而load方法会跳到第一页然后刷新.                 |
| options      |  获取datagrid实例的各项参数值，常用的参数有url,pageNumber,pageSize这三个参数在请求数据以及分页功能中起重要作用.|

查找资料的时候，网上有提及**二次加载问题**，可是在开发的时候没遇到，但是还是提一下，记录记录。

使用url的方式，可能会遇到重复请求问题，这问题根本原因是因为<span style="color:red">多次渲染组件</span>，至于为啥会这样还要深究。知道的小伙伴可以聊聊~据说使用下面两点就可以基本防止二次加载

- **使用load和reload函数去动态加载数据，而不是选择再次渲染组件。** 一般再次渲染组件的目的仅仅是为了设置url，这得不偿失，url的设置可以通过options的方法获取到组件实例的opts，然后在给opts.url重新赋值；
- **class方式注册组件和javascript注册方式不要同时使用。** class注册方式一般是为了初始化属性，javascript方式则属性和事件都可初始化，但是不管是class方式还是javascipt方式注册组件，每次注册，只要被设置过url属性就会做请求。所以在不可避免要使用javascript方式注册的情况下，索性就不要使用class方式注册了。

> 加载本地数据方式

加载本地数据，我所理解的就是直接在datagrid的rows里面写json数据，或者是通过异步方式获取数据

- 调用方式

不用设置url或者是把url设置为null，然后使用datagrid的loadData方法加载js数据对象，这个对象包括两个属性，一个是记录总数，另一个是当前页码的对象数组。

```javascript
var obj = {'total':100,'rows':[{id:'1',name:'张三'},{id:'2',name:'李四'}]};  
$('#tv').datagrid('loadData',obj);  
```

- 如何分页 （分页是个大问题~）

看了下文档，才知道datagrid还有分页的Pagination对象，然后通过写Pagination对象的onSelectPage事件来实现分页。（因为之前都是直接使用。。。）
更深入的可以参考[jQuery easyui datagrid 非URL后台分页](http://www.easyui.info/archives/17.html)
```javascript
//初始化dategrid  
$('#tv').datagrid({  
    url:null,  
    pagination:true,  
    pageSize:20,  
    pageNumber:1,  
    rownumbers:true 
});  
$('#tv').datagrid('getPager').pagination({  
    displayMsg:'当前显示从 [{from}] 到 [{to}] 共[{total}]条记录',  
    onSelectPage : function(pPageIndex, pPageSize) {  
        //改变opts.pageNumber和opts.pageSize的参数值，用于下次查询传给数据层查询指定页码的数据  
        var gridOpts = $('#tt').datagrid('options');  
        gridOpts.pageNumber = pPageIndex;  
        gridOpts.pageSize = pPageSize;    
        //定义查询条件  
        var queryCondition = {name:"张三"};  
        //异步获取数据到javascript对象，入参为查询条件和页码信息  
        var oData = getAjaxDate("orderManageBuz","qryWorkOrderPaged",queryCondition,gridOpts);  
        //使用loadDate方法加载Dao层返回的数据  
        $('#tt').datagrid('loadData',{"total" : oData.page.recordCount,"rows" : oData.data});  
    }  
});  
```
这是之前项目遇到的写的。。。
```javascript
$('#tv').datagrid('getPager').pagination({
    displayMsg: '显示  {from} 到  {to} ，共 {total} 条记录',
    onSelectPage: function(pPageIndex, pPageSize) {
    //改变opts.pageNumber和opts.pageSize的参数值，用于下次查询传给数据层查询指定页码的数据   
    var gridOpts = $('#tv').datagrid('options');
    var formData = {
        startDate: '2016-06-01',
        endDate: '2016-07-01',
        pages: pPageIndex,
        total: pPageSize
    } 
    $.ajax({
        type: "get",
        url: '' + $api_url + 'youyoubackstage!getAddIntegralLog.do',
        data: _form ? formData : '',
        dataType: 'json',
        success: function(data) {
            listData = data;
            $('#statisticsUYiU').datagrid('loadData', {
                    "total": listData.total,
                    "rows": listData.rows.object
                });
                $('#sum').html(listData.rows.sum);
                $('#tv').datagrid('reload');
            }
        });
    }
});
```

## 注意事项

1. 关闭图标显示——是用方法**closable:true;**，而不是用设置图标样式~~iconCls:icon-close~~，这样是错的
2. 图标位置，用iconCls添加的图标是在左边的，而用tools:[{iconCls:''}]方式添加的是在右边的
3. 用html渲染layout布局的时候，要在最外层**定义style的宽高**，不定义高，不会显示出来！！！

>  Q: 需要添加上method:post|get，才不会出现报错。
但是只能用get方法，用post方法（默认方法）就会出错，为啥？

A:  easyUI 有很多url默认是post方式，有的服务器是**不支持向静态文本post的**（所以用浏览器看显示的错误是405错误），所以，解决方法就是改成method:get.**method="get"(html里这样)，method:get(js里这样)**

> 关于HTTP 405错误 —— 方法不被允许（method not allowed）


![http 405](/img/easyUI.png)