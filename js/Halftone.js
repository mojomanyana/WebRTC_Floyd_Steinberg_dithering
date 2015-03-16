/**
 * Created by MojoManyana on 16.3.2015.
 */

window.URL =
    window.URL ||
    window.webkitURL ||
    window.mozURL ||
    window.msURL;

navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

var Halftone = function() {
    this.palette = new Array(8);
    this.palette[0] = new ColorRgb(0, 0, 0);
    this.palette[1] = new ColorRgb(0, 0, 255);
    this.palette[2] = new ColorRgb(0, 255, 0);
    this.palette[3] = new ColorRgb(0, 255, 255);
    this.palette[4] = new ColorRgb(255, 0, 0);
    this.palette[5] = new ColorRgb(255, 0, 255);
    this.palette[6] = new ColorRgb(255, 255, 0);
    this.palette[7] = new ColorRgb(255, 255, 255);
}

Halftone.prototype.video;
Halftone.prototype.canvas;
Halftone.prototype.context2d;
Halftone.prototype.width;
Halftone.prototype.height;
Halftone.prototype.palette;

Halftone.prototype.startProcessing = function (canvas) {
    this.video = document.createElement("video");
    this.video.width = canvas.width;
    this.video.height = canvas.height;
    this.width = canvas.width;
    this.height = canvas.height;
    this.canvas = canvas;
    this.context2d = this.canvas.getContext("2d");

    var self = this;

    this.video.addEventListener("play", function() {
        self.timerCallback();
    }, false);

    navigator.getUserMedia(
        {
            video: true,
            audio: false
        },
        function (stream) {
            self.video.src = URL.createObjectURL(stream);
            self.video.play();
        },
        function (error) {
            alert(JSON.stringify(error, null, '\t'));
        });
};

Halftone.prototype.timerCallback = function() {
    if (this.video.paused || this.video.ended) {
        return;
    }
    this.computeFrame();
    var self = this;
    setTimeout(function () {
        self.timerCallback();
    }, 50);
};

Halftone.prototype.computeFrame = function() {
    this.context2d.drawImage(this.video, 0, 0, this.width, this.height);
    var frame = this.context2d.getImageData(0, 0, this.width, this.height);
    this.applyEffect(frame);
    return;
};

Halftone.prototype.applyEffect = function (frame){

    var w = this.width;
    var h = this.height;
    var d = new Array(h);

    for (var y = 0; y < h; y++) {
        d[y] = new Array(w);
        for (var x = 0; x < w ; x++) {
            var pixelBasePosition = x * 4 + y * w * 4;
            d[y][x] = new ColorRgb(frame.data[pixelBasePosition], frame.data[pixelBasePosition + 1], frame.data[pixelBasePosition + 2]);
        }
    }

    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            var pixelBasePosition = x * 4 + y * w * 4;
            var oldColor = d[y][x];
            var newColor = this.findClosestPaletteColor(oldColor, this.palette);

            var err = oldColor.sub(newColor);

            if (x+1 < w)         d[y  ][x+1] = d[y  ][x+1].add(err.mul(7./16));
            if (x-1>=0 && y+1<h) d[y+1][x-1] = d[y+1][x-1].add(err.mul(3./16));
            if (y+1 < h)         d[y+1][x  ] = d[y+1][x  ].add(err.mul(5./16));
            if (x+1<w && y+1<h)  d[y+1][x+1] = d[y+1][x+1].add(err.mul(1./16));

            frame.data[pixelBasePosition] = newColor.r;
            frame.data[pixelBasePosition + 1] = newColor.g;
            frame.data[pixelBasePosition + 2] = newColor.b;
            frame.data[pixelBasePosition + 3] = 255;
        }
    }

    this.context2d.putImageData(frame, 0, 0);
};

Halftone.prototype.findClosestPaletteColor = function(c3, palette) {
    var closest = palette[0];

    palette.forEach(function(n) {
        if (n.diff(c3) < closest.diff(c3))  {
            closest = n;
        }
    });

    return closest;
};



