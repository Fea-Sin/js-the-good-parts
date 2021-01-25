
## 第五章 继承

大多数编程语言中，继承都是一个重要的主题。

在那些基于类的语言（比如Java）中，继承（inheritance或extends）提供了两个有用的服务。
首先，它是代码重用的一种形式。如果一个新的类与一个已经存在的类大部分相似，那么你只需
具体说明其不同点即可。代码重用的模式极为重要，因为它们可以显著地减少软件开发的成本。类继承
的另一个好处是引入了一套类型系统的规范。由于程序员无需编写显式类型转换的代码，他们的工作量
将大大减轻，这是一件很好的事情，因为类型转换会丧失类型系统在安全上的优势。

JavaScript是一门弱类型语言，从不需要类型转换。对象继承关系变得无关紧要，对于一个对象来说
重要的是它能做什么，而不是它从哪里来。

JavaScript提供了一套更为丰富的代码重用模式。它可以模拟那些基于类的模式，同时它也可以支持
其他更具表现力的模式。在JavaScript中可能的继承模式有很多。在本章中，我们将研究几种最为
直接的模式。当然还有很多更为复杂的构造模式，但保持简单通常是最好的。

在基于类的语言中，对象是类的实例，并且类可以从另一个类继承。JavaScript是一门基于原型的语言，
这意味着对象直接从其他对象继承。

### 伪类

JavaScript的原型存在着诸多矛盾。它的某些复杂的语法看起来就像是基于类的语言，这写语法问题掩盖了
它的原型机制。它不直接让对象从其他对象继承，反而插入了一个多余的间接层：通过构造器函数产生对象。
当一个函数对象被创建时，Function构造器产生的函数对象会运行类似这样的一些代码
```
this.prototype = { constructor: this };
```
新函数对象被赋予一个prototype属性，它的值是一个包含constructor属性且属性值为该新函数的对象。
这个prototype对象是存放继承特征的地方。因为JavaScript语言没有提供一种方法去确定哪个函数是打算
来做构造器的，所以每个函数都会得到一个prototype对象。constructor属性没什么用，重要的是
prototype对象。

当采用构造器调用模式，即用new前缀去调用一个函数时，函数执行的方法会被修改。如果new运算符是一个
方法而不是一个运算符，它可能会像这样执行：
```
Function.method('new', function() {
  // 创建一个新对象，它继承自构造器函数的原型对象
  var that = Object.create(this.prototype);

  // 调用构造器函数，绑定this到新对象上
  var other = this.apply(that, arguments)

  // 如果它的返回值不是一个对象，就返回该新对象
  return (typeof other === 'object' && other) || that;
})
```

我们可以定义一个构造器并扩充它的原型
```
var Mammal = function(name) {
  this.name = name;
}
Mammal.prototype.get_name = function() {
  return this.name;
}
Mammal.prototype.says = function() {
  return this.saying || '';
}
```
现在，我们可以构造一个实例
```
var myMammal = new Mammal('Herb the Mammal');
var name = myMammal.get_name();  // 'Herb the Mammal'
```

我们可以构造另一个伪类来继承Mammal，这是通过定义它的constructor函数并替换它的
prototype为一个Mammal的实例来实现的
```
var Cat = function(name) {
  this.name = name;
  this.saying = 'meow'
}

// 替换Cat.prototype 为一个新的Mammal实例
Cat.prototype = new Mammal();

// 扩充新原型对象，增加purr和get_name方法
Cat.prototype.purr = function(n) {
  var i, s = '';
  for (i = 0; i < n; i++) {
    if (s) {
      s += '-';
    }
    s += 'r';
  }
  return s;
}
Cat.prototype.get_name = function() {
  return this.says() + ' ' + this.name + ' ' + this.says();
}
var myCat = new Cat('Henrietta');
var says = myCat.says(); // 'meow'
var purr = myCat.purr(5); // 'r-r-r-r-r'
var name = myCat.get_name(); // 'meow Henrietta meow'
```

伪类模式本意是想向对象靠拢，但它看起来格格不入。我们可以隐藏一些丑陋的细节，通过
使用method方法来定义一个inherits方法实现。
```
Function.method('inherits', function(Parent) {
  this.prototype = new Parent();
  return this;
})
```
我们的inherits和method方法都返回this，这样允许我们可以采用级联的形式编程。
现在可以只用一行语句构造我们的Cat对象
```
var Cat = function(name) {
  this.name = name;
  this.saying = 'meow';
}
.inherits(Mammal)
.method('purr', function(n) {
  var i, s = '';
  for (i = 0; i < n; i++) {
    if (s) {
      s += '-';
    }
    s += 'r';
  }
  return s;
})
.method('get_name', function() {
  return this.says() + ' ' + this.name + ' ' + this.says();
})
```
