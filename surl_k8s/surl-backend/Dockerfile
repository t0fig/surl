FROM golang
RUN mkdir /app
ADD . /app
WORKDIR /app
RUN go mod download
RUN go build -o goapp
EXPOSE 4000
CMD ["./goapp"]
