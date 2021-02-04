
## String


- string.charAt(pos)

charAt方法返回在string中pos位置处的字符。如果pos小于0或大于等于字符串的长度string.length，
它会返回空字符串。JavaScript没有字符类型（character type）。这个方法返回的结果是一个字符串。
```
var name = 'Curly';
var initial = name.charAt(0); // 'C'
```

charAt可以像这样实现
```
String('charAt', function(pos) {
  return this.slice(pos, pos + 1);
})
```

- string.charCodeAt(pos)

charCodeAt方法同charAt一样，只不过它返回的不是一个字符串，而是以整数形式表示的在
string中的pos位置处的字符的字符码位。如果pos小于0或大于等于字符串的长度string.length，
它返回NaN。
```
var name = 'Curly';
var initial = name.charCodeAt(0);   // 67
```

- string.concat(string...)

concat方法把其他的字符串链接在一起构造一个新的字符串。它很少被使用，因为用+运算符
更为方便
```
var s = 'C'.concat('a', 't');  // Cat
```

- string.indexOf(searchString, position)

indexOf方法在string内查找另一个字符串searchString。如果它被找到，返回第1个匹配字符
的位置，否则返回-1。可选参数position可设置从string的某个指定的位置开始查找。
```
var text = 'Mississippi';
var p = text.indexOf('ss');  // 2
p = text.indexOf('ss', 3);   // 5
p = text.indeOf('ss', 6);    // -1
```

- string.lastIndexOf(searchString, position)

lastIndexOf方法和indeOf方法类似，只不过它是从该字符串的末尾开始查找而不是从开头。
```
var text = 'Mississippi';
var p = text.lastIndexOf('ss');  // 5
p = text.lastIndexOf('ss', 3);   // 2
p = text.lastIndexOf('ss', 6);   // 5
```

- string.match(regexp)

match方法让字符串和一个正则表达式进行匹配。它依据g标识来决定如何进行匹配。如果没有
g标识，那么调用string.match(regexp)的结果于调用regexp.exec(string)的结果
相同。然而，如果regexp带有g标识那么它生成一个包含所有匹配（除捕获分组之外）的数组。

- string.replace(searchValue, replaceValue)

replace方法对string进行查找和替换操作，并返回一个新的字符串。参数searchValue可以是
一个字符串或一个正则表达式对象。如果它是一个字符串，那么searchValue只会在第1次出现的地方
被替换，所以下面的代码结果是"mother-in_law"
```
var result = "mother_in_law".replace('_', '-');
```
这或许令你失望。

如果searchValue是一个正则表达式并且带有g标识，它会替换所有的匹配。如果没有带g标识，
它会仅替换第1个匹配。

replaceValue可以是一个字符串或一个函数。如果replaceValue是一个字符串，字符$拥有特别的含义
```
// 捕获括号中的3个数字
var oldareacode = /\((\d{3})\)/g;
var p = '(555)666-1212'.replace(oldareacode, '$-');
// p 是 '555-666-1212'
```

| 美元符号序列 | 替换对象 |
|----|----|
| $$ | $ |
| $& | 整个匹配的文本 |
| $number | 分组捕获的文本 |
| $` | 匹配之前的文本 |
| $' | 匹配之后的文本 |

如果replaceValue是一个函数，那么每遇到一次匹配函数就会被调用一次，而该函数返回的
字符串会被替换文本。传递给这个函数的第1个参数是整个被匹配的文本，第2个参数是分组1捕获的文本，
再下一个参数是分组2捕获的文本，依次类推
```
String.method('entityify', function() {
  var character = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;'
  }
  // 返回string.entityify方法，它返回调用替换方法的结果
  // 它的replaceValue函数返回在一个对象中查找一个字符的结果
  // 这种对象的用法通常优于switch语句
  return function() {
    return this.replace(/[<>&"]/g, function(c) {
      return character[c];
    })
  };
}())
```

```
"<&>".entityify();  // &lt;&amp:&gt;
```

- string.search(regexp)

search方法和indexOf方法类似，只是它接受一个正则表达式对象作为参数而不是一个字符串。
如果找到匹配，它返回第1个匹配的首字母位置，如果没有找到匹配，则返回-1。此方法会忽略g标识，
且没有position参数
```
var text = 'and in it he says "Any damn fool could';
var pos = text.search(/["']/);  // pos 是 18
```

- string.slice(start, end)

slice方法复制string的一部分来构造一个新的字符串。如果start参数是负数，它将与string.length相加。
end参数是可选的，且默认等于你要取的最后一个字符的位置值上加1。要想得到从位置p开始的n个字符，就用
string.slice(p, p + n)。同类的方法请参见string.substring和之前介绍的array.slice。
```
var text = 'and in it he says "Any damn fool could';
var a = text.slice(18);   // '"Any damn fool could'
var b = text.silce(0, 3); // 'and'
var c = text.slice(-5);   // 'could'
var d = text.slice(19, 32);  // 'Any damn fool'
```

- string.split(separator, limit)

split方法把这个string分隔成片段来创建一个字符串数组。可选参数limit可以限制被分隔的片段数量。
separator参数可以是一个字符串或一个正则表达式。

如果separator是一个空字符，会返回一个单字符的数组
```
var digits = '0123456789';
var a = digits.split('', 5);
// a 是 ['0', '1', '2', '3', '4']
```
否则，此方法会在string中查找所有separator出现的地方。分隔符两边的每个单元文本都会被复制到该
数组中。此方法会忽略g标识。
```
var ip = '192.168.1.0';
var b = ip.split('.');
// b 是 ['192', '168, '1', '0']

var c = '|a|b|c|'.split('|');
// c 是 ['', 'a', 'b', 'c', '']

var text = 'last, first ,middle';
var d = text.split(/\s*,\s*/)
// d 是 ['last', 'first', 'middle']
```

有一些特例需须特别注意。来自分组捕获的文本会被包含在被分隔后的数组中。
```
var e = text.split(/\s*(,)\s*/);
// e 是 ['last', ',', 'first', ',', 'middle']
```

- string.substring(start, end)

substring的用法和slice方法一样，只是它不能处理负数参数。没有任何理由去使用substring方法。
请用slice替代它。

- string.toLocaleLowerCase()

toLocaleLowerCase方法返回一个新字符串，它使用本地化的规则把这个string中的所有字母
转换为小写格式。这个方法主要用在土耳其语上，因为在土耳其中'I'转换为'1'，而不是'i'。

- string.toLowerCase()

toLowerCase方法返回一个新的字符串，这个string中所有字母都被转换为小写格式。

- string.toUpperCase()

toUpperCase方法返回一个新的字符串，这个string中的所有字母被转换为大写格式。

- String.fromCharCode(char...)

String.fromCharCode函数根据一串数字编写返回一个字符串
```
var a = String.fromCharCode(67, 97, 116);
// a 是 'Cat'
```
