
## Function


- function.apply(thisArg, argArray)

apply方法调用funtion，传递一个会绑定到 this 上的对象和一个可选的数组作为参数。apply方法被用在
apply调用模式apply调用模式。
```
Function.method('bind', function(that) {
  // 返回一个函数，调用这个函数就像调用那个对象的一个方法
  var method = this;
  slice = Array.prototype.slice,
  args = slice.apply(arguments, [1]);
  return function() {
    return method.apply(that, args.concat(slice.apply(arguments, [0])));
  }
})

var x = function() {
  return this.value;
}.bind({value: 666});
x();  // 666
```

## Number

- number.toExponential(fractionDigits)

toExponential方法把这个number转换成一个指数形式的字符串。可选参数fractionDigits控制
其小数点的数字位数。它的值必须在0~20
```
Math.PI.toExponential(0);  // 3e+0
Math.PI.toExponential(2);  // 3.14e+0
Math.PI.toExponential(7);  // 3.1415927e+0
```
- number.toFixed(fractionDigits)

toFixed方法把这个number转换成一个十进制形式的字符串。可选参数fractionDigits控制其小数点
后的数字位数。它的值必须在0~20，默认为0
```
Math.PI.toFixed(0);  // 3
Math.PI.toFixed(2);  // 3.14
Math.PI.toFixed(7);  // 3.1415927
Math.PI.toFixed();   // 3
```

- number.toPrecision(percision)

toPrecision方法把这个number转换成为一个十进制数形式的字符串。可选参数precision控制
数字的精度。
```
Math.PI.toPrecision(2);  // 3.1
Math.PI.toPrecision(7);  // 3.141593
```

- number.toString(redix)

toString方法把这个number转换成为一个字符串。可选参数radix控制基数。它的值必须在2~36。
默认的radix是以10为基数的。radix参数最常用的是整数，但是它可以用任意的数字。

在最普通的情况下，number.toString() 可以更简单得写为 String(number);
```
Math.PI.toString(2);  // 11.001001000...
Math.PI.toString(8);  // 3.1103755242102643
```
