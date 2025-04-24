# Backend
The backend is written in Go and we are using the http web framework [Gin](https://github.com/gin-gonic/gin) to handle requests from the client.

## Build instructions
### Setup the environment
1) [Install Go](https://go.dev/doc/install)
2) On the terminal go to the backend folder: `cd backend`
3) Copy the file `example-config.yaml` file to the root of the backend directory with the name `config.yaml` (i.e. the directory below src and bin) and modify it with your data: `cp example-config.yaml config.yaml`. Note, the canvas api token is not being used yet, it's there in case we need to use it later.

### Run the server
* If you are on Mac or Linux and/or have Make installed, you can run the command `make run` in the `src`.
    * To only build the binary run the command `make build`. The binary will be in the bin folder.

* If you are not on Mac or Linux or don't have Make installed, run the following commands inside the `src` directory:
    1) `go get .` This is used to download libraries, you don't need to run this every time but it doesn't hurt.
    2) `go build -o ../bin/SLP-backend` This compiles the binary and saves it in the bin directory.
    3) `../bin/SLP-backend --config ../config.yaml` This runs the binary and starts the backend server. 

## DB Design
Look at the db.sql file