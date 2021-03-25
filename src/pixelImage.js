
const pixelDataToArray = (data) => {
    // TODO: Take color palette as an argument (instead of using this ghostly demo)
    const colors = [null, "#555555", "#d3d3d3", "#ffffff", "#aaaaaa", "#ff9999"];

    let pixelArray = data.split("\n").map(function(row) {
        return row.split(" ").map(function(x) {
            // return parseInt(x, 10);
            return colors[parseInt(x, 10)];
        });
    })
    return pixelArray
}

const generateImage = (data, size) => {
    console.log("generateImage data: ", data)
    size = size || 10;

    // const colors = [null, "#555555", "#d3d3d3", "#ffffff", "#aaaaaa", "#ff9999"];
    const colors = [null, "#FF5555", "#d3FFd3", "#ffff99", "#aa99aa", "#ff9999"];
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
                const color = pixelArray[i][j];
                // const color = colors[pixelArray[i][j]];
                if (color) {
                    ctx.fillStyle = color;
                    ctx.fillRect(j * size, i * size, size, size);
                    // console.log("color: ", color, "fillRect: ", i * size, j * size, size, size)
                }
            }
        }
    } catch (e) {
        console.log("ERROR: Problem generating image from data", e.toString())
    }
    return canvas.toDataURL();
}

export default generateImage
