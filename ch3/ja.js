if (typeof Object.beget !== 'function') {
  Object.create = function(o) {
    var F = function() {};
    F.prototype = o;
    return new F();
  }
};

var stooge = {
  "first-name": "Jerome",
  "last-name": "Howard"
};

var anothe_stooge = Object.create(stooge)

console.log(anothe_stooge["first-name"])


