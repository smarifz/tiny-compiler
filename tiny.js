
const lex = str => str.split(' ').map(s => s.trim()).filter(s => s.length);


const Op = Symbol('op');
const Num = Symbol('num');
const Register = Symbol('register');
const Memory = Symbol('memory');

const parse = tokens => {

  let c = 0;
  const peek = () => tokens[c];
  const consume = () => tokens[c++];

  const parseNum = () => ({ val: parseInt(consume().slice(1)), type: Num });

  const parseRegister = () => ({ val: parseInt(consume().slice(1)), type: Register });

  const parseMemory = () => ({ val: parseInt(consume().slice(1)), type: Memory });

  // Reg or Memory
  const parseGeneric = (type) => {
    const node = { val: consume(), type: type, expr: [] };
    while (peek()) node.expr.push(parseExpr());
    return node;
  };

  const parseExpr = () => {
    const token = peek();

    if (token.startsWith ('r')) {
      return parseRegister ();
    } else if (token.startsWith ('#')) {
      return parseNum ();
    } else if (token.startsWith ('m')) {
      return parseMemory();
    } else {
      return parseGeneric (Op);
    }
  };

  return parseExpr();
};

const e = (ast, register, memory) => {
  const resultRegister = ast.expr[0].val,
    resultRegisterKey = `r${resultRegister}`;

  const evaluate = (ast) => {
    const opAcMap = {
      '+': args => args.reduce((a, b) => a + b, 0),
      '-': args => args.reduce((a, b) => a - b),
      memory: args => args.reduce((a, b) => a + b, 0),
      mul: args => args.reduce((a, b) => a * b, 1)
    };

    if (ast.type === Num) {
      return ast.val;
    }else if(ast.type === Register){
      return parseInt(register[`r${ast.val}`]);
    }else if(ast.type === Memory){
      return memory[ast.val];
    }

    return opAcMap[ast.val](ast.expr.map(evaluate));
  };

  register[resultRegisterKey] = evaluate(ast);
  return register;
};


const compile = ast => {
  const opMap = { sum: '+', mul: '*', sub: '-', div: '/' };
  const compileNum = ast => ast.val;
  const compileOp = ast => `(${ast.expr.map(compile).join(' ' + opMap[ast.val] + ' ')})`;
  const compile = ast => ast.type === Num ? compileNum(ast) : compileOp(ast);
  return compile(ast);
};


module.exports = {
  lex,
  parse,
  e,
};