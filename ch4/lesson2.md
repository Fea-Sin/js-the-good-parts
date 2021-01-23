

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

我们可以使用函数和闭包来构造模块。模块是一个提供接口却隐藏状态与实现的函数或对象。
通过使用函数产生模块，我们几乎可以完全摒弃全局变量的使用，从而缓解这JavaScript的最
为糟糕的特性之一带来的影响。

举例来说，假定我们想要给String增加一个deentityify方法。它的任务是寻找字符串中的
HTML字符实体并把它们替换为对应的字符。这就需要在一个对象中保存字符实体的名字和
它们对应的字符。但我们该在哪里保存这个对象呢？我们可以把它放到一个全局变量中，
但全局变量是魔鬼。我们可以把它定义在该函数的内部，但是那样会带来运行时的损耗，因为
每次执行该函数的时候该字面量都会被求值一次。理想的方式是把它放入一个闭包，而且
也许还能提供一个增加更多字符实体的扩展方法。

```
String.method('deentityify', function() {
  // 字符实体表，它映射字符实体的名字到对应的字符
  var entity = {
    quot: '"',
    lt: '<',
    gt: '>'
  }

  // 返回deenityify方法
  return function() {
    return this.replace(/&([^&;]+);/g,
      function(a, b) {
        var r = entity[b];
        return typeof r === 'string' ? r : a;
      }
    );
  };
}());
```
请注意最后一行，我们用()运算符立刻调用我们刚刚构造出来的函数。这调用所创建并
返回的函数才是deenityify方法。
```
document.writeln('&lt;&quo;&gt'.deenityify());  // <">
```

模块模式利用了函数作用域和闭包来创建被绑定对象与私有成员的关联，在这个例子中，只有
deentityity方法有权访问字符实体这个数据对象。

模块模式的一般形式是，一个定义了私有变量和函数的函数，利用闭包创建可以访问私有变量和函数
的特权函数，最后返回这个特权函数，或者把它们保存到一个可访问到的地方。

使用模块模式就可以摒弃全局变量的使用。它促使了信息隐藏和其他优秀的设计实践。对于应用
程序的封装，或者构造其他单例对象，模块模式非常有效。
模块模式通常集合单例模式（Singleton Pattern）使用。JavaScript的单例就是用对象字面量
表示法创建个对象，对象的属性值可以是数值或函数，并且属性值在该对象的生命周期中不会发生变化。
它通常作为工具为程序其他部分提供功能支持。

模块模式也可以用来产生安全的对象。假定我们想要构造一个用来产生序列号的对象
```
var serial_maker = function() {
  var prefix = '';
  var seq = 0;

  return {
    set_prefix: function(p) {
      prefix = String(p);
    },
    set_seq: function(s) {
      seq = s;
    },
    gensym: function() {
      var result = prefix + seq;
      seq += 1;
      return result;
    }
  }
}

var seqer = serial_maker();
seqer.set_prefix('Q');
seqer.set_seq(1000);
var unique = seqer.gensym();   // unique 是 'Q1000'
```

seqer包含的方法都没有用到this或that，因此没有办法损害seqer。除非调用对应的法法，
否则没办法改变prefix或seq的值。seqer对象是可变的，所以它的方法可能会被替换掉，
但替换后的方法依然不能访问私有成员。seqer就是一个组函数的集合，而且那些函数被授予
特权，拥有使用或修改私有状态的能力。

如果我们把seqer.gensym作为一个值传递给第三方函数，那个函数能用它产生唯一字符串，
但却不能通过它来改变prefix或seq的值。

### 级联

有一些方法没有返回值。例如，一些设置或修改对象的某个状态却不返回任何值的方法就是
典型的例子。如果我们让这些方法返回this而不是undefined，就可以启用级联。在一个
级联中，我们可以在单独一条语句中以此调用同一个对象的很多方法。一个启用级联的
Ajax类库可能允许我们以这样的形式去编码
```
getElement('myBoxDiv')
  .move(350, 150)
  .width(100)
  .height(100)
  .color('red')
  .border('10px outset')
  .padding('4px')
  .appendText('Please stand by')
  .on('mousedown', function(m) {
    this.startDrag(m, this.getNinth(m));
  })
  .on('mousemove', 'drag')
  .on('mouseup', 'stopDrag')
  .later(2000, function() {
    this
      .color('yellow')
      .setHTMML('What hath God wraught?')
      .slide(400, 40, 200, 200);
  })
  .tip('This box is resizeable');
```

在这个例子中，getElement函数产生一个对应于id="myBoxDix"的DOM元素且给其注入了其他
功能的对象。该方法允许我们移动元素，修改它的尺寸和样式，并添加行为。这些方法每一个都返回
该对象，所以每次调用返回的结果可以被下一次调用所用。

级联技术可以产生出极富表现力的接口。它也能给那波构造全能接口的热潮降降温，
一个接口没必要一次做太多事情。

### 柯里化

柯里化，也常译为"局部套用"，是把多参数函数转换为一系列单参数函数并进行调用的技术。这项技术以
数学家Haskell Curry（Haskell编程语言也是以该数学家命名）

函数也是值，从而我们可以用有趣的方式去操作函数值。柯里化允许我们把函数与传递给它的参数相结合，
产生出一个新的函数。
```
var add1 = add.curry(1);
document.writeln(add1(6));  // 7
```
add1是把1传递给add函数的curry方法后创建的一个函数。add1函数把传递给它的参数的值加1。
JavaScript并没有curry方法，但我们可以给Function.prototype扩展此功能
```
Function.method('curry', function() {
  var args = arguments, that = this;
  return function() {
    return that.apply(null, args.concat(arguments));
  }
})
```

curry方法通过创建一个保存着原始函数和被套用的参数的闭包来工作。它返回另一个函数，该函数被调用时，
会返回调用原始函数的结果，并传递调用curry时的参数加上当前调用的参数。它使用Array的concat方法
连接两个参数数组。

糟糕的是，就像我们先前看到的那样，arguments数组并非是一个真正的数组，所以它并没有concat方法。
要避开这个问题，我们必须在两个arguments数组上应用数组的slice方法。这样产生出拥有concat方法
的常规数组。
```
Function.method('curry', function() {
  var slice = Array.prototype.slice,
      args = slice.apply(arguemnts),
      that = this;
      return function() {
        return that.apply(null, args.concat(slice.apply(arguments)));
      }
})
```

### 记忆

函数可以将先前操作的结果记录在某个对象里，从而避免无谓的重复计算。这种优化被称为
记忆（memoization）。JavaScript的对象和数组要实现这种优化是非常方便的。

比如说，我们想要一个递归函数来计算Fibonacci数列。一个Fibonacci数字是之前两个
Fibonacci数字之和。最前面的两个数字是0和1
```
var fibonacci = function(n) {
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
}

for (var i = 0; i <= 10; i++) {
  document.writeln('// ' + i + ': ' + fibonacci(i))
}
```
这样是可以工作的，但它做了很多无谓的工作。fibonacci函数被调用了453次。我们调用了11次，
而它自身调用了442次去计算可能已被刚计算过的值。如果我们让函数具备记忆功能，就可以显著
地减少运算量。

var fibonacci = function() {
  var memo = [0, 1];
  var fib = function(n) {
    var result = memo[n];
    if (typeof result !== 'number') {
      result = fib(n-1) + fib(n-2);
      memo[n] = result;
    }
    return result;
  }
  return fib;
}();

这个函数返回同样的结果，但它只被调用了29次。我们调用了它11次，它调用了自己18次
去取得之前存储的结果。

在计算机领域，记忆（memoization）是主要用于加速程序计算的一种优化技术，它使得
函数避免重复演算之前已被处理的输入，而返回已缓存的结果。

我们可以把这种技术推而广之，编写一个函数来帮助我们构造带记忆功能的函数。memoizer
函数取得一个初始的memo数组和formula函数。它返回一个管理memo存储和在需要时调用
formula函数的recur函数。我们把这个recur函数和它的参数传递给formula函数
```
var memoizer = function(memo, formula) {
  var recur = function(n) {
    var result = memo[n];
    if (typeof result !== 'number') {
      result = formula(recur, n);
      memo[n] = result;
    }
    return result;
  }
  return recur;
}
```
现在，我们用memoizer函数来定义fibonacci函数，提供其初始的memo数组和formula函数
```
var fibonacci = memoizer([0, 1], function(recur, n){
  return recur(n-1) + recur[n-2];
});
```

通过设计这种产生另一个函数的函数，极大地减少了我们的工作量。









