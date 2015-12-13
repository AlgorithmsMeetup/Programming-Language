var add_binding = function (env, v, val) { //adds binding at top-most level
    env.bindings[v] = val;
    return env;
};

//Updates correct environment's var with new val
var update = function (env, v, val) {
    if(!(env.hasOwnProperty('bindings'))) {
      var bndg = {};
      bndg[v] = val;
      env.outer = {};
      env.bindings = bndg;
      return env;
    }
    if(env.bindings.hasOwnProperty(v)) {
      env.bindings[v] = val;
      return val;
    }
    return update(env.outer,v,val);
};

//looks for var in any envrionemnt (goes inner to outer)
var lookup = function (env, v) {
    if (!(env.hasOwnProperty('bindings')))
        throw new Error(v + " not found");
    if (env.bindings.hasOwnProperty(v))
        return env.bindings[v];
    return lookup(env.outer, v);
};

var evalScheem = function (expr, env) { 
  if (expr === 'error') throw('Error');
  //Variable Defining and Setting 
  if (expr[0] === 'define') { //update
      var defVar = expr[1];
      var defVal = evalScheem(expr[2], env);
      add_binding(env, defVar, defVal);
      return 0;
  } else if (expr[0] === 'set!') { //update
      var setVar = expr[1];
      var setVal = evalScheem(expr[2], env);
      update(env, setVar, setVal);
      return 0;
  }
  
  //Dealing with 'primitive values'
  if (typeof expr === 'number') {
      return expr;
  } else if (typeof expr === 'string') {
      return lookup(env,expr);

  //Array of actions to be taken
  } else if (expr[0] === 'begin') {
      var beginExprs = expr.slice(1);
      var beginRes;
      beginExprs.forEach(function(e){
        beginRes = evalScheem(e,env);
      });
    return beginRes;
  } else if (expr[0] === 'lambda-one') {
      var param = expr[1];
      var body = expr[2];
      return function(a) {
        var bnd = {};
        bnd[param] = a;
        var lambdaOneEnv = {bindings:bnd, outer:env};
        return evalScheem(body,lambdaOneEnv);
      };
  } else if(expr[0] === 'lambda') {
      var params = expr[1];
      var body = expr[2];
      return function() {
        var args = Array.prototype.slice.call(arguments);
        var bnd = {};
        if(typeof params === 'string') {
          bnd[params] = args[0];
        } else {
            for(var i=0; i<params.length; i++) {
              bnd[params[i]] = args[i]; 
            }
        }
        var lambdaEnv = {bindings:bnd, outer:env};
        return evalScheem(body,lambdaEnv);
      }

  } else if (expr[0] === 'if') {
      var ifRes = evalScheem(expr[1],env);
      return ifRes === '#t' ? evalScheem(expr[2],env) : evalScheem(expr[3],env);
  //Types of actions
  } else if (expr[0] === 'cons') {
      var consHead = evalScheem(expr[1],env);
      var consRes = evalScheem(expr[2],env);
      consRes.unshift(consHead);
      return consRes;
  } else if (expr[0] === 'car') {
      return evalScheem(expr.slice(1)[0],env).shift();
  } else if (expr[0] === 'cdr') {
      return evalScheem(expr.slice(1)[0],env).slice(1);
  } else if (expr[0] === 'quote') {
      return expr.slice(1)[0];
  } else if (expr[0] === '=') {
      var eq = evalScheem(expr[1],env) === evalScheem(expr[2],env);
      return eq ? '#t' : '#f';
  } else if (expr[0] === '<') {
      var lt = evalScheem(expr[1],env) < evalScheem(expr[2],env);
      return lt ? '#t' : '#f';
  } else if (expr[0] === '*') {
      return evalScheem(expr[1], env) * evalScheem(expr[2], env);
  } else if (expr[0] === '/') {
      return evalScheem(expr[1], env) / evalScheem(expr[2], env);
  } else if (expr[0] === '+') {
      return evalScheem(expr[1], env) + evalScheem(expr[2], env); 
  } else if (expr[0] === '-') {
      return evalScheem(expr[1], env) - evalScheem(expr[2], env);
  } else {
      var func = evalScheem(expr[0], env);
      var args = expr.slice(1);
      args = args.map(function(arg) {
        return evalScheem(arg,env);
      });
      return func.apply(env,args);
  }
};

function convertNumeric(char) {
  return !isNaN(char) ? parseFloat(char) : char;
}
function convertToNumeric(input) { //temporary preprocessing step
  if(typeof input === 'string') {
    return convertNumeric(input);
  } else {
    var i = input.map(convertToNumeric);
  }
  return i;
}

function evalScheemString(str,env) {
  var processed = convertToNumeric(str);
  console.log('yo', processed)
  return evalScheem(processed,env);
}