export default (op1: string, op2: string): boolean => {
  console.log(`operand1: ${op1}, operand2: ${op2}, result: ${op1 !== op2}`); 
  return op1 !== op2;
}