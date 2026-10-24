# Controlled testnet evidence

`testnet-evidence.json` records the self-issued PARITY asset, built-in SAC address, disposable public participants, transaction receipts, route observations and comparison output. It is separate from the synthetic baseline.

Included classic failures charge native fees; SAC preflight rejections do not. Successful SAC transfers are confirmed transactions. Horizon balance reads occur across requests and can lag RPC confirmation; the pilot waits for expected successful deltas, but does not claim an atomic state snapshot. The comparison service treats imported evidence as untrusted.

The SAC executable is checked to be the built-in stellar-asset executable rather than Wasm. This project does not deploy a custom token contract or claim a Wasm hash for the SAC.

Read-only verification and pilot reproduction commands are documented alongside the public scripts.

## Reproduce and inspect

Install pinned SDK dependencies with `npm ci` in backend, classic-adapter and sac-adapter. Then:
```sh
cd assetparity-backend
node replay-evidence.mjs
node verify-testnet.mjs
```

The recorded controlled pilot contains 16 included transactions (12 successful, 4 failed) and four SAC rejection simulations. It includes six comparison cases: fractional and one-base-unit success, recipient-limit/check-order behavior, isolated underfunding, deauthorization and a missing trustline. The isolated underfunding case reports `op_underfunded`; the separate larger transfer reports `op_line_full` on the classic route and broad SAC BalanceError, without asserting identical root causes.

To execute a fresh faucet-funded testnet pilot, explicitly choose a private directory outside the repository:
```sh
ASSETPARITY_ALLOW_TESTNET=1 ASSETPARITY_PILOT_DIR=/absolute/private/pilot node pilot-testnet.mjs
```
Use a fresh directory to execute all steps. Resuming retains previously confirmed steps. Public receipts are written into testnet-evidence.json; private keys remain in the selected private directory. The script is fixed to Stellar testnet and a self-issued PARITY asset. A fresh pilot can use fewer setup transactions than the recorded pilot, which includes a separate reauthorization step to isolate underfunding.
