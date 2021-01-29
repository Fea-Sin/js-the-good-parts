
## 数组

数组是一段线性分配的内存，它通过整数计算偏移并访问其中的元素。数组是一种性能出色的数据结构。
不幸的是，JavaScript没有像此类数组一样的数据结构。
作为替代，JavaScript提供了一种拥有一些数组（array-like）特性的对象。它把数组的下标转变成
字符串，用其作为属性。它明显地比一个真正的数组慢，但它使用起来更方便。它的属性的检索和更新
的方式与对象一摸一样，只不过多一个可以用整数作为属性名的特性。数组有自己的字面量格式。数组
也有一套非常有用的内置方法。

### 数组字面量

数组字面量提供了一种非常方便地创建新数组的表示法。一个数组字面量是在一对方括号中包围零个或多个
用逗号分隔的值的表达式。数组字面量允许出现在任何表达式可以出现的地方。数组的第一个值将获得属性名'0'，
第二个值将获得属性名'1'，依次类推。
```
var empty = [];
var numbers = ['zero', 'one', 'two', 'three'];
empty[1]    // undefined
numbers[1]  // 'one'
empty.length   // 0
numbers.length // 4
```
对象字面量
```
var numbers_object = {
  '0': 'zero', '1': 'one', '2': 'two', '3': 'three'
}
```
两者产生的结果相似。numbers和numbers_object都是包含10个属性的对象，并且那些属性刚好有相同的名字
和值。但是它们也有一些显著的不同。numbers继承自Array.prototype，而numbers_object继承自Object.prototype，
所以numbers继承了大量有用的方法。同时，numbers也有一个诡异的length属性，而numbers_object则没有。

在大多数语言中，一个数组的所有元素都要求是相同的类型。JavaScript允许数组包含任意很合类型的值。
```
var misc = [
  'string', 98.6, true, false, null, undefined,
  ['nested', 'array'], {object: true}, NaN,
  Infinity
];
misc.length // 10
```

### 长度

每个数组都有一个length属性。和大多数其他语言不同，JavaScript数组的length是没有上界的。如果你用大于或等于
当前length的数字作为下标来存储一个元素，那么length值会被增大以容纳新元素，不会发生数组越界错误。

length属性的值是这个数组的最大整数属性名加上1。它不一定等于数组里的属性的个数。
```
var myArray = [];
myArray.length     // 0
myArray[1000000] = true;
myArray.length     // 1000001
// myArray只包含一个属性
```
[]后置下标运算符把它所含的表达式转换成一个字符串，如果该表达式有toString方法，就使用该方法的值。
这个字符串将被用作属性名。如果这个字符串看起来像一个大于等于这个数组当前的length且小于4294967295
的正整数，那么这个数组的length就会被重新设置为新的下标加1。

你可以直接设置length的值。设置更大的length不会给数组分配更多的空间。而把length设小将导致所有
下标大于等于新length的属性被删除。

通过把下标指定为一个数组的当前length，可以附加一个新元素到该数组的尾部。
```
numbers[numbers.length] = 'shi';
// numbers 是 ['zero', 'one', 'two', 'three', 'shi']
```
有时用push方法可以更加方便地完成同样的事情
```
numbers.push('go');
// numbers 是 ['zero', 'one', 'two', 'three', 'shi', 'go']
```

### 删除

由于JavaScript的数组其实就是对象，所以delete运算符可以用来从数组中移除元素

```
delete numbers[2]
// numbers 是 ['zero', 'one', undefined, 'three', 'shi', 'go']
```
不幸的是，那样会在数组中留下一个空洞。这是因为排在被删除元素之后的元素保留着它们最初的属性。
而你通常想要的是递减后面每个元素的属性。

幸运的是，JavaScript数组有一个splice方法。它可以对数组做个手术，删除一些元素并将它们
替换为其他的元素。第1个参数是数组中的一个序号，第2个参数是要删除的元素个数。任何额外的参数
会在序号那个点的位置被插入到数组中
```
numbers.splice(2, 1)
// numbers 是 ['zero', 'one', 'three', 'shi', 'go']
```
值为'shi'的属性的键值从'4'变到'3'。因为被删除属性后面的每个属性必须被移除，并且以一个新的键值
重新插入，这对于大型数组来说可能会效率不高。

### 枚举

因为JavaScript的数组其实就是对象，所以for in语句可以遍历一个数组的所有属性。遗憾的是，for in
无法保证属性的顺序，而大多数要遍历数组的场合都期望按照阿拉伯数字顺序来产生元素。此外，可能从原型
链中得到意外属性的问题依旧存在。

幸运的是，常规的for语句可以避免这些问题。JavaScript的for语句和大多数类C（C-like）语言相似。
它被3个从句控制，第1个初始化循环，第2个执行条件检测，第3个执行增量运算
```
var i;
for (i = 0; i < myArray.length; i++) {
  document.writeln(myArray[i]);
}
```

### 容易混淆的地方

在JavaScript编程中，一个常见的错误是在必须使用数组时使用了对象，或者在必须使用对象时使用了数组。
其实规则很简单，当属性名是小而连续的整数时，你应该使用数组。否则，使用对象。

JavaScript本身对于数组和对象的区别是混乱的。typeof运算符报告数组的类型是'object'，这没有
任何意义。

JavaScript没有一个好的机制来区别数组和对象。我们可以通过定义自己的is_array函数来弥补这个缺陷
```
var is_array = function(value) {
  return value &&
         typeof value === 'object' &&
         value.constructor === Array;
}
```
遗憾的是，它在识别从不同的窗口（window）或（frame）里构造的数组时会失败。有一个更好的方式去
判断一个对象是否为数组
```
var is_array = function(value) {
  return Object.prototype.toString.apply(value) === '[object array]';
}
```

### 方法

JavaScript提供了一套数组可用的方法。这些方法是被储存在Array.prototype中的函数。在第3章里，
我们看到Object.prototype是可以被扩充的。同样，Array.prototype也可以被扩充。
举例来说，假设我们想要给array增加一个方法，它允许我们对数组进行计算。
```
Array.method('reduce', function(f, value) {
  var i;
  for (i = 0; i < this.length; i++) {
    value = f(this[i], value);
  }
  return value;
})
```
通过给Array.prototype扩充一个函数，每个数组都继承了这个方法。在这个例子里，我们定义了一个reduce方法，
它接受一个函数和一个初始值作为参数。它遍历这个数组，以当前元素和该初始值为参数调用这个函数，并且计算出一个新值。
当完成时，它返回这个值。如果我们传入一个把两个数字相加的函数，它会计算出相加之和。如果我们传入把两个数字相乘
的函数，它会计算出相乘之积。
```
// 创建一个数字数组
var data = [4, 8, 15, 16, 23, 42]

// 定义两个简单的函数，一个是把两个数字相加，另一个是把两个数字相乘
var add = function(a, b) {
  return a + b;
}
var mult = function(a, b) {
  return a * b;
}

// 调用data的reduce方法
var sum = data.reduce(add, 0);   // sum is 108

var product = data.reduce(mult, 1);  // product is 7418880
```
因为数组其实就是对象，所以我们可以直接给一个单独的数组添加方法
```
// 给data数组添加一个total方法
data.total = function() {
  return this.reduce(add, 0)
}
total = data.total();  // total is 108
```

因为字符串'total'不是整数，所以给数组增加一个total属性不会改变它的length。当属性名是数字时，数组才是
最有用的，但它们依旧是对象，并且对象可以接受任何字符串作为属性名。

来自第3章的Object.create方法用在数组是没有意义的，因为它产生一个对象，而不是一个数组。产生的对象将继承
这个数组的值和方法，但它没有那个特殊的length属性。

### 指定初始值

JavaScript的数组通常不会预置值。如果你用[]得到一个新数组，它将是空的。如果你访问一个不存在的元素，得到的值
则是undefined。如果你知道这个问题，或者你在尝试获取每个元素之前都很有预见性地设置它的值，就就万事大吉了。
但是，如果你实现的算法是假设每个元素都从一个已知的值开始（例如0），那么你必须自己准备好这个数组。JavaScript
应该提供一些类似Array.dim这样的方法来做这件事情，但我们可以很容易纠正这个疏忽
```
Array.dim = function(dimension, initial) {
  var a = [], i;
  for (i = 0; i < dimension; i++) {
    a[i] = initial;
  }
  return a;
}
// 创建一个包含10个0的数组
var myArray = Array.dim(10, 0)
```
JavaScript没有多维数组，但就像大多数类C语言一样，它支持元素为数组的数组
```
var matrix = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8]
]
matrix[2][1] // 7
```
为了创建一个二维数组或者说数组的数组，你必须自己去创建那个第二维的数组
```
for (i = 0; i < n; i++) {
  my_array[i] = []
}
```
一个空的矩阵的每个单元会拥有一个初始值undefined。如果你希望它们有不同的初始值，你必须明确地
设置它们。同样地，JavaScript应该对矩阵提供更好的支持。好在我们也可以补上它
```
Array.matrix = function(m, n, initial) {
  var a, i, j, mat = [];
  for (i = 0; i < m; i++) {
    a = [];
    for (j = 0; j < n; j++) {
      a[j] = initial
    }
    mat[i] = a;
  }
  return mat;
}

// 构造一个用0填充的4x4矩阵
var myMatrix = Array.matrix(4, 4, 0);
document.writeln(myMatrix[3][3]);  // 0
```
