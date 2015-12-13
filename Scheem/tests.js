var assert = chai.assert;

//Complete Unit Tests
suite('Complete Tests',function() {
  test('a number', function() {
    assert.deepEqual(evalScheemString('3', {}),
      3);
  });
  test('a two digit number', function() {
    assert.deepEqual(evalScheemString('24',{}),
      24);
  });
});


// Parsing Unit Tests
suite('parse', function() {
    test('a number', function() {
        assert.deepEqual(SCHEEM.parse('42'),
            42
        );
});

//Interpreter Unit Tests
suite('quote', function() {
    test('a number', function() {
        assert.deepEqual(
            evalScheem(['quote', 3], {}),
            3
        );
    });
});

suite('add', function() {
    test('two numbers', function() {
        assert.deepEqual(
            evalScheem(['+', 3, 5], {}),
            8
        );
    });
});
});


//Environment Tests
suite('environment lookup', function() {
  test('redefining', function() {
     evalScheem(['set!', 'x', 20], {x:10}),
     {bindings:{x:20},outer:{}};
  });
});


//Comparison Tests
suite('testing comparisons', function() {
  test('Equality Comparison', function() {
    assert.deepEqual(
      evalScheem(['=', 4, 4], {}),
      '#t');
  });
});

suite('cons, car, cdr tests', function() {
  test('cons test', function() {
    assert.deepEqual(
      evalScheem(['cons', 1, ['quote', [2, 3]]], {}),
      [1, 2, 3]);
  });
});

//Multiset operation tests
suite('complex multistep operations', function() {
  test('should update environment with result', function() {
    var env = {bindings:{a:10, b:20}, outer:{}};
    var prg = ['begin',
            ['define', 'x', 5],
            ['set!', 'x', ['+', 'x', 1]],
            ['+', 2, 'x']];
    evalScheem(prg, env);
    assert.deepEqual(env,{bindings:{a:10, b:20, x:6},outer:{}});
  });
});

//Function application tests
suite('function application', function() {
  var always3 = function (x) { return 3; };
  var identity = function (x) { return x; };
  var plusone = function (x) { return x + 1; };
  var sum  = function(a ,b) {return a + b;};
  var sumAll = function() {var args = Array.prototype.slice.call(arguments); return args.reduce(sum);}
  var env = {
    bindings: {'always3': always3,
               'sum':sum,
               'sumAll':sumAll,
               'identity': identity,
               'plusone': plusone}, outer: { }};
  test('always return 3', function() {
    assert.deepEqual(evalScheem(['always3', 5], env), 3);
  });
});

//Creating function value tests
suite('creating function values', function() {
  test('identity function', function() {
    assert.deepEqual(evalScheem([['lambda', 'x', 'x'], 5], { }),5);
  });
});