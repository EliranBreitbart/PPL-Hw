import {  AppExp, CExp, Exp, isAppExp, isAtomicExp, isCExp, isDefineExp, isExp, isIfExp, isLetExp, isLetPlusExp, isLitExp, isProcExp, isProgram, LetExp, LetPlusExp, makeAppExp, makeDefineExp, makeIfExp, makeLetExp, makeLetPlusExp, makeProcExp, makeProgram, Program } from "./L31-ast";
import { Result, makeFailure , makeOk} from "../shared/result";
import { map, pipe, zipWith } from "ramda";

/*
Purpose: Transform L31 AST to L3 AST
Signature: l31ToL3(l31AST)
Type: [Exp | Program] => Result<Exp | Program>
*/
export const L31ToL3 = (exp: Exp | Program): Result<Exp | Program> =>{
    return makeOk(rewriteAllLetPlus(exp));
}


const rewriteLetPlusAsLet = (e: LetPlusExp): LetExp => 
    e.bindings.length == 1 ? makeLetExp(e.bindings,e.body) : makeLetExp([e.bindings[0]],map(rewriteAllLetPlusCExp,[makeLetPlusExp(e.bindings.slice(1,e.bindings.length),e.body)]))


export const rewriteAllLetPlus = (exp: Program | Exp): Program | Exp =>
    isExp(exp) ? rewriteAllLetPlusExp(exp) :
    isProgram(exp) ? makeProgram(map(rewriteAllLetPlusExp, exp.exps)) :
    exp; // never

const rewriteAllLetPlusExp = (exp: Exp): Exp =>
    isCExp(exp) ? rewriteAllLetPlusCExp(exp) :
    isDefineExp(exp) ? makeDefineExp(exp.var, rewriteAllLetPlusCExp(exp.val)) :
    exp; // never

const rewriteAllLetPlusCExp = (exp: CExp): CExp =>
    isAtomicExp(exp) ? exp :
    isLitExp(exp) ? exp :
    isIfExp(exp) ? makeIfExp(rewriteAllLetPlusCExp(exp.test),
                             rewriteAllLetPlusCExp(exp.then),
                             rewriteAllLetPlusCExp(exp.alt)) :
    isAppExp(exp) ? makeAppExp(rewriteAllLetPlusCExp(exp.rator),
                               map(rewriteAllLetPlusCExp, exp.rands)) :
    isProcExp(exp) ? makeProcExp(exp.args, map(rewriteAllLetPlusCExp, exp.body)) :
    isLetPlusExp(exp) ?  rewriteAllLetPlusCExp(rewriteLetPlusAsLet(exp)) :
    exp; // never    
