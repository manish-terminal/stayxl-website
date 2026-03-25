build-StayXLApiFunction:
	GOOS=linux GOARCH=arm64 go build -tags lambda.norpc -o bootstrap ./cmd/api
	cp bootstrap $(ARTIFACTS_DIR)/.
