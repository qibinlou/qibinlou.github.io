

var filler = require('./ScanLineFiller');
var shape = require('./Shape');

function main(argument) {

    testScanLineFill();

}

/**
 * test floodfill
 */
function testScanLineFill() {
    var scanlinefiller = new filler.ScanLineFiller();
    const size = 200;   // 200 * 200 px graph
    var graph = new shape.Graph(size).data;
    var vertexes = [
        new shape.Point(10, 10),
        new shape.Point(10, 100),
        new shape.Point(100, 10),
        new shape.Point(100, 100)
    ];
    var polygon = new shape.Polygon(vertexes);

    scanlinefiller.fill(polygon);

    console.log('test done.');



}

main();