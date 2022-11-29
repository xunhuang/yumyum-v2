#!/bin/bash
set -euo pipefail

# Compile with ts-proto
protoc \
    --plugin="./node_modules/.bin/protoc-gen-ts_proto" \
    --ts_proto_opt=esModuleInterop=true \
    --ts_proto_out="src/generated" \
    proto/TockRequests.proto

    # --ts_proto_opt=forceLong=long\