

## 方法

JavaScript包含了一套小型的可用在标准类型上的标准方法集。

## Array

- array.concat(item...)

concat方法产生一个新数组，它包含一份array的浅复制（shallow copy）并把一个或多个参数item附加在
其后。如果参数item是一个数组，那么它的每个元素会被分别添加。后面你还会看到和它功能类似的
array.push(item...)方法。
```
var a = ['a', 'b', 'c'];
var b = ['x', 'y', 'z'];
var c = a.concat(b, true);
// c 变成 ['a', 'b', 'c', 'x', 'y', 'z', true]
```

- array.join(separator)

join方法把一个array构造成一个字符串。它先把array中的每个元素构造成一个字符串，接着用一个separator分隔符
把它们连接在一起。默认的separator是逗号','。要想做到无间隔的连接，我们可以使用空字符串作为separator。
```
var a = ['a', 'b', 'c'];
a.push('d')
var c = a.join(''); // c 是 'abcd'
```

- array.pop()

pop和push方法使得数组array可以像堆栈（stack）一样工作。pop方法移除array中的最后一个元素
并返回该元素。如果该array是empty，它会返回undefined。
```
var a = ['a', 'b', 'c'];
var c = a.pop();  // a 是 ['a', 'b']， c 是 'c'
```
pop可以像这样实现
```
Array.method('pop', function() {
  return this.splice(this.length - 1, 1)[0];
})
```

- array.push(item...)

push 方法把一个或多个参数item附加到一个数组的尾部。和concat方法不同的是，它会修改array，
如果参数item是一个数组，它会把参数数组作为单个元素整个添加到数组中，并返回这个array的新长度值。
```
var a = ['a', 'b', 'c'];
var b = ['x', 'y', 'z'];
var c = a.push(b, true);
// a 是 ['a', 'b', 'c', ['x', 'y', 'z'], true];
// c 是 5
```

push可以像这样实现
```
Array.method('push', function() {
  this.splice.apply(
    this,
    [this.length, 0].concat(Array.prototype.slice.apply(arguments))
  );
  return this.length
})
```

- array.reverse()

reverse方法反转array里的元素的顺序，并返回array本身
```
var a = ['a', 'b', 'c'];
var b = a.reverse();
// a 和 b 都是 ['c', 'b', 'a']
```

- array.shift()

shift方法移除数组array中的第1个元素并返回该元素。如果这个数组array是空的，
它会返回undefined。shift通常比pop慢得多。
```
var a = ['a', 'b', 'c'];
var c = a.shift();  // a 是 ['b', 'c']，c 是 'a'
```

shift可以这样实现
```
Array.method('shift', function() {
  return this.splice(0, 1)[0]
})
```

- array.slice(start, end)

slice方法对array中的一段做浅复制。首先复制`array[start]`，一直复制到`array[end]`为止。
end参数是可选的，默认是该数组的长度array.length。如果两个参数中的任何一个是负数，array.length
会和它们相加，试图让它们成为非负数。如果start大于等于array.length，得到的结果将是一个新的空
数组。千万别把slice和splice弄混了。字符串也有一个同名的方法string.slice。
```
var a = ['a', 'b', 'c'];
var b = a.slice(0, 1);  // b 是 ['a']
var c = a.slice(1);     // c 是 ['b', 'c']
var d = a.slice(1, 2);  // d 是 ['b']
```

- array.sort(comparefn)

sort方法对array中的内容进行排序。它不能正确地给一组数字排序
```
var n = [4, 8, 15, 16, 23, 42];
n.sort()
// n 是 [15, 16, 23, 4, 42, 8]
```
JavaScript的默认比较函数把要被排序的元素都视为字符串。它尚未足够智能到在比较这些元素之前先
检测它们的类型，所以当它比较这些数字的时候，会把它们转化为字符串，于是得到一个错锝离谱的结果。

幸运的是，你可以使用自己的比较函数来替换默认的比较函数。你的比较函数应该接受两个参数，并且
如果这两个参数相等则返回0，如果第1个参数应该排在前面，则返回一个负数，如果第2个参数应该排在
前面，则返回一个正数。
```
n.sort(function(a, b) {
  return a - b;
})
```
上面这个函数可以使数字正确排序，但它不能使字符串排序。如果我们想要给任何包含简单值的数组排序，
必须要做更多的工作
```
var m = ['aa', 'bb', 'a', 4, 8, 15, 16, 23, 42];
m.sort(function(a, b) {
  if (a === b) {
    return 0;
  }
  if (typeof a === typeof b) {
    return a < b ? -1 : 1;
  }
  return typeof a < typeof b ? -1 : 1;
})
// m 是 [4, 8, 15, 16, 23, 42, 'a', 'aa', 'bb']
```
如果大小写不重要，你的比较函数应该在比较之前先将两个运算数转化为小写。

如果有一个更智能的比较函数，我们也可以使对象数组排序。为了让这个事情更能满足一般情况，
我们将编写一个构造比较函数的函数
```
// by函数接受一个成员名字字符串作为参数，
// 并返回一个可以用来对包含该成员的对象数组进行排序的比较函数
var by = function(name) {
  return function(o, p) {
    var a, b;
    if (typeof o === 'object' && typeof p === 'object' && o && p) {
      a = o[name];
      b = p[name];
      if (a === b) {
        return 0;
      }
      if (typeof a === typeof b) {
        return a < b ? -1 : 1;
      }
      return typeof a < typeof b ? -1 : 1;
    } else {
      throw {
        name: 'Error',
        message: 'Expected an object when sorting by' + name
      }
    }
  }
}

// 测试
var s = [
  {first: 'Joe', last: 'Besser'},
  {first: 'Moe', last: 'Howard'},
  {first: 'Joe', last: 'DeRita'}
];

s.sort(by('first'))
```

如果你想基于多个键值进行排序，我们可以修改by函数，让其可以接受第2个参数，当主要的键值产生一个匹配
的时候，另一个compare方法将被调用以决出高下
```
var by = function(name, minor) {
  return funtion(o, p) {
    var a, b;
    if (o && p && typeof o === 'object' && typeof p === 'object') {
      a = o[name];
      b = p[name];
      if (a === b) {
        return typeof minor === 'function' ? minor(o, p) : 0;
      }
      if (typeof a === typeof b) {
        return a < b ? -1 : 1;
      }
      return typeof a < typeof b ? -1 : 1;
    } else {
      throw {
        name: 'Error',
        message: 'Expected an object when sorting by ' + name;
      }
    }
  }
}

s.sort(by('last', by('first')));
```

- array.splice(start, deleteCount, item...)

splice方法从array中移除一个或多个元素，并用新的item替换它们。参数start是从数组array
中移除元素的开始位置。参数deleteCount是要移除的元素个数。如果又额外的参数，那些item
会插入到被移除元素的位置上。它返回一个包含被移除元素的数组。

splice最主要的用处是从一个数组中删除元素。千万不要把splice和slice弄混了
```
var a = ['a', 'b', 'c']
var r = a.splice(1, 1, 'ache', 'bug');
// a 是 ['a', 'ache', 'bug', 'c']
// r 是 ['b']
```
splice可以像这样实现
```
Array.method('splice', function(start, deleteCount) {
  var max = Math.max,
      min = Math.min,
      delta,
      element,
      insertCount = max(arguments.length - 2, 0),
      k = 0,
      len = this.length,
      new_len,
      result = [],
      shift_count;

  start = start || 0;
  if (start < 0) {
    start +=len;
  }
  start = max(min(start, len), 0);
  deleteCount = max(min(typeof deleteCount === 'number' ? deleteCount : len, len - start), 0);
  delta = insertCount - deleteCount;
  new_len = len + delta;
  while(k < deleteCount) {
    element = this[start + k];
    if (element !== undefined) {
      result[k] = element;
    }
    k += 1;
  }
  shift_count = len - start - deleteCount;
  if (delta < 0) {
    k = start + insertCount;
    while(shift_count) {
      this[k] = this[k - delta];
      k += 1;
      shift_count -= 1;
    }
    this.length = new_len;
  } else if (delta > 0) {
    k = 1;
    while(shift_count) {
      this[new_len - k] = this[len - k];
      k += 1;
      shift_count -= 1;
    }
    this.length = new_len;
  }
  for (k = 0; k < insertCount; k++) {
    this[start + k] = arguments[k + 2];
  }
  return result;
})
```

- array.unshift(item...)

unshift方法像push方法一样，用于把元素添加到数组中，但它是把item插入都array的开始
部分而不是尾部。它返回array的新的length。
```
var a = ['a', 'b', 'c'];
var r = a.unshift('?', '@');
// a 是 ['?', '@', 'a', 'b', 'c']
// r 是 5
```

unshift可以这样实现
```
Array.method('unshift', function() {
  this.splice.apply(this, [0, 0].concat(Array.prototype.slice.apply(arguments)));
  return this.length;
})
```

