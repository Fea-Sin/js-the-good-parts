

### 递归

递归函数就是会直接或间接地调用自身的一种函数。递归是一种强大的编程技术，它把一个问题分解为
一组相似的子问题，每一个都用一个寻常解去解决。一般来说，一个递归函数调用自身去解决它的子问题。

递归函数可以非常高效地操作树形结构，比如浏览器端的文档对象模型（DOM）。每次递归调用时处理
指定的树的一小段。

```
var walk_the_DOM = function walk(node, func) {
  func(node);
  node = node.firstChild;
  while(node) {
    walk(node, func);
    node = node.nextSibling();
  }
}
```

调用walk_the_DOM，查找对应属性名称的节点
```
var getElementsByAttribute = function(att, value) {
  var results = [];

  walk_the_DOM(document.body, function(node) {
    var actual = node.nodeType === 1 && node.getArribute(att);
    if (typeof actual === 'string' &&
        (actual === value || typeof value !== 'string'))
      results.push(node);
  })

  return results;
}
```

一些语言提供了尾递归（tail recursion 是一种在函数的最后执行递归调用语句的特殊形式的递归）优化。
这意味着如果一个函数返回自身递归的结果，那么调用的过程会被替换为一个循环，它可以显著提高速度。
遗憾的是，JavaScript当前并没有提供尾递归优化。深度递归的函数可能会因为堆栈溢出而运行失败。

构建一个尾递归的函数
```
var factorial = function factorial(i, a) {
  a = a || 1;
  if (i < 2) {
    return a;
  }
  return factorial(i - 1, a * 1);
}

document.writeln(factorial(4));   // 24
```

### 作用域

在编程语言中，作用域控制着变量和参数的可见性及生命周期。对程序员来说这是一项重要的服务，
因为它减少了名称冲突，并且提供了自动内存管理。

大多数类C语言语法的语言都拥有块级作用域。在一个代码块中（括在一个对花括号中的一组语句）
定义的所有变量在代码的外部是不可见的。定义在代码块中的变量在代码块执行结束后会被释放掉。
这是件好事。

糟糕的是，尽管JavaScript的代码块语法貌似支持块级作用域，但实际上JavaScript并不支持。
这个混淆支持可能成为错误之源。

JavaScript确实有函数作用域。那意味着在函数中的参数和变量在函数外部是不可见的，而在一个函数
内部任何位置定义的变量，在该函数内部任何地方都可见。

很多现代语言都推荐尽可能延迟声明变量。而用在JavaScript上的话会成为糟糕的建议，因为它缺少块级
作用域。所以，最好的做法是在函数体的顶部声明函数中可能用到的所有变量。

### 闭包

作用域的好处是内部函数可以访问定义它们的外部函数的参数和变量（除了this和arguments）。这太美妙了。

一个更有趣的情形是内部函数拥有比它的外部函数更长的生命周期。

我们通过调用一个函数的形式去初始化myObject，该函数会返回一个对象字面量。函数里定义一个value变量。
该变量对increment和getValue方法总是可用的，但函数的作用域使得它对其他的程序来说是不可见的。

```
var myObject = (function() {
  var value = 0;

  return {
    increment: function(inc) {
      value += typeof inc === 'number' ? inc : 1;
    },
    getValue: function() {
      return value;
    }
  }
}());
```

构造一个函数，用正确的方式给一个数组中的节点设置事件处理程序，点击一个节点，将会弹出一个对话框显示节点的序号
```
var add_the_handlers = function(nodes) {
  var i;
  var helper = function(i) {
    return function(e) {
      console.log(i)
    }
  };
  for (i = 0; i < nodes.length; i++) {
    nodes[i].onclick = helper(i);
  }

}
```

我们可以先在循环之外创建一个辅助函数，让这个辅助函数再返回一个绑定了当前i值的函数。

### 模块






