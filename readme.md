## Ultra performant dependences free images loader

- Uses pool of Image instances, which are reused
- Custom timeout.
- Avoids double loaded images when required in parallel.
- Dependences free tiny module.

## Possible usecases:

- You need to know the size of the image before you render it.
- You need to load a big amount of images and keep track which one was loaded which one not.
- You want to load lots of images, but not more than X in parallel.
- You want to keep performance load low by keeping the pool small.
- You don't want create new Image instance for each load.

## API

### Load

    // Commonjs
    var ImagesLoader = require('images-loader')

    // Global
    var ImagesLoader = window.ImagesLoader

### Create instance `new ImagesLoder([options])`

Options:

   - `pool` amount of img elements to use for loading, defaults to 5
   - `timeout` defaults to 3000

### Load `loader.load(url, [callback])`

    // `data` contains width and size.
    loader.load('/my/image.jpg', function(err, data) {
        console.log(err, data)
    })

### Set/get pool size loader.pool([length])

    // Get the pool length
    loader.pool()

    // Set the pool length
    loader.pool(10)

## License

MIT



