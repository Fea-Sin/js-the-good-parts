

## js 中的语句

一个编译单元包含一组可执行的语句。在Web浏览器中，每个`<script>`标签提供一个被编译且立即执行的编译单元。

当var语句被用在函数内部时，它定义的是这个函数的私有变量。

switch、while、for和do语句允许有一个可选的前置标签（label），它配合break语句来使用。

语句通常按照从上到下的顺序被执行，JavaScript可以通过条件语句（if 和 switch）、循环语句（while、for
和do）、强制跳转语句（break、return和throw）和函数调用来改变执行序列。

代码块是包在一对花括号中的一组语句，不像许多其他语言，JavaScript中的代码不会创建新的作用域，因此
变量应该被定义在函数的头部，而不是在代码块中。

#### 下列被列出的值为假（false）

- false
- null
- undefined
- 空字符串 ''
- 数字 0
- 数字 NaN
一共6个值，其他所有的值都是真值，包括true、字符串'false'、以及所有的对象。

switch语句执行一个多路分支，它把其表达式的值和所有指定的case条件进行匹配，其表达式可能产生一个数字
或字符串，当找到一个精确匹配时，执行匹配的case从句中的语句，如果没有找到任何匹配，则执行可选的default
语句。
一个case从句包含一个或多个case表达式，case表达式不一定必须是常量，要防止继续执行下一个case，case从句
后应该跟随一个强制跳转语句，你可以用break语句退出switch语句。

while语句是一个简单的循环，如果表达式值为假，就终止循环，而当表达式值为真时，代码块被执行。

for语句是一个结构更复杂的循环语句，它有两种形式。
常见的形式由3个可选从句控制，初始化从句（initialization）、条件从句（condition）和增量从句
（increment）。首先，执行initilization，它的作用通常是初始化循环变量，接着计算condition的值，
典型的情况是它根据一个完成条件检测循环变量，如果condition被省略掉，则假定返回的条件是真。如果
condition的值为假，那么循环将终止。否者，执行代码块，然后执行increment，接着循环会重复执行
condition。

另一种形式，被称为for in语句，会枚举一个对象的所有属性名（或键名），在每次循环中，object的下一个
属性名字符串被赋值给 variable。

通常你需要检测object.hasOwnProperty(variable)来确定这个属性名是该对象的成员，还是来自于原型链。
```
for (myvar in obj) {
  if (obj.hasOwnProperty(myvar)) {
    // ...
  }
}
```

do语句就像while语句，唯一的区别是它在代码块执行之后而不是之前检测表达式的值。这意味着代码块
至少被执行一次。

try语句执行一个代码块，并捕获该代码块抛出的任何异常，catch从句定义一个新的变量variable来
接收抛出的异常对象。

throw语句抛出一个异常，如果throw语句在一个try代码块中，那么控制流会跳转到catch从句中。
如果throw语句在函数中，则该函数调用被放弃，控制流跳转到调用该函数的try语句的catch从句中。

throw语句中的表达式通常是一个对象字面量，它包含一个name属性和一个message属性，异常捕获器
可以使用这些信息去决定该做什么。

return 语句会导致从函数中提前返回，它也可以指定要被返回的值，如果没有指定返回表达式，那么
返回值是undefined。

JavaScript 不允许在 return 关键字和表达式之间换行。

break语句会使程序退出一个循环语句或switch语句，它可以指定一个可选的标签，那退出的就是带该标签
的语句。

JavaScript 不允许在break关键字和标签之间换行。

一个 expression 语句可以给一个或多个变量或成员赋值，或者调用一个方法或函数，或者从对象中删除
一个属性。

### JavaScript 中所有语句合集

```
// 分支、循环、跳转
// 1
switch 语句

// 2
if ... else 语句

// 3
while 语句

// 4
do ... while 语句

// 5
for 语句

// 6
try ... catch 语句

// 7
throw 语句

// 8
return 语句

// 9
break 语句

// 10
continue 语句
```
> JavaScript 只有这 10 种语句，别无它途。




