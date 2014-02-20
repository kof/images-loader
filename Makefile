build:
	browserify -e ./index.js -o build/ImagesLoader.js -s ImagesLoader
	uglifyjs < ./build/ImagesLoader.js > ./build/ImagesLoader.min.js --comments license
	xpkg .


.PHONY: build
