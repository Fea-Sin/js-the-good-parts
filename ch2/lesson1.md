
## 语法

### 空白

空白可能表现为被格式化字符或注释的形式。空白通常没有意义，但是有时候必须要用它
来分隔字符序列，否则它们就会被合并成一个符号。例如，对如下代码
```
var that = this;
```
var和that之间的空格是不能移除的，但是其他的空格都可以移除。

### 标识符

标识符由一个字母开头，其后可选择性地加上一个或多个字母、数字或下划线。
标识符不能使用下面这些保留字
```
abstract
boolean break byte
case catch char class const continue
debugger default delete do double
else enum export extends
false final finally float for function
goto
if implements import in instanceof int interface
long
native new null
package private protected public
return
short static super switch synchronized
this throw throws transient true try typeof
var volatile void
while with
```
在这个列表中的大部分保留字尚未用在这门语言中。这个列表不包括一些本应该被保留而没有
保留的字，诸如 undefined、NaN和Infinity。JavaScript不允许使用保留字来命名变量
或参数。更糟糕的是，JavaScript不允许在对象字面量中，或者用点运算符提取对象属性时，
使用保留字作为对象的属性名。

标识符被用于语句、变量、参数、属性名、运算符和标记。

### 数字

JavaScript只有一个数字类型。它在内部被表示为64位的浮点数，和Java的double数字类型一样。
与其他大多数语言不同的是，它没有分离出整数类型，所以1和1.0的值相同。这提供了很大的方便，
因为它完全避免了短整型的溢出问题，你只需知道它是一种数字。这避免了一大堆因数字类型导致的
错误。

如果一个数字字面量有指数部分，那么这个字面量的值等于e之前的数字与10的e之后数字的次方
相乘。所以100和1e2是相同的数字。

负数可以用前置运算符 `-` 加数字构成。

NaN是一个数值，它表示一个不能产生正常结果的运算结果。NaN不等于任何值，包括它自己。
你可以用函数`isNaN(number)`检测NaN。

Infinity表示所有大于1.79769313486231570e+308 的值。

数字拥有方法。JavaScript有一个对象Math，它包含一套作用于数字的方法。例如，可以用
`Math.floor(number)`方法把一个数字转换成一个整数。

### 字符串

字符串字面量可以被包在一对单引号或双引号中。他可能包含0个或多个字符。`\`(反斜线符号)是转义字符。
JavaScript被创建的时候，Unicode是一个16位的字符集，所以JavaScript中的所有字符都是16位的。

JavaScript没有字符类型。要表示一个字符，只需创建仅包含一个字符的字符串即可。

转义字符用来把那些正常情况下不被允许的字符插入到字符串中，比如反斜线、引号和控制字符。
`\u`约定用来指定数字字符编码
```
"A" === "\u0041"
```

字符串有一个length属性。例如，"seven".length 是 5。

字符串是不可变的。一旦字符串被创建，就永远无法改变它。但你可以很容易地通过`+`运算符连接
其他字符串来创建一个新的字符串。两个包含着完全相同的字符且字符顺序也相同的字符串被认为
是相同的字符串
```
'c' + 'a' + 't' === 'cat' // true
```

字符串有一些方法。如
```
'cat'.toUpperCase() === 'CAT' // true
```


