# Campaign API

| Method | Path | Behavior |
| --- | --- | --- |
| GET | /health | Service identity and persistence mode |
| GET | /library | Synthetic corpus plus coverage catalog |
| GET | /campaigns | Latest 200 campaign summaries |
| POST | /campaigns | Validate `{label, corpus}`, compare, atomically persist |
| GET | /campaigns/:id | Read complete saved campaign |
| GET | /campaigns/:id/export | Export inputs and result together |

Names are limited to 80 characters, corpora to 100 cases, JSON bodies to 1 MiB. Invalid input 400; unknown campaign 404; content type 415; input limit 413; rejected local Host/Origin 403. The frontend adds `/api` to these paths and proxies them locally.
