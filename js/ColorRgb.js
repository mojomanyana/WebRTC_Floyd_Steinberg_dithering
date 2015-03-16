/**
 * Created by MojoManyana on 16.3.2015.
 */

var ColorRgb = function(r,g,b) {
    this.r = r;
    this.g = g;
    this.b = b;
}

ColorRgb.prototype.r;
ColorRgb.prototype.g;
ColorRgb.prototype.b;

ColorRgb.prototype.add = function(c) {
    return new ColorRgb(this.r + c.r, this.g + c.g, this.b + c.b);
};

ColorRgb.prototype.sub = function(c) {
    return new ColorRgb(this.r - c.r, this.g - c.g, this.b - c.b);
};

ColorRgb.prototype.mul = function(double) {
    var rr = (double * this.r)|0;
    var gg = (double * this.g)|0;
    var bb = (double * this.b)|0;
    return new ColorRgb(rr, gg, bb);
};

ColorRgb.prototype.diff = function(c) {
    return Math.abs(this.r - c.r) +  Math.abs(this.g - c.g) +  Math.abs(this.b - c.b);
};
