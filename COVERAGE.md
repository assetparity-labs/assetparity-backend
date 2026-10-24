# Conformance decisions

- Asset amounts are int64 base-unit strings because this release covers G-account trustlines.
- Both routes must describe the same case participants. Issuer endpoints and self-transfers are rejected by scope validation.
- Successful observations must show the exact requested sender debit and recipient credit.
- Failed observations must show unchanged observed asset balances.
- A simulation is a preflight observation, not an included failed transaction.
- Native XLM fees are displayed separately, never forced to match.
- SAC BalanceError is a broad category; a matching category is not root-cause equivalence.
- Unknown failures require review even when both routes fail.
- Event normalization, mint/burn, contract-address balances and liabilities need separate future suites.

The catalog and synthetic cases live in the scenario-suite repository.
