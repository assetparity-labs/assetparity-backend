# AssetParity campaign service

A local SQLite-backed conformance service for asset integration teams. A campaign binds a name, an original observation corpus, a comparison result and an input digest into one exportable evidence bundle.

## Start a workspace

Clone these sibling repositories into one directory:
```sh
for part in classic-adapter sac-adapter backend frontend scenario-suite; do
  git clone "https://github.com/assetparity-labs/assetparity-$part.git"
done
node --test assetparity-*/test.mjs
cargo test --locked --manifest-path assetparity-sac-adapter/Cargo.toml
node assetparity-backend/server.mjs
# In another terminal:
node assetparity-frontend/server.mjs
```

Use Node 24+ and Rust stable. Open http://127.0.0.1:4380. The API listens on 4381. The local comparison console needs no npm install; optional operation builders and testnet verification scripts require `npm ci` in backend, classic-adapter and sac-adapter.

## Campaign lifecycle

1. Start from the synthetic baseline or import an observation corpus.
2. Select relevant transfer cases and name the campaign.
3. Save the comparison. Inputs and results are stored atomically in `data/campaigns.sqlite`.
4. Inspect route-specific outcomes, raw failure codes and exact balance snapshots.
5. Export the original observations with the result. Saved campaigns survive a service restart.

The store retains the latest 200 campaigns; export anything that must remain available longer. HTTP inputs are capped at 1 MiB and 100 cases. There is no signing or submission endpoint. Host and Origin checks constrain local browser access but are not authentication; keep the service on loopback.

## Conformance claim

Only positive issued-asset transfers between distinct, non-issuer G accounts are modeled. Successful routes must debit and credit the requested base units. Failed routes must leave the observed asset balances unchanged. Known outcome categories must agree. Native XLM fees are preserved separately and excluded from asset parity. Matching broad failure categories does not prove the same root cause or identical execution.

Imported observations and provenance strings are untrusted. Address-format validation is not checksum or ownership verification. Snapshots taken across requests are not atomic proofs. The SHA-256 digest identifies exact JSON serialization, not canonical semantic equivalence.

See API.md, EVIDENCE.md and COVERAGE.md for boundaries and reproduction.
