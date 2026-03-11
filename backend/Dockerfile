FROM alpine:latest

RUN apk add --no-cache ca-certificates

WORKDIR /pb

COPY pocketbase /pb/pocketbase
COPY pb_hooks /pb/pb_hooks
COPY pb_migrations /pb/pb_migrations

RUN chmod +x /pb/pocketbase

EXPOSE 8080

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080", "--automigrate"]