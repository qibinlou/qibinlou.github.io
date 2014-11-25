(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['require', 'Shape'], function (require) {
            return factory(root);
        });
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    }
})(this, function (root) {

    'use strict';

    var shape = require('./Shape');

    /**
     * @constructor
     */
    function ScanLineFiller() {
        this.init();
    };

    ScanLineFiller.prototype.init = function (argument) {
    };


    /**
     * [fill description]
     //* @param graph {Array.<Array<number>>}
     * @param polygon {Polygon}
     * @param {Render | number} [render] an optional render object, e.g. fill the pixel with the same color #xxx;
     *                          or smartly fill according to the pixel's position
     */
    ScanLineFiller.prototype.fill = function (polygon, render) {
        var box = this.getBoundingBox(polygon.vertexes);
        var edges = polygon.edges;
        var y_max = box['y_max'];
        var x_max = box['x_max'];
        var y_min = box['y_min'];
        var x_min = box['x_min'];
        var color = Array.isArray(render) ? render : [0, 0, 0, 0];

        var graph = new shape.Graph(Math.abs(x_max - x_min), Math.abs(y_max - y_min));
        for (var y = y_max - 1; y > y_min; --y) {
            var segment = new shape.Line(new shape.Point(x_min, y), new shape.Point(x_max, y));
            // the size of intersections.length must be even
            var intersections = this.getHorizontalInterSections(edges, segment);
            var pairs = Math.floor(intersections.length / 2);
            for (var i = 0; i < pairs; ++i) {
                var end = intersections[i * 2 + 1].x;
                for (var x = intersections[i * 2].x; x < end; ++x) {
                    // Point(x,y) is inside the polygon

                    graph.data[y - y_min][x - x_min] = color;
                }
            }
        }

        return {
            'box': box,
            'graph': graph
        }

    };

    /**
     *
     * @param edges
     * @param segment {Point}
     * @return {Array.<Point>}
     */
    ScanLineFiller.prototype.getHorizontalInterSections = function(edges, segment) {
        var points = [];
        var length = edges.length;
        for (var i = 0; i < length; ++i) {
            var y = segment.start.y;
            if ((y - edges[i].start.y) * (y - edges[i].end.y) < 0) {
                var x = (y - edges[i].start.y) * (edges[i].end.x - edges[i].start.x) /
                    (edges[i].end.y - edges[i].start.y) + edges[i].start.x;
                var p = new shape.Point(Math.floor(x), y);
                //p.ptype = 0;
                points.push(p);
            }
            else if (y === edges[i].end.y){
                for (var j = 0; j < length; ++j) {
                    if (j !== i && edges[j].start.y === y && edges[j].start.x === edges[i].end.x && (edges[j].end.y > y ^ edges[i].start.y > y)) {
                        p = new shape.Point(edges[i].end.x, y);
                        points.push(p);
                        break;
                    }
                }




            }
        }

        points.sort(function(a, b) {
            return a.x > b.x;
        });
        //var pos = 0;
        //while (pos < points.length) {
        //    if (points[pos].ptype === 1) {
        //        points.splice(pos, 1);
        //    }
        //    else {
        //        pos += 2;
        //
        //    }
        //}
        return points;
    };

    /**
     *
     * @param points {Array.<Point>}
     * @param cmp {function}
     * @deprecated
     */
    ScanLineFiller.prototype.sort = function(points, cmp) {
        var size = points.length;
        if (size < 2) {
            return;
        }
        cmp = typeof cmp === 'function' ? cmp : function(a, b){return a.x < b.x};
        for (var i = 0; i < size; ++i) {
            for (var j = size - 1; j > i; --j) {
                if (cmp(points[j], points[j - 1])) {
                    var tmp = points[j];
                    points[j] = points[j - 1];
                    points[j - 1] = tmp;
                }
            }
        }

    };

    /**
     * get the max border box of n points
     * @param {Array.<Point>} points  an array of n points
     */
    ScanLineFiller.prototype.getBoundingBox = function(points) {
        var n = points.length;
        var x_min = Number.MAX_VALUE;
        var y_min = Number.MAX_VALUE;
        var x_max = Number.MIN_VALUE;
        var y_max = Number.MIN_VALUE;
        for (var i = 0; i < n; ++i) {
            var x = points[i].x;
            var y = points[i].y;
            if (x < x_min) {
                x_min = x;
            }
            else if (x > x_max) {
                x_max = x;
            }

            if (y < y_min) {
                y_min = y;
            }
            else if (y > y_max) {
                y_max = y;
            }
        }
        // the order is: left top, right top, left bottom, right bottom
        return {
            'x_min': x_min,
            'y_min': y_min,
            'x_max': x_max,
            'y_max': y_max
        }
    };


    return {
        'ScanLineFiller': ScanLineFiller
    };

});

