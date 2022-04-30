import { map, reduce } from 'ramda';
import { Exp, Program } from '../imp/L3-ast';
import { isEmptySExp, isSymbolSExp, valueToString, isCompoundSExp } from '../imp/L3-value';
import { bind } from '../shared/optional';
import { Result, makeFailure, makeOk, isFailure } from '../shared/result';
import { IfExp, NumExp, BoolExp, DefineExp, StrExp, PrimOp, VarRef ,VarDecl, AppExp, ProcExp, LetExp, Binding, isAppExp, isBoolExp, isDefineExp, isIfExp, isLetExp, isLitExp, isNumExp, isPrimOp, isProcExp, isProgram, isStrExp, isVarRef, LitExp, CExp   } from './L31-ast';
/*
Purpose: Transform L3 AST to JavaScript program string
Signature: l30ToJS(l2AST)
Type: [EXP | Program] => Result<string>
*/
const unparseLitExp = (le: LitExp): string =>
    isEmptySExp(le.val) ? `` :
    isSymbolSExp(le.val) ? `Symbol.for("${valueToString(le.val)}")` :
    isCompoundSExp(le.val) ? `${valueToString(le.val)}` :
    `${le.val}`;

const unparseLExps = (les: Exp[]): string =>
    map(unparseL3, les).join(" ");

const unparseProcExp = (pe: ProcExp): string => 
    `((${map((p: VarDecl) => p.var, pe.args).join(",")}) => ${unparseLExps(pe.body)})`

const unparseLetExp = (le: LetExp) : string => 
    `(let (${map((b: Binding) => `(${b.var.var} ${unparseL3(b.val)})`, le.bindings).join(" ")}) ${unparseLExps(le.body)})`

const unparseAppExp = (rator : Exp, rands : Exp[]) : string => {
    return `(${map(unparseL3, rands).join(` ${unparseL3(rator)} `)})`;
}

const unparsePrimOp = (op : string) : string => {
    return op === "=" ? "===" :
    op === "boolean?" ? "((x) => (typeof(x) === boolean))" :
    op === "symbol?" ? "((x) => (typeof(x) === symbol))" :
    op === "number?" ? "((x) => (typeof(x) === number))" :
    op === "string?" ? "((x) => (typeof(x) === string))" :
    op === "boolean?" ? "((x) => (typeof(x) === boolean))" :
    op === "or" ? "||" :
    op === "and" ? "&&" :
    op === "string=?" ? "===" :
    op === "eq?" ? "===" :
    op;
}
export const unparseL3 = (exp: Program | Exp): string =>
    isBoolExp(exp) ? valueToString(exp.val) :
    isNumExp(exp) ? valueToString(exp.val) :
    isStrExp(exp) ? valueToString(exp.val) :
    isLitExp(exp) ? unparseLitExp(exp) :
    isVarRef(exp) ? exp.var :
    isProcExp(exp) ? unparseProcExp(exp) :
    isIfExp(exp) ? `(${unparseL3(exp.test)}) ? ${unparseL3(exp.then)} : ${unparseL3(exp.alt)})` :
    isAppExp(exp) ? unparseAppExp(exp.rator, exp.rands) :
    isPrimOp(exp) ? unparsePrimOp(exp.op) :
    isLetExp(exp) ? unparseLetExp(exp) :
    isDefineExp(exp) ? `const = ${exp.var.var} ${unparseL3(exp.val)})` :
    isProgram(exp) ? `(L3 ${unparseLExps(exp.exps)})` :
    exp;
   

export const l30ToJS = (exp: Exp | Program): Result<string>  => {
    return makeOk(unparseL3(exp));
}
