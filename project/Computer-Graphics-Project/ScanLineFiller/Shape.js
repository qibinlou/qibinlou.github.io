/**
 * Created by louqibin on 11/24/14.
 */


(function (root, factory) {
    var _module = factory(root);
    if (typeof define === 'function' && define.amd) {
        define(function (require) {
            return _module;
        });
    } else if (typeof exports === 'object') {
        module.exports = _module;
    }
})(this, function (root) {

    'use strict';

    var shape = {};

    var LineType = {
        'LINE':     0,
        'SEGMENT':  1,
        'RAY':      2
    };


    /**
     * @param x {number}
     * @param y {number}
     * @constructor
     */
    shape.Point = function(x, y) {
        if (typeof x !== 'number' || typeof y !== 'number') {
            throw "Not a valid point!";
        }
        this.x = x;
        this.y = y;
    };


    /**
     *
     * @param start {Point}
     * @param end {Point}
     * @param type {LineType}
     * @constructor
     */
    shape.Line = function(start, end, type) {
        this.start = start;
        this.end = end;
        this.type = type;
    };




    /**
     * create a new Polygon
     * @param vertexes {Array.<Point>}
     * @constructor
     */
    shape.Polygon = function(vertexes) {
        if (vertexes.length < 3) {
            //throw "Not a valid polygon!";
        }
        this.vertexes = vertexes;
        this.edges = this.getEdgesByVertexes(vertexes);


    };

    /**
     * @param vertexes {Array.<Point>}
     * @return {Array.<Line>}
     */
    shape.Polygon.prototype.getEdgesByVertexes = function(vertexes){
        var length = vertexes.length;
        var index = 0;
        var edges = [];
        while (index < length) {
            var next = (index + 1) % length;
            edges.push(new shape.Line(vertexes[index], vertexes[next], LineType.SEGMENT));
            index++;
        }
        return edges;
    };


    /**
     *
     * @param width {number}
     * @param [height] {number}
     * @param [defaultValue] {Array.<number>} RGBA data
     * @constructor
     */
    shape.Graph = function(width, height, defaultValue) {
        height = typeof height === 'undefined' ? width : height;
        defaultValue = typeof defaultValue === 'undefined' ? [0, 0, 0, 0] : defaultValue;

        var data = new Array(height);
        for (var i = 0; i < height; ++i) {
            data[i] = new Array(width);
            for (var j = 0; j < width; ++j) {
                data[i][j] = defaultValue;
            }
        }
        this.width = width;
        this.height = height;
        this.data = data;
    };

    /**
     *
     */
    shape.Graph.prototype.print = function() {
        for (var i = 0; i < this.height; ++i) {
            for (var j = 0; j < this.width; ++j) {
                console.log(this.data[i][j]);
            }
        }
    };

    /**
     * @return {ImageData}
     */
    shape.Graph.prototype.toImageData = function() {
        var imd = {};
        imd.width = this.width;
        imd.height = this.height;
        imd.data = new Uint8ClampedArray(this.width * this.height * 4);
        var pos = 0;
        for (var i = 0; i < this.height; ++i) {
            for (var j = 0; j < this.width; ++j) {
                for (var k = 0; k < 4; ++k) {
                    imd.data[pos++] = this.data[i][j][k];
                }
            }
        }
        return imd;
    };

    return shape;

});