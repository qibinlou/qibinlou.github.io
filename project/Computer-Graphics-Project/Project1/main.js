/**
 * Created by louqibin on 11/25/14.
 */

require.config({
   paths: {
       'ScanLineFiller': '../ScanLineFiller/ScanLineFiller',
       'Shape': '../ScanLineFiller/Shape'
   }
});


define(function(require) {

    'use strict';

    var shape = require('Shape');
    var filler = require('ScanLineFiller');

    var CanvasHelper = (function() {


        return {
            /**
             * @param context
             * @param points {Array.<Point> | Point}
             */
            'drawPoints': function drawPoints(context, points) {
                if (typeof points === 'point') {
                    points = [points];
                }
                context.font = '15px Georgia';
                var length = points.length;
                for (var i = 0; i < length; ++i) {
                    // do nothing, because it is a point, just write the index of the point
                    context.fillText((i + 1).toString(), points[i].x, points[i].y);
                }
            },

            /**
             *
             * @param context
             * @param lines {Array.<Line>}
             */
            'drawLines': function drawLines(context, lines) {
                var length = lines.length;
                context.strokeStyle = '#FF0000';
                for (var i = 0; i < length; ++i) {
                    context.moveTo(lines[i].start.x, lines[i].start.y);
                    context.lineTo(lines[i].end.x, lines[i].end.y);
                    context.stroke();
                }

            },

            /**
             * @param context
             * @param polygon {Polygon}
             */
            'drawPolygon': function drawPolygon(context, polygon) {
                context.beginPath();
                this.drawPoints(context, polygon.vertexes);
                this.drawLines(context, polygon.edges);
                context.closePath();
            },

            /**
             *
             * @param origin {ImageData}
             * @param filled {ImageData}
             */
            'mergeImageData': function mergeImageData(origin, filled) {
                if (origin.width != filled.width || origin.height != filled.height) {
                    throw "ImageData not matched!";
                }
                var length = origin.data.length;
                for (var i = 0; i < length; ++i) {
                    origin.data[i] = filled.data[i] === 0 ? origin.data[i] : filled.data[i];
                }
                return origin;
            },

            /**
             * @param canvas
             * @param context
             */
            'clearCanvas': function clearCanvas(canvas, context) {
                context.closePath();
                //context.fillStyle = '#';
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.beginPath();
            }


        };
    })();

    /**
     *
     * @param cxt
     * @param vertexes
     */
    function createPolygon(cxt, vertexes) {
        var polygon = new shape.Polygon(vertexes);
        CanvasHelper.drawPolygon(cxt, polygon);


        var scanlinefiller = new filler.ScanLineFiller();
        var filledPart = scanlinefiller.fill(polygon, [0, 128, 0, 255]);
        var graphData = cxt.getImageData(filledPart['box']['x_min'], filledPart['box']['y_min'],
            filledPart['box']['x_max'] - filledPart['box']['x_min'], filledPart['box']['y_max'] - filledPart['box']['y_min']);
        var filledData = filledPart.graph.toImageData();

        graphData = CanvasHelper.mergeImageData(graphData, filledData);
        cxt.putImageData(graphData, filledPart['box']['x_min'], filledPart['box']['y_min']);
        CanvasHelper.drawPoints(cxt, polygon.vertexes);

    }

    var staticDemo  = (function() {
        var mycanvas = document.getElementById('mycanvas1');
        var cxt = mycanvas.getContext('2d');


        // Demo 1
        var vertexes = [
            new shape.Point(10, 10),
            new shape.Point(30, 90),
            new shape.Point(100, 120),
            new shape.Point(100, 20)
        ];
        createPolygon(cxt, vertexes);

        // Demo 2
        vertexes = [
            new shape.Point(210, 10),
            new shape.Point(230, 90),
            new shape.Point(200, 120)
        ];
        createPolygon(cxt, vertexes);

        // Demo 3
        vertexes = [
            new shape.Point(310, 10),
            new shape.Point(390, 10),
            new shape.Point(390, 100)
        ];
        createPolygon(cxt, vertexes);

        // Demo 4
        vertexes = [
            new shape.Point(450, 10),
            new shape.Point(550, 10),
            new shape.Point(600, 60),
            new shape.Point(550, 120),
            new shape.Point(450, 120),
            new shape.Point(400, 60)
        ];
        createPolygon(cxt, vertexes);

        // Demo 5
        var vertexes = [
            new shape.Point(610, 100),
            new shape.Point(630, 50),
            new shape.Point(660, 100),
            new shape.Point(690, 12),
            new shape.Point(720, 100),
            new shape.Point(750, 50),
            new shape.Point(780, 100),
            new shape.Point(810, 12),
            new shape.Point(840, 100),
            new shape.Point(700, 150)


        ];
        createPolygon(cxt, vertexes);


    })();


    var randomDemo = (function() {
        var generator = document.getElementById('nrp');
        generator.addEventListener('click', generateRandomPolygon);
        var mycanvas = document.getElementById('mycanvas2');
        var cxt = mycanvas.getContext('2d');
        var maxnumber = document.getElementById('maxnumber');
        /**
         *
         * @param event
         */
        function generateRandomPolygon(event) {


            var width = mycanvas.width;
            var height = mycanvas.height;

            cxt.clearRect(0, 0, width, height);

            var numbers = Math.ceil(Math.random() * maxnumber.value) + 2;
            var vertexes = [];
            var pre = 0;
            var w, h, p;
            for (var i = 0; i < numbers / 2; ++i) {
                while (w = Math.ceil(Math.random() * width), w < pre) {};
                while (h = Math.ceil(Math.random() * height), h> height / 2) {};
                p = new shape.Point(w, h);
                pre = w;
                vertexes.push(p);
            }

            pre = width;
            for (i = 0; i < numbers / 2; ++i) {
                while (w = Math.ceil(Math.random() * width), w > pre) {};
                while (h = Math.ceil(Math.random() * height), h < height / 2) {};
                var p = new shape.Point(w, h);
                pre = w;
                vertexes.push(p);
            }
            createPolygon(cxt, vertexes);

        };
    })();


    var diyDemo = (function() {

        var mycanvas = document.getElementById('mycanvas3');
        var cxt = mycanvas.getContext('2d');
        var width = mycanvas.width;
        var height = mycanvas.height;

        var vertexes = [];

        document.getElementById('clear').addEventListener('click', function() {
            CanvasHelper.clearCanvas(mycanvas, cxt);
            vertexes = [];

        });

        document.getElementById('back').addEventListener('click', function() {
            if (vertexes.length > 0) {
                vertexes.pop();
                CanvasHelper.clearCanvas(mycanvas, cxt);
                if (vertexes.length > 0) {
                    createPolygon(cxt, vertexes);
                }

            }
        });


        mycanvas.addEventListener('dblclick', function(event) {
            var p = new shape.Point(event.offsetX, event.offsetY);
            vertexes.push(p);
            CanvasHelper.clearCanvas(mycanvas, cxt);
            createPolygon(cxt, vertexes);
        });






    })();




});