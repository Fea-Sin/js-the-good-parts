
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
