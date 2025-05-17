```bash

RUSTFLAGS='--cfg getrandom_backend="wasm_js"' cargo build

wasm-pack build --target web

```
