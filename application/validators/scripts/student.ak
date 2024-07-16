use aiken/list
use aiken/transaction.{ScriptContext, Transaction}
use aiken/transaction/value.{PolicyId}

validator(student: ByteArray, degree_policy: PolicyId) {
  fn spend(_d: Void, _r: Void, ctx: ScriptContext) {
    let Transaction { outputs, reference_inputs, .. } = ctx.transaction

    // 1. The associated degree must have been minted.
    // 2. All the tokens must be burned.
    and {
      list.any(
        reference_inputs,
        fn(o) { value.quantity_of(o.output.value, degree_policy, student) > 0 },
      ),
      list.all(
        outputs,
        fn(o) { value.is_zero(value.without_lovelace(o.value)) },
      ),
    }
  }
}
