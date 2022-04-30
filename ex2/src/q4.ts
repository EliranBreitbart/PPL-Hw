import { Exp, Program } from '../imp/L3-ast';
import { bind } from '../shared/optional';
import { Result, makeFailure, makeOk, isFailure } from '../shared/result';
import { IfExp, NumExp, BoolExp, DefineExp, StrExp, PrimOp, VarRef ,VarDecl, AppExp, ProcExp, LetExp   } from './L31-ast';
/*
Purpose: Transform L3 AST to JavaScript program string
Signature: l30ToJS(l2AST)
Type: [EXP | Program] => Result<string>
*/
const parse_if = (ifexp : IfExp): Result <string> => makeOk("nothing")

// [let exp, bool exp, Appexp]
// for every element in the program - to string it 
//
export const l30ToJS = (exp: Exp | Program): Result<string>  => 
    makeFailure("TODO");
    // isBoolEXP ? pars_bool and add to the string result :
    // is if? ...........
    // makeFailure("TODO");
