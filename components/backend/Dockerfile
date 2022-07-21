# Build the controller binary
FROM eu.gcr.io/kyma-project/external/golang:1.18.3-alpine3.16 as builder
ARG DOCK_PKG_DIR=/go/src/github.com/vladislavpaskar/hackathon2022/components/backend
WORKDIR $DOCK_PKG_DIR

COPY go.mod go.mod
COPY go.sum go.sum
COPY clients/ clients/
COPY main.go main.go

# Build
RUN GOOS=linux GO111MODULE=on go mod vendor && \
    CGO_ENABLED=0 GOOS=linux GO111MODULE=on go build -a -o backend .

FROM gcr.io/distroless/static:nonroot
#LABEL source = git@github.com:kyma-project/kyma.git

WORKDIR /
COPY --from=builder /go/src/github.com/vladislavpaskar/hackathon2022/components/backend .
USER nonroot:nonroot

ENTRYPOINT ["/backend"]
