
## 函数

JavaScript设计得最出色得就是它的函数实现。它几乎接近于完美。但是想必你也能预料到，
JavaScript的函数也存在瑕疵。

函数包含一组语句，它们是JavaScript的基础模块单元，用于代码复用、信息隐藏和组合调用。
函数用于指定对象的行为。一般说来，所谓编程，就是将一组需求分解成一组函数与数据结构的技能。

### 函数对象

JavaScript中的函数就是对象。对象是"名/值"对的集合并拥有一个连到原型对象的隐藏连接。对象字面量
产生的对象连接到Object.prototype。函数对象连接到Function.prototype(该原型对象本身连接到
Object.prototype)。每个函数在创建时会附加两个隐藏属性，函数的上下文和实现函数行为代码。
JavaScript创建一个函数对象时，会给该对象设置一个"调用"属性。当JavaScript调用一个函数时，
可理解为调用此函数的"调用"属性。

每个函数对象在创建时也随配有一个prototype属性。它的值是一个拥有constructor属性且值即为该函数
的对象。这和隐藏连接到Function.prototype完全不同。这个令人费解的构造过程的意义将会在下个章节
中揭示。

因为函数是对象，所以它们可以像任何其他的值一样被使用。函数可以保存在变量、对象和数组中。函数可以
被当作参数传递给其他函数，函数也可以再返回函数。而且，因为函数是对象，所以函数可以拥有方法。

函数的与众不同之处在于它们可以被调用。

### 函数字面量

函数对象通过函数字面量来创建。创建一个名为add的变量，并用来把两个数字相加的函数赋值给它
```
var add = function(a, b) {
  return a + b;
};
```
函数字面量包括4个部分。第1个部分是保留字function。
第2个部分是函数名，它可以被省略。函数可以用它的名字来递归地调用自己。此名字也能被调试器和开发
工具用来识别函数。如果没有给函数命名，比如上面这个例子，它被称为匿名函数（anonymous）。

函数的第3部分是包围在圆括号中的一组参数。多个参数用逗号分隔。这些参数的名称将被定义为函数中的
变量。它们不像普通的变量那样将被初始化为undefined，而是在该函数被调用时初始化为实际提供的参数值。

第4部分是包围在花括号中的一组语句。这些语句是函数的主体，它们在函数被调用时执行。

函数字面量可以出现在任何允许表达式出现的地方。函数也可以被定义在其他函数中。一个内部
函数除了可以访问自己的参数和变量，同时它也能自由访问把它嵌套在其中的父函数的参数和变量。
通过函数字面量创建的函数对象包含一个连到外部上下文的连接。这被称为闭包（closure）。
它是JavaScript强大表现力的来源。

### 调用

调用一个函数会暂停当前函数的执行，传递控制权和参数给新函数。除了声明时定义的形式参数，每个函数
还接收两个附加的参数，this和arguments。参数this在面向对象编程中非常重要，它的值取决于调用
的模式。在JavaScript中一共有4种调用模式，方法调用模式、函数调用模式、构造器调用模式和
apply调用模式。这些模式在如何初始化关键参数this上存在差异。

调用运算符是跟在任何产生一个函数值的表达式之后的一对圆括号。圆括号内可包含零个或多个用逗号隔开的
表达式。每个表达式产生一个参数值。每个参数值被赋予函数声明时定义的形式参数名。当实际参数（arguments）的个数
与形式参数（parameters）的个数不匹配时，不会导致运行时错误。如果实际参数值过多了，超出的参数
值会被忽略。如果实际参数值过少，缺失的值会被替换为undefined。对参数值不会进行类型检查，任何类型
的值都可以被传递任何参数。

### 方法调用模式

当一个函数被保存为对象一个属性时，我们称它为一个方法。当一个方法被调用时，this被绑定到该对象。
如果调用表达式包含一个提取属性的动作（即包含一个`.`点表达式或`[]`下标表达式），那么它就是被当作一个方法来调用。
```
var myObject = {
  value: 0,
  increment: function(inc) {
    this.value += typeof inc === 'number' ? inc : 1;
  }
};

myObject.increment();
document.writeln(myObject.value);  // 1
myObject.increment(2);
document.writeln(myObject.value);  // 3
```
方法可以使用this访问自己所属的对象，所以它能从对象中取值或对对象进行修改。
this到对象的绑定发生在调用的时候。这个"超级"延迟绑定（very late binging）使得函数可以对this
高度复用。通过this可取得它们所属对象的上下文的方法称为公共方法（public method）。

### 函数调用模式

当一个函数并非一个对象的属性时，那么它就是被当做一个函数来调用的
```
var sum = add(3, 4) // 7
```
以此模式调用函数时，this被绑定到全局对象。这是语言设计上的一个错误。倘若语言设计正确，那么当内部函数被
调用时，this应该仍然绑定到外部函数的this变量。这个设计错误的后果就是方法不能利用内部函数来帮助它工作，
因为内部函数的this被绑定了错误的值，所以不能共享该方法对对象的访问权。幸运的是，有一个很容易的解决方案，
如果该方法定义一个变量并给它赋值为this，那么内部函数就可以通过那个变量访问到this。按照约定，我们
把那个变量命名为that。
```
myObject.double = function() {
  var that = this;

  var helper = function() {
    that.value = add(that.value, that.value);
  };

  helper();
};

myObject.double();
document.writeln(myObject.value);  // 6
```

### 构造器调用模式

JavaScript是一门基于原型继承的语言。这意味着对象可以直接从其他对象继承属性。该语言是无类型的。

这偏离了当今编程语言的主流风格。当今大多数语言都是基于类的语言。尽管原型继承极富表现力，但它并未
被广泛理解。JavaScript本身对它原型的本质也缺乏信息，所以它提供了一套和基于类的语言类似的对象
构建语法。有类型化语言编程经验的程序员们很少有愿意接受原型继承的，并且认为借鉴类型化语言的语法糖
模糊了这门语言真实的原型继承本质。真实两边不讨好。

如果在一个函数前面带上new来调用，那么背地里将会创建一个连接到该函数的prototype成员的新对象，
同时this会被绑定到那个新对象上。

new前缀也会改变return语句的行为。
```
// 创建一个名为Quo的构造器函数，它构造一个带有status属性的对象
var Quo = function(string) {
  this.status = string;
};

// 给Quo的所有实例提供一个名为get_status的公共方法
Quo.prototype.get_status = function() {
  return this.status;
}

// 构造一个Quo实例
var myQuo = new Quo("confused");
document.writeln(myQuo.get_status());  // 打印显示 "confused"
```

一个函数，如果创建的目的就是希望结合new前缀来调用，那它就被称为构造函数。按照约定，它们保存在以
大写格式命名的变量里。如果调用构造函数时没有在前面加上new，可能会发生非常糟糕的事情，既没有
编译时警告，也没有运行时警告，所以大写约定非常重要。

我不推荐使用这种形式的构造器函数。在下一章我们会看到更好的替代方式。

### Apply 调用模式

因为JavaScript是一门函数式的面向对象编程语言，所以函数可以拥有方法。

apply方法让我们构建一个参数数组传递给调用函数。它也允许选择this的值。apply方法接收两个参数，
第1个是要绑定给this的值，第2个就是一个参数数组。
```
var array = [3, 4];
var sum = add.apply(null, array) // sum 值是7
```

```
// 构造一个包含status成员的对象
var statusObject = {
  status: 'A-OK'
}

var status = Quo.prototype.get_status.apply(statusObject); // status 是'A-OK'
```

### 参数

当函数被调用时，会得到一个"免费"配送的参数，那就是arguments数组。函数通过此参数访问所有它被
调用时传递给它的参数列表，包括那些没有被分配给函数声明定义的形式参数的多余参数。这使得编写一个
无须指定参数个数的函数成为可能。
```
var sum = function() {
  var i, sum = 0;
  for (i = 0; i < arguments.length; i++) {
    sum += arguments[i]
  }
  return sum;
}
document.writeln(sum(4, 8, 15, 16, 23, 42));  // 108
```

这不是一个特别有用的模式，我们将会看到如何给数组添加一个相似的方法来达到同样的效果。

因为语言的一个设计错误，arguments并不是一个真正的数组，它只是一个"类似数组"（array-like）
的对象。arguments拥有一个length属性，但它没有任何数组的方法。

### 返回

当一个函数被调用时，它从第一个语句开始执行，并在遇到关闭函数体的 } 时结束。然后函数把控制权
交还给调用该函数的程序。

return语句可用来使函数提前返回。当return被执行时，函数立即返回而不再执行余下的语句。

一个函数总是会返回一个值。如果没有指定返回值，则返回undefined。

如果函数调用时在前面加上了new前缀，且返回值不是一个对象，则返回this（该新对象）。

### 异常

JavaScript提供了一套异常处理机制。异常是干扰程序的正常流程的不寻常（但并非完全是出乎意料）
的事故。当发现这样的事故时，你的程序应该抛出一个异常。
```
var add = function(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw {
      name: 'TypeError',
      message: 'add needs numbers'
    };
    return a + b;
  }
}
```
throw语句中断函数的执行，它应该抛出一个exception对象，该对象包含一个用来识别异常类型的 name 属性
和一个描述性的message属性。你也可以添加其他的属性。

该exception对象将被传递到一个try语句的catch从句
```
var try_it = function() {
  try {
    add("seven");
  } catch(e) {
    document.writeln(e.name + ': ' + e.message);
  }
};

try_it();
```
如果在try代码块内抛出了一个异常，控制权就会跳转到它的catch从句。

一个try语句只会有一个捕获所有异常的catch代码块。如果你的处理手段取决于异常的类型，
那么异常处理器必须检查异常对象的name属性来确定异常的类型。

### 扩展类型的功能

JavaScript允许给语言的基本类型扩充功能。我们已经看到，通过给Object.prototype添加
方法，可以让该方法对所有对象都可用。这样的方式对函数、数组、字符串、数字、正则表达式和布尔值
同样适用。

举例来说，我们可以通过给Function.prototype增加方法来使得该方法对所有函数可用
```
Function.prototype.method = function(name, func) {
  if (!this.prototype[name]) {
    this.prototype[name] = func;
  }
  return this;
}
```

通过给Function.prototype增加一个method方法，我们下次给对象增加方法的时候就不必键入
prototype这几个字符，省掉一点麻烦。

JavaScript没有专门的整数类型，但有时候确实只需要提取数字中的整数部分。JavaScript本身提供的
取整方法有些丑陋。我们可以通过给Number.prototye增加一个integer方法来改善它。它会根据数字的
正负来判断是使用Math.ceiling还是Math.floor。

[实例1](jb.js)

通过给基本类型增加方法，我们可以极大地提高语言的表现力。因为JavaScript原型链继承的动态本质，
新的方法立刻被赋予到所有的对象实例上，哪怕对象实例是在方法被增加之前就创建好了。

基本类型的原型是公用结构，所以在类库混用时务必小心。一个保险的做法就是只在确定没有该方法
时才添加它。




