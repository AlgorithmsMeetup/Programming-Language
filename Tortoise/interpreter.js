var lookup = function (env, v) {
    if (!(env.hasOwnProperty('bindings')))
        throw new Error(v + " not found");
    if (env.bindings.hasOwnProperty(v))
        return env.bindings[v];
    return lookup(env.outer, v);
};

//adds binding at top-most level
var addBinding = function(env, v, val) {
    if(!(env.hasOwnProperty('bindings'))) {
      var bndg = {};
      bndg[v] = val;
      env.outer = {};
      env.bindings = bndg;
    }
    env.bindings[v] = val;
    return env;
};

function evalExpr(expr, env) { //recursive Tortoise expression Evaluator
  //primitives
  if (typeof expr === 'number') {
    return expr;
  } 
  //Simple built in binary operators
  if (expr.tag === 'ident') {
    return lookup(env,expr.name);
  } else if (expr.tag === '<') {
    return evalExpr(expr.left, env) < evalExpr(expr.right, env);
  } else if (expr.tag === '>') {
    return evalExpr(expr.left, env) > evalExpr(expr.right, env);
  } else if (expr.tag === '+') {
    return evalExpr(expr.left, env) + evalExpr(expr.right, env);
  } else if (expr.tag === '-') {
    return evalExpr(expr.left, env) - evalExpr(expr.right, env);
  } else if (expr.tag === '*') {
    return evalExpr(expr.left, env) * evalExpr(expr.right, env);
  }
  //function values
  else if (expr.tag === 'call') {
    var func = lookup(env, expr.name);
    var ev_args = [];
    var i = 0;
    for(; i<expr.args.length; i++) {
      ev_args.push(evalExpr(expr.args[i], env));
    }
    return func.apply(null, ev_args); 
  }

}

//Updates correct environment's var with new val
var update = function (env, v, val) {
    if(!(env.hasOwnProperty('bindings'))) {
      return addBinding(env,v,val);
    }
    if(env.bindings.hasOwnProperty(v)) {
      env.bindings[v] = val;
      return val;
    }
    return update(env.outer,v,val);
};

function evalStatements(seq, env) {
  var i;
  var val = undefined;
  for(i=0; i<seq.length; i++) {
    val = evalStatement(seq[i], env);
  }
  return val;
}

function evalStatement(stmt, env) {
  var val = undefined;
  if(!(stmt.tag)) {
    return evalExpr(stmt, env);
  }

  if (stmt.tag === 'ignore') { //single expression
    return evalExpr(stmt.body, env); 
  } else if (stmt.tag === 'var') {
        addBinding(env, stmt.name, 0);
        return 0;
  } else if (stmt.tag === ':=') {
        val = evalExpr(stmt.right, env);
        update(env, stmt.left, val);
        return val;
  } else if (stmt.tag === 'if') {
    var cond = evalExpr(stmt.expression, env);
    if(cond) {
      val = evalStatements(stmt.i, env);
      return val;
    } else {
      val = evalStatements(stmt.e, env);
      return val;
    }
  } else if (stmt.tag === 'define') {
      //name args body
      var newFunc = function() {
        //takes any # args
            var i;
            var newEnv;
            var newBindings = {};
            for(i=0; i<stmt.args.length; i++) {
              newBindings[stmt.args[i]] = arguments[i];
            }
            newEnv = {bindings:newBindings, outer: env};
            return evalStatements(stmt.body, newEnv);
      };
      addBinding(env, stmt.name, newFunc); //can call self recursively
      return 0;

  } else if (stmt.tag === 'repeat') {
    var count = evalExpr(stmt.expression, env);
    while(--count >= 0) {
          val = evalStatements(stmt.body, env);
    }
    return val;
  } else {
    return evalExpr(stmt, env);
  }
}

function evalTortoise(str, env) {
  try {
    var parse = TORTOISE.parse(str);
    console.log(parse);
    var interpreted = evalStatements(parse, env);
  } catch(e) {
    console.log("something went wrong while evaluating " + e);
  }
  return interpreted;
}