
## Object

- object.hasOwnProperty(name)

如果这个object包含一个名为name的属性，那么hasOwnProperty方法返回true。原型链中
的同名属性是不会被检查的。这个方法对name就是"hasOwnProperty"时不起作用，此时返回false。
```
var a = { member: true };
var b = Object.create(a);
var t = a.hasOwnProperty('member'); // true
var u = b.hasOwnProperty('member'); // false
var v = b.member;                   // true
```

## RegExp

- regexp.exec(string)

exec方法是使用正则表达式的最强大（和最慢）的方法。如果它成功地匹配 regexp 和字符串string，
它会返回一个数组。数组中下标为0的元素将包含正则表达式regexp匹配的子字符串。下标为1的元素
是分组1捕获的文本，下标2的元素是分组2捕获的文本，以此类推。如果匹配失败，它会返回null。

如果regexp带有一个g标识（全局标识），事情会变得更加复杂。查找不是从这个字符串的起始位置开始，
而是从regexp.lastIndex（初始值为0）位置开始。如果匹配成功，那么regexp.lastIndex将被
设置为该匹配后第一个字符的位置。不成功的匹配会重置regexp.lastIndex为0。

这就允许你通过循环调用exec去查询一个匹配模式在一个字符串中发生了几次。有两件事情需要注意。
如果你提前退出了这个循环，再次进入这个循环前必须把regexp.lastIndex重置为0。
而且，^因子仅匹配regexp.lastIndex为0的情况。
```
// 把一个简单的HTMML文本分解为标签和文本
// 对每个标签和文本，都产生一个数组包含如下元素
// [0] 整个匹配的标签和文本
// [1] /，如果有的话
// [2] 标签名
// [3] 属性，如果有任何属性的话

var text = '<html><body bgcolor=linen><p>this is <b>bold</b>!</p></body></html>';
var tags = /[^<>]+|<(\/?)([A-Za-z]+)([^<>]*)>/g;

var a, i;
while( (a = tags.exec(text)) ) {
  for (i = 0; i < a.length; i++) {
    ('// [' + i ']' + a[i]).entityify();
  }
}

// 结果
[0] <html>
[1] 
[2] html
[3]

[0] <body bgcolor=linen>
[1]
[2]body
[3] bgcolor=linen

[0]<p>
[1]
[2]p
[3]

[0]this is
[1]undefined
[2]undefined
[3]undefined

[0]<b>
[1]
[2]b
[3]

[0]bold
[1]undefined
[2]undefined
[3]undefined

[0]</b>
[1]/
[2]b
[3]
...
```

- regexp.test(string)

test方法是使用正则表达式的最简单（和最快）的方法。如果该regexp匹配string，
它返回true，否则，它返回false。不要对这个方法使用g标识。
```
var b = /&.+:/.test('frank &amp; beans'); // true
```
test 可以像这样实现
```
RegExp.method('test', function(string) {
  return this.exec(string) !== null;
})
```
