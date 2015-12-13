var assert = chai.assert;

suite('Simple Parser Tests', function() {
  test('a number', function() {
    assert.deepEqual(TORTOISE.parse('2'), [2]);
  });
});

suite('Complex Parser Tests', function() { //eek!
  test('Multi-Step function expression', function() {
    assert.deepEqual(TORTOISE.parse('f(2 + g(3) * 2, x)'), [{
       "tag": "call",
       "name": "f",
       "args": [
          {
             "tag": "+",
             "left": 2,
             "right": {
                "tag": "*",
                "left": {
                   "tag": "call",
                   "name": "g",
                   "args": [
                      3
                   ]
                },
                "right": 2
             }
          },
          {
             "tag": "ident",
             "name": "x"
          }
       ]
    }])
  });

});

suite('Interpretor Tests', function() {
  test('a number', function() {
    assert.deepEqual(evalStatement(4, {}), 4);
  });
});

suite('Parser and Interpretor Linked Tests', function() {
  test('a number', function() {
    assert.deepEqual(evalTortoise('2'), 2);
  });
});

suite('Function Tests', function() {
  test('defining a function', function() {
    assert.deepEqual(evalTortoise('define forward(dist) {dist+10;}', {}), 0);
  });
});

suite('Recursive Tests', function() {
  test('defining a recursive function', function() {
    var env = {bindings: {}, outer: {}};
    assert.deepEqual(evalTortoise('define factorial(n) {if (n<1) {1} {n * factorial(n-1)} }', env), 0);
  });
});

suite('Repeat blocks', function() {
  test('basic repeat', function() {
   assert.deepEqual(evalTortoise('repeat(4) {2}', {}), 2);
  });
});

suite('Declaring variables in functions', function() {
  test('basic declaration', function() {
    var env = {bindings: {}, outer: {}};
    evalTortoise('define x(a) {var b; b:= 2; b+a;}', env);
    // console.log(env);
    var j = evalTortoise('x(10)', env);
    // console.log(env);
    // console.log(j);
  });
});