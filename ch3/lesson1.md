
## 对象

JavaScript的简单数据类型包数字、字符串、布尔值（true和false）、null值和undefined值。
其他所有的值都是对象。数字、字符串和布尔值"貌似"对象，因为它们拥有方法，但它们是不可变的。
JavaScript中的对象是可变的键控集合（keyed collections）。在JavaScript中，数组是
对象，函数是对象，正则表达式是对象，当然，对象自然是对象。

对象是属性的容器，其中每个属性都拥有名字和值。属性的名字可以是包括空字符串在内的任意字符串。
属性值可以是除undefined值之外的任何值。

JavaScript里的对象是无类型（class-free）的。它对新属性的名字和属性的值没有限制。
对象适合用于汇集和管理数据。对象可以包含其他对象，所以它们可以容易地表示成树状或图形结构。

JavaScript包含一种原型链的特性，允许对象继承另一个对象的属性。正确地使用它能减少对象
初始化时消耗的时间和内存。

### 对象字面量

对象字面量提供了一种非常方便地创建新对象值的表示法。一个对象字面量就是包围在一对花括号中
的零或多个"名/值"对。对象字面量可以出现在任何允许表达式出现的地方。

```
var empty_object = {};

var stooge = {
  "first-name": "Jerome",
  "last-name": "Howard"
};
```
属性名可以是包括空字符串在内的任何字符串。在对象字面量中，如果属性名是一个合法的JavaScript标识符且
不是保留字，则并不强制要求用引号括住属性名。所以用引号括住"first-name"是必需的，但是否括住first_name
则是可选的（JavaScript的标识符中包含连接符`-`是非法的，但允许包含下划线`_`）。
逗号用来分隔多个"名/值"对。

属性的值可以从包括另一个对象字面量在内的任意表达式中获得。对象是可嵌套的
```
var flight = {
  airline: "Oceanic",
  number: 815,
  departure: {
    IATA: "SYD",
    time: "2004-09-22 14:55",
    city: "Sydney"
  },
  arrival: {
    IATA: "LAX",
    time: "2004-09-23 10:42",
    city: "Los Angeles"
  }
};
```

### 检索

要检索对象里包含的值，可以采用在[]后缀中括住一个字符串表达式的方式。如果字符串表达式是一个字符串字面量，
而且它是一个合法的JavaScript标识符且不是保留字，那么也可以用`.`表示法代替。优先考虑用`.`表示法，
因为它更紧凑且可读性更好。
```
stooge["first-name"]  // "Jerome"
flight.departure.IATA // "SYD"
```
如果你尝试检索一个并不存在的成员属性的值，将返回undefined。
```
stooge["middle-name"]  // undefined
flight.status          // undefined
stooge["FIRST-NAME"]   // undefined
```

`||`运算符可以用来填充默认值
```
var middle = stooge["middle-name"] || "(none)";
var status = flight.status || "unkonwn";
```

尝试从undefined的成员属性中取值将会导致"TypeError"异常。这时可以通过`&&`运算符来避免错误。
```
flight.equipment                            // undefined
flight.equipment.model                      // throw TypeError
flight.equipment && flight.equipment.model  // undefined
```

### 更新

对象里的值可以通过赋值语句来更新。如果属性名已经存在于对象里，那么这个属性的值就会被替换。
```
stooge["first-name"] = "Jerome";
```
如果对象之前没有拥有那个属性名，那么该属性就被扩充到对象中。
```
stooge["middle-name"] = "Lester";
stooge.nickname = "Curly";
flight.equipment = {
  model: "Boeing 777"
};
flight.status = "overdue";
```

### 引用

对象通过引用来传递。它们永远不会被复制
```
var x = stooge;
x.nickname = "Curly";
var nick = stooge.nickname;
// 因为x和stooge是指向同一个对象的引用，所以nick为"Curly"

var a = {}, b = {}, c = {}
// a、b、c每个都引用一个不同的空对象

a = b = c = {};
// a、b和c都引用同一个空对象
```

### 原型

每个对象都连接到一个原型对象，并且它可以从中继承属性。所有通过对象字面量创建的
对象都连接到`Object.prototype`，它是JavaScript中的标配对象。

当你创建一个对象时，你可以选择某个对象作为它的原型。JavaScript提供的实现机制杂乱而复杂，
但其实可以被明显地简化。我们将给Object增加一个create方法。这个方法创建一个使用使用原对象
作为其原型的新对象。
```
if (typeof Object.beget !== 'function') {
  Object.create = function (o) {
    var F = function () {};
    F.prototype = o;
    return new F();
  };
}
var another_stooge = Object.create(stooge)
```

原型连接在更新时是不起作用的。当我们对某个对象做出改变时，不会触及该对象的原型
```
another_stooge["first-name"] = "Harry";
another_stooge["middle-name"] = "Moses";
another_stooge.nickname = "Moe";
```

原型连接只有在检索值的时候才被用到。如果我们尝试去获取对象的某个属性值，但该对象没有此属性名，
那么JavaScript会试着从原型对象中获取属性值。如果那个


