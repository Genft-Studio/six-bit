function RGBToHSL(r, g, b) {
    if (Array.isArray(r)) {
        g = r[1];
        b = r[2];
        r = r[0];
    }
    var r = r / 255;
    var g = g / 255;
    var b = b / 255;
    var cMax = Math.max(r, g, b);
    var cMin = Math.min(r, g, b);
    var delta = cMax - cMin;
    if (delta == 0) {
        var h = 0;
    } else if (cMax == r) {
        var h = 60 * (((g - b) / delta) % 6);
    } else if (cMax == g) {
        var h = 60 * ((b - r) / delta + 2);
    } else if (cMax == b) {
        var h = 60 * ((r - g) / delta + 4);
    }
    if (h < 0) {
        h += 360;
    }
    var l = (cMax + cMin) / 2;

    if (delta == 0) {
        var s = 0;
    } else {
        var s = delta / (1 - Math.abs(2 * l - 1));
    }

    return [h, s, l]
}

function HSLToRGB(h, s, l) {
    if (Array.isArray(h)) {
        s = h[1];
        l = h[2];
        h = h[0];
    }
    var c = (1 - Math.abs(2 * l - 1)) * s;
    var x = c * (1 - Math.abs((h / 60) % 2 - 1));
    var m = l - c / 2;
    if (h >= 0 && h < 60) {
        var r = c,
            g = x,
            b = 0;
    } else if (h >= 60 && h < 120) {
        var r = x,
            g = c,
            b = 0;
    } else if (h >= 120 && h < 180) {
        var r = 0,
            g = c,
            b = x;
    } else if (h >= 180 && h < 240) {
        var r = 0,
            g = x,
            b = c;
    } else if (h >= 240 && h < 300) {
        var r = x,
            g = 0,
            b = c;
    } else if (h >= 300 && h < 360) {
        var r = c,
            g = 0,
            b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return [r, g, b];
}

function RGBToHex(arr) {
    var r = arr[0],
        g = arr[1],
        b = arr[2];
    return "#" + ("0" + r.toString(16)).slice(-2) + ("0" + g.toString(16)).slice(-2) + ("0" + b.toString(16)).slice(-2);
}

function derivePalette(r, g, b, invert) {
    var hsl = RGBToHSL(r, g, b);

    var h = hsl[0];
    var s = hsl[1];
    var l = hsl[2];
    var hx = h % 360;
    var hy = (h + 320) % 360;

    var c1 = HSLToRGB(hx, 1, 0.1);
    if (invert) {
        var c4 = HSLToRGB(hx, 1, 0.2);
        var c5 = HSLToRGB(hx, 1, 0.45);
        var c2 = HSLToRGB(hx, 1, 0.7);
        var c3 = HSLToRGB(hy, 1, 0.8);
    } else {
        var c2 = HSLToRGB(hx, 1, 0.2);
        var c3 = HSLToRGB(hx, 1, 0.45);
        var c4 = HSLToRGB(hx, 1, 0.7);
        var c5 = HSLToRGB(hy, 1, 0.8);

    }

    return [
        null,
        RGBToHex(c1),
        RGBToHex(c2),
        RGBToHex(c3),
        RGBToHex(c4),
        RGBToHex(c5)
    ];
}

function hexToBytes(hex){
    var result = []
    for(var i = 0; i < hex.length; i+=2){
        result.push(parseInt(hex.slice(i, i+2),16));
    }
    return result;
}



const pixelDataToArray = (data) => {
    // TODO: Take color palette as an argument (instead of using this ghostly demo)
    const colors = [null, "#555555", "#d3d3d3", "#ffffff", "#aaaaaa", "#ff9999"];

    let pixelArray = data.split("\n").map(function(row) {
        return row.split(" ").map(function(x) {
            return parseInt(x, 10);
            // return colors[parseInt(x, 10)];
        });
    })
    return pixelArray
}

/*
export function generateImage2(gashapon) {
    console.log("generateImage2 gashapon: ", gashapon)

    let canvas = document.createElement("canvas");

}
 */

export function generateImage(data, size, drawStyle= 0) {
    console.log("generateImage data: ", data)
    size = size || 10;

    // const drawStyle = 3

    const colors = [null, "#555555", "#d3d3d3", "#ffffff", "#aaaaaa", "#ff9999"];
    // const colors = [null, "#FF5555", "#d3FFd3", "#ffff99", "#aa99aa", "#ff9999"];
    console.log("size: ", size)

    let canvas = document.createElement("canvas");
    try {
        // console.log("data.length: ", data.length)
        // console.log("data[1].length: ", data[1].length)

        const pixelArray = pixelDataToArray(data)
        // const data = mooncatparser(catId);

        canvas.width = size * pixelArray.length;
        canvas.height = size * pixelArray[1].length;
        let ctx = canvas.getContext("2d");

        console.log("generateImage pixelArray: ", pixelArray)
        console.log("data.length: ", pixelArray.length)
        console.log("data[1].length: ", pixelArray[1].length)


        for (let i = 0; i < pixelArray.length; i++) {
            for (let j = 0; j < pixelArray[i].length; j++) {
                // const color = pixelArray[i][j];
                const color = colors[pixelArray[i][j]];
                if (color) {
                    if(drawStyle === 0) {
                        // regular rectangular pixels
                        ctx.fillStyle = color;
                        ctx.fillRect(j * size, i * size, size, size);
                    }
                    else if(drawStyle === 1) {
                        // text index number pixels
                        ctx.fillStyle = color;
                        ctx.strokeStyle = color;
                        ctx.font = size.toString() + 'px sans-serif';
                        // ctx.fillText(pixelArray[i][j], j * size, (i * size) + size, size);
                        ctx.strokeText(pixelArray[i][j], j * size, (i * size) + size, size);
                    }
                    else if(drawStyle === 2) {
                        // colored, unfilled circle pixels
                        ctx.strokeStyle = color
                        ctx.beginPath();
                        ctx.arc(5 + j * size, 5 + i * size, size/3, 0, Math.PI * 2, true);
                        ctx.stroke();
                    }
                    else if(drawStyle === 3) {
                        // unfilled rectangle pixels
                        ctx.strokeStyle = color;
                        ctx.lineWidth = size / 3;
                        ctx.lineJoin = "round"
                        ctx.strokeRect((j * size) + 1, (i * size) + 1, size-2, size-2);
                    }
                    else if(drawStyle === 4) {
                    }

                    // console.log("color: ", color, "fillRect: ", i * size, j * size, size, size)
                }
            }
        }
    } catch (e) {
        console.log("ERROR: Problem generating image from data", e.toString())
    }
    return canvas.toDataURL();
}

/*
export function gashaponParser (dna="", genome) {
    if(dna === "" || dna === "0x") {
        return;
    }
    console.log("dna: ", dna)   // DELETE THIS!
    if(dna.slice(0,2) == "0x"){
        dna = dna.slice(2);
    }
    var bytes = hexToBytes(dna);
    var genesis = bytes[0],
        k = bytes[1],
        r = bytes[2],
        g = bytes[3],
        b = bytes[4];

    var size = size || 10;
    var invert = k >= 128;

    console.log("genesis: ", genesis, ", k: ", k, ", r: ", r, ", g: ", g, ", b: ", b, "size: ", size, ", invert: ", invert)

    // k = k % 128;
    // var design = designs[k].split(".");
    k = k % genome.assets.length;
    var design = pixelDataToArray(genome.assets[k]);
    console.log("k: ", k, ", design", design);  // TODO: DELETE THIS!
    var colors;
    if(genesis){
        if(k % 2 === 0 && invert || k % 2 === 1 && !invert){
            colors = [null, "#555555", "#d3d3d3", "#ffffff", "#aaaaaa", "#ff9999"];
        }else{
            colors = [null, "#555555", "#222222", "#111111", "#bbbbbb", "#ff9999"];
        }
    }else{
        // TODO: Enable derivePallete and remove sample palette being used:
        // colors = derivePalette(r, g, b, invert);
        colors = [null, "#555555", "#d3d3d3", "#ffffff", "#aaaaaa", "#ff9999"];
    }

    return design.map(function(row){
        return row.map(function(cell){
            return colors[cell];
        })
    })
}
*/

/**
 * Produce the asset's details by parsing it's unique DNA against the Genome.
 * @param {string} dna - DNA hexcode.
 * @param {string} genome - Dataset and settings defining a collection.
 */
export function gashaponParser(dna, genome) {

    let gashapon = {
        dna: dna,
        red: null,
        green: null,
        blue: null,
        invert: false,
        designNumber: 0,
        design: [],
        colors: [],
    }

    console.log("DEBUG: gashaponParser: dna: ", dna, ", genome: ", genome)   // DELETE THIS AND ANY CONSOLE.LOGS IN THIS FILE!
    if (!(typeof dna === 'string' || dna instanceof String))
    {
        throw new Error("dna must be a string")
    }
    if(dna.slice(0,2) === "0x"){
        dna = dna.slice(2);
    }
    if(dna === "") {
        throw new Error("dna is empty")
    }
    console.log("DEBUG: dna: ", dna)   // DELETE THIS AND ANY CONSOLE.LOGS IN THIS FILE!

    // TODO: Validate dna hexcode structure is the right characters and length
    let bytes
    try {
        bytes = hexToBytes(dna)
    } catch (e) {
        throw new Error("hexToBytes failed: ", e.toString())
    }
    console.log("DEBUG: bytes: ", bytes)   // DELETE THIS AND ANY CONSOLE.LOGS IN THIS FILE!

    // Validate genome structure
    if (typeof genome === 'undefined' ||
        typeof genome.assets === "undefined" ||
        genome.assets.length < 1) {
        throw new Error("genome assets not defined or missing")
    }

    // NOTE: This is using a 5 byte DNA as an ID, based on MoonCats - this may be modified
    //       uint256 is 32 bytes, so there's lots of room to work with
    var genes0 = bytes[0],
        genes1 = bytes[1]

    gashapon.red = bytes[2]
    gashapon.green = bytes[3]
    gashapon.blue = bytes[4]

    gashapon.invert = genes1 >= 128
    genes1 = genes1 % 128
    gashapon.designNumber = genes1 % genome.assets.length

    // const design = genome.assets[gashapon.designNumber]
    gashapon.design = pixelDataToArray(genome.assets[gashapon.designNumber]);

    const size = 10

    gashapon.colors = derivePalette(gashapon.red, gashapon.green, gashapon.blue, gashapon.invert);

    console.log("DEBUG: genome.assets.length: ", genome.assets.length, ", designNumber: ", gashapon.designNumber, ", design: ", gashapon.design)   // DELETE THIS AND ANY CONSOLE.LOGS IN THIS FILE!
    console.log("DEBUG: genes0: ", genes0, ", genes1: ", genes1, ", red: ", gashapon.red, ", green: ", gashapon.green, ", blue: ", gashapon.blue, "size: ", size, ", invert: ", gashapon.invert)   // DELETE THIS AND ANY CONSOLE.LOGS IN THIS FILE!
    console.log("DEBUG: colors: ", gashapon.colors)   // DELETE THIS AND ANY CONSOLE.LOGS IN THIS FILE!

    // TODO: Implement custom palettes
    // TODO: Parse assets and parameters from genome using genes0 and genes1

    gashapon.drawGene = genes0 % 8

    return gashapon
}

export function gashaponImage(gashapon, genome) {
    const size = 10
    console.log("DEBUG: gashapon.design", gashapon.design)  // TODO: DELETE THIS LINE
    console.log("DEBUG: gashapon.colors", gashapon.colors)  // TODO: DELETE THIS

    let canvas = document.createElement("canvas");
    try {
        canvas.width = size * gashapon.design.length;
        canvas.height = size * gashapon.design[1].length;
        let ctx = canvas.getContext("2d");
        for (let i = 0; i < gashapon.design.length; i++) {
            for (let j = 0; j < gashapon.design[i].length; j++) {
                const color = gashapon.colors[gashapon.design[i][j]];
                if (color) {
                    if (gashapon.drawGene == 0) {
                        // text index number pixels
                        ctx.fillStyle = color;
                        ctx.strokeStyle = color;
                        ctx.font = size.toString() + 'px sans-serif';
                        // ctx.fillText(gashapon.design[i][j], j * size, (i * size) + size, size);
                        ctx.strokeText(gashapon.design[i][j], j * size, (i * size) + size, size);
                    } else if (gashapon.drawGene <= 1) {
                        // unfilled rectangle pixels
                        ctx.strokeStyle = color;
                        ctx.lineWidth = size / 3;
                        ctx.lineJoin = "round"
                        ctx.strokeRect((j * size) + 1, (i * size) + 1, size - 2, size - 2);
                    } else if (gashapon.drawGene <= 2) {
                        // colored, unfilled circle pixels
                        ctx.strokeStyle = color
                        ctx.beginPath();
                        ctx.arc(5 + j * size, 5 + i * size, size / 3, 0, Math.PI * 2, true);
                        ctx.stroke();
                    } else {
                        // regular rectangular pixels
                        ctx.fillStyle = color;
                        ctx.fillRect(j * size, i * size, size, size);
                    }
                }
            }
        }
    } catch (e) {
        console.log("ERROR: Problem generating image from data", e.toString())
    }
    return canvas.toDataURL();
}

/*
var mooncatparser = function (catId){
    if(catId.slice(0,2) == "0x"){
        catId = catId.slice(2);
    }
    var bytes = hexToBytes(catId);
    var genesis = bytes[0],
        k = bytes[1],
        r = bytes[2],
        g = bytes[3],
        b = bytes[4];

    var size = size || 10;
    var invert = k >= 128;
    k = k % 128;
    var design = designs[k].split(".");
    var colors;
    if(genesis){
        if(k % 2 === 0 && invert || k % 2 === 1 && !invert){
            colors = [null, "#555555", "#d3d3d3", "#ffffff", "#aaaaaa", "#ff9999"];
        }else{
            colors = [null, "#555555", "#222222", "#111111", "#bbbbbb", "#ff9999"];
        }
    }else{
        colors = derivePalette(r, g, b, invert);
    }

    return design.map(function(row){
        return row.split("").map(function(cell){
            return colors[cell];
        })
    })
}
*/


// export default generateImage
export default { gashaponImage, gashaponParser, generateImage }
