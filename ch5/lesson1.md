
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

通过隐藏那些无所谓的prototype操作细节，现在它看起来没那么怪异了。但是否真的有所
改善呢？我们现在有了行为像类的构造器，但仔细看它们，你会发现，没有私有环境，所有的
属性都是公开的。无法访问super的方法。

更糟糕的是，使用构造器函数存在一个严重的危害。如果你在调用构造器时忘记了在前面
加上new前缀，那么this将不会被绑定到一个新对象上。悲剧的是，this将被绑定到全局
对象上，所以你不但没有扩充新对象，反而破坏了全局变量环境。那真是糟透了。发生那样的情况时，
既没有编译时警告，也没有运行时警告。

这是一个严重的语言设计错误。为了降低这个问题带来的风险，所有的构造器函数都约定命名成
首字母大写的形式，并且不以首字母的形式拼写任何其他的东西。这样我们至少可以通过目视检查
去发现是否缺少了new前缀。一个更好的备选方案就是根本不使用new。

"伪类"形式可以给不熟悉JavaScript的程序员提供便利，但它也隐藏了该语言的真实本质。
借鉴类的表示法可能误导程序员去编写过于深入与复杂的层次结构。许多复杂的类层次结构产生的
原因就是静态类型检查的约束。JavaScript完全摆脱了那些约束。在基于类的语言中，类继承是
代码重用的唯一方式。而JavaScript有着更多且更好的选择。

### 对象说明符

有时候，构造器要接收一大串参数。这可能令人烦恼，因为要记住参数的顺序非常困难。
在这种情况下，如果我们在编写构造器时让它接受一个简单的对象说明符，可能会更加友好。
那个对象包含了将要构建的对象规格说明。所以，与其这样写
```
var myObject = maker(f, l, m, c, s);
```
不如这么写
```
var myObject = maker({
  first: f,
  middle: m,
  last: l,
  state: s,
  city: c
})
```
现在多个参数可以按任何顺序排列，如果构造器会聪明地使用默认值，一些参数就可以忽略掉，并且代码
也更容易阅读。

### 原型

在一个纯粹的原型模式中，我们会摒弃类，转而专注于对象。基于原型的继承相比基于类的继承在概念上更为
简单，一个新对象可以继承一个旧对象的属性。也许你对此感到陌生，但它真的很容易理解。你通过构造
一个有用的对象开始，接着可以构造更多和那个对象类似的对象。这就可以完全避免把一个应用拆解成
一些列嵌套抽象类的分类过程。

让我们先用字面量去构造一个有用的对象
```
var myMammal = {
  name: 'Herb the Mammal',
  get_name: function() {
    return this.name;
  },
  says: function() {
    return this.saying || '';
  }
}
```
一旦有了一个想要的对象，我们就可以利用第3章中介绍过的Object.create方法构造器出更多
的实例来。接下来我们可以定制新的实例
```
var myCat = Object.create(myMammal);
myCat.name = 'Henrietta';
myCat.saying = 'meow';
myCat.purr = function(n) {
  var i, s = '';
  for (i = 0; i < n; i++) {
    if (s) {
      s += '-';
    }
    s += 'r';
  }
  return s;
}
myCat.get_name = function() {
  return this.says() + ' ' + this.name + ' ' + this.says();
}
```
这是一种"差异化继承"（differential inheritance）。通过定制一个新的对象，我们指明它与所基于
的基本对象的区别。


### 函数化

迄今为止，我们所看到的继承模式的一个弱点是没法保护隐私。对象的所有属性都是可见的。我们无法得到
私有变量和私有函数。有时候这样没关系，但有时候却是大麻烦。遇到这些麻烦的时候，一些无知的程序员
接受了一种伪装私有（pretend privacy）的模式。如果想构造一个私有属性，他们就给它起一个怪模怪样
的名字，并且希望其他使用代码的用户假装看不到这些奇怪的成员。幸运的是，我们有一个更好的选择，
那就是应用模块模式。

我们从构造一个生成对象的函数开始。我们以小写字母开头来命名它，因为它并不需要使用new前缀。
该函数包括4个步骤。

1）创建一个新对象。有很多的方式去构造一个对象。它可以构造一个对象字面量，或者它可以和new
前缀连用去调用一个构造函数，或者它可以使用Object.create方法去构造一个已经存在的对象的新实例，
或者它可以调用任意一个会返回一个对象的函数。

2）有选择地定义私有实例变量和方法。这些就是函数中通过var语句定义的普通变量。

3）给这个新对象扩充方法。这些方法拥有特权去访问参数，以及在第2步中通过var语句定义的变量。

4）返回那个新对象。

这里是一个函数化构造器的伪代码模版
```
var constructor = function(spec, my) {
  var that,
  其他私有实例变量;
  my = my || {};

  把共享的变量和函数添加到my中;

  that = 一个新对象;

  添加给that的特权方法;

  return that;
}
```

spec对象包含构造器需要构造一个新实例的所有信息。spec的内容可能会被复制到私有变量中，
或者被其他函数改变，或者方法可以在需要的时候方法spec的信息。

my对象是一个为继承链中的构造器提供秘密共享的容器。my对象可以选择性地使用。如果没有传入一个my对象，
那么会创建一个my对象。

接下来，声明该对象私有的实例变量和方法。通过简单地声明变量就可以做到。构造器的变量和内部函数变成了
该实例的私有成员。内部函数可以访问spec、my、that，以及其他私有变量。

接下来，给my对象添加共享的秘密成员。这是通过赋值语句来实现的
```
my.member = value;
```
现在，我们构造了一个新对象并把它赋值给that。有很多方式可以构造一个新对象。我们可以使用对象字面量，可以用
new运算符调用一个伪类构造器，可以在一个原型对象上使用Object.create方法，或者可以调用另一个函数化的构造器，
传给它一个spec对象（可能就是传递给当前构造器的同一个spec对象）和my对象。my对象允许其他的构造器分享我们
放到my中的资料。其他构造器可能也会把自己可分享的秘密成员放进my对象里，以便我们的构造器可以利用它。

接下来，我们扩充that，加入组成该对象接口的特权方法。我们可以分配一个新函数成为that的成员方法。或者，
更安全地，我们可以先把函数定义为私有方法，然后再把他们分配给that
```
var methodical = function() {
  ...
};
that.methodical = methodical;
```
分两步去定义methodical的好处是，如果其他方法想要调用methodical，它可以直接调用methodical而不是
that.methodical()。如果该实例被破坏或篡改，甚至that.methodical被替换掉了，调用methodical的方法同样
会继续工作，因为他们私有的methodical不受该实例被修改的影响。

最后，我们放回that。

让我们把这个模式应用到mammal例子里。此处不需要my，所以我们先抛开它，但会使用一个spec对象。
name和saying属性现在是完全私有的。只有通过get_name和says两个特权方法才可以访问它们。
```
var mammal = function(spec) {
  var that = {};

  that.get_name = function() {
    return spec.name;
  };
  that.says = function() {
    return spec.saying || '';
  };

  return that;
}

var myMammal = mammal({name: 'Herb'});
```

在伪类模式里，构造器函数Cat不得不重复构造器Mammal已经完成的工作。在函数化模式中那不再需要了，
因为构造器Cat将会调用构造器Mammal，让Mammal去做对象创建中的大部分工作，所以Cat只需关注自身的
差异即可
```
var cat = function(spec) {
  spac.saying = spec.saying || 'meow';
  var that = mammal(spec);
  that.purr = function(n) {
    var i, s = '';
    for (i = 0; i < n; i++) {
      if (s) {
        s += '-';
      }
      s += 'r';
    }
    return s;
  };
  that.get_name = function() {
    return that.says() + ' ' + spec.name + ' ' + that.says();
  }
  return that;
};

var myCat = cat({name: 'Herietta'});
```

函数化模块还给我们提供了一个处理父类方法的方法。我们会构造一个superior方法，它取得一个方法名并
返回调用那个方法的函数。该函数会调用原来的方法，尽管属性已经变化了。
```
Object.method('superior', function(name) {
  var that = this,
      method = that[name];
  
  return function() {
    return method.apply(that, arguments);
  }
})
```
让我们在coolcat上试验一下，coolcat就像cat一样，除了它有一个更酷的调用父类方法get_name方法。
它只需要一点点的准备工作。我们会声明一个super_get_name变量，并且把调用superior方法返回的
结果赋值给它。
```
var coolcat = function(spec) {
  var that = cat(spec),
      super_get_name = that.superior('get_name');
      
  that.get_name = function(n) {
    return 'like' + super_get_name() + ' baby';
  }
  return that;
}
var myCoolCat = coolcat({name: 'Bix'});
var name = myCoolCat.get_name();  // 'like meow Bix meow baby'
```
函数化模式有很大的灵活性。它相比伪类模式不仅带来的工作更少，还让我们得到更好的封装和信息隐藏，以及访问
父类方法的能力。


如果对象的所有状态都是私有的，那么该对象就成为一个"防伪（tamper-proof）"对象。该对象的属性可以被
替换或删除，但该对象的完整性不会受到损害。如果我们用函数化的样式创建一个对象，并且该对象的所有方法
都不使用this或that，那么该对象就是持久性（durable）的。一个持久性对象就是一个简单功能函数的集合。

一个持久性的对象不会被入侵。访问一个持久性的对象时，除非有方法授权，否则攻击者不能访问对象的内部状态。

### 部件

我们可以从一套部件中把对象组装出来。例如，我们可以构造一个给任何对象添加简单事件处理特性的函数。
它会给对象添加一个on方法、一个fire方法和一个私有的事件注册表对象
```
var eventuality = function(that) {
  var registry = {};

  that.fire = function(event) {
    // 在一个对象上触发一个事件。该事件可以是一个包含事件名称的字符串，
    // 或者是一个拥有包含事件名称的type属性的对象
    // 通过'on'方法注册的事件处理程序中匹配事件名称的函数将被调用
    var array,
        func,
        handler,
        i,
        type = typeof event === 'string' ? event : event.type;
    // 如果这个事件存在一组事件处理程序，那么就遍历它们并按顺序依次执行
    if (registry.hasOwnProperty(type)) {
      array = registry[type];
      for (i = 0; i < array.length; i++) {
        handler = array[i];

        // 每个处理程序包含一个方法和一组可选的参数
        // 如果该方法是一个字符串形式的名字，那么寻找到该函数
        func = handler.method;
        if (typeof func === 'string') {
          func = this[func]
        }
        // 调用一个处理程序。如果该条目包含参数，那么传递它们过去。否则，传递给事件对象。
        func.apply(this, handler.parameters || [event]);
      }
    }
    return this;
  }
  that.on = function(type, method, parameters) {
    // 注册一个事件，构造一条处理程序条目。将它插入到处理程序数组中，
    // 如果这种类型的事件还不存在，就构造一个
    var handler = {
      method: method,
      parameters: parameters
    }
    if (registry.hasOwnProperty(type)) {
      registry[type].push(handler)
    } else {
      registry[type] = [handler];
    }
    return this;
  }
  return that;
}
```

我们可以在任何单独的对象上调用eventuality，授予它事件处理方法。我们也可以赶在that
被返回前在一个构造器函数中调用它。
```
eventuality(that)
```

用这种方式，一个构造器函数可以从一套部件中把对象组装出来。JavaScript的弱类型在此处
是一个巨大的优势，因为我们无须花费精力去了解对象在类型系统中的继承关系。相反，我们
只需专注于它们的个性特征。

如果我们想要eventuality访问该对象的私有状态，可以把私有成员集my传递给他。
