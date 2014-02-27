!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ImagesLoader=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

/*!
 * Ultra performant dependences free images loader.
 *
 * @copyright Oleg Slobodskoi 2014
 * @website https://github.com/kof/images-loader
 * @license MIT
 */

/**
 * ImagesLoader constructor.
 *
 * Options:
 *   - `pool` amount of img elements to use for loading, defaults to 5
 *   - `timeout` defaults to 3000
 *
 * @param {Object} [options]
 * @api public
 */
function ImagesLoader(options) {
    this.options = options || {}
    this.options.pool || (this.options.pool = 5)
    this.options.timeout != null || (this.options.timeout = 3000)

    // Images pool.
    this._pool = []
    // Urls queue, first loaded first.
    this._queue = []
    // Urls-callbacks map of pending requests.
    this._callbacks = {}
    this.pool(this.options.pool)

}

ImagesLoader.emptyGif = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='

module.exports = ImagesLoader

/**
 * Load image, callback when its done.
 * Pass an error as first argument if there is any.
 * Pass image size if loaded.
 *
 * @param {String} url
 * @param {Function} [callback]
 * @api public
 */
ImagesLoader.prototype.load = function(url, callback) {
    // Url is already pending, just add the callback.
    if (this._callbacks[url]) {
        this._callbacks[url].push(callback)

    // We have an available img to use.
    } else if (this._pool.length) {
        this._callbacks[url] = [callback]
        // Remove img from the pool.
        this._load(this._pool.pop(), url)

    // We have to queue it.
    } else {
        this._queue.push(arguments)
    }

    return this
}

/**
 * Setter/getter for pool length.
 *
 * @param {Number} [length]
 * @return {Number}
 */
ImagesLoader.prototype.pool = function(length) {
    var i

    if (length == null) return this.options.pool

    for (i = 0; i < length; i++) {
        this._pool.push(new Image)
    }

    return this.options.pool = length
}

/**
 * Load image, call the callbacks.
 *
 * @param {Image} img
 * @param {String} url
 *
 * @api private
 */
ImagesLoader.prototype._load = function(img, url) {
    var self = this,
        timeoutId

    img.onerror = img.onload = function(event) {
        var err, i,
            size,
            callbacks = self._callbacks[url]

        if (event.type == 'error' || event.type == 'timeout') {
            err = new Error('Could not load image: ' + url)
            err.type = event.type
            err.event = event
        } else {
            size = {width: img.width, height: img.height}
        }

        for (i = 0; i < callbacks.length; i++) {
            if (callbacks[i]) callbacks[i](err, size)
        }

        delete self._callbacks[url]

        // If you don't clean up the src attr, next time when you assign the
        // same url, no events will be triggered.
        img.onerror = img.onload = null
        // If you assign null or undefined - it will cast it to string
        // and try to load from there.
        img.src = ImagesLoader.emptyGif
        // Make img available in the pool again.
        self._pool.push(img)
        if (timeoutId) clearTimeout(timeoutId)
        self._next()
    }
    img.src = url

    if (this.options.timeout) {
        timeoutId = setTimeout(function() {
            img.onerror({type: 'timeout'})
        }, this.options.timeout)
    }
}

/**
 * Load the next item from the pool if there is any.
 *
 * @api private
 */
ImagesLoader.prototype._next = function() {
    if (this._queue.length) this.load.apply(this, this._queue.shift())
}


},{}]},{},[1])
(1)
});