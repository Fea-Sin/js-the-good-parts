
// 测试1
var add = function(a, b) {
  return a + b;
}
var array = [3, 4];
var sum = add.apply(null, array);
console.log("test1", sum);
