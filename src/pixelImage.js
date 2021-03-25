export default class pixelArtParser {
    generateImage(data, size) {
        size = size || 10;
        let canvas = document.createElement("canvas");
        try {
            // const data = mooncatparser(catId);
            canvas.width = size * data.length;
            canvas.height = size * data[1].length;
            let ctx = canvas.getContext("2d");

            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].length; j++) {
                    const color = data[i][j];
                    if (color) {
                        ctx.fillStyle = color;
                        ctx.fillRect(i * size, j * size, size, size);
                    }
                }
            }
        } catch (e) {
            console.log("ERROR: Problem parsing moon cat ID", e.toString())
        }
        return canvas.toDataURL();
    }

    pixelDataToArray = (data) => {
        let array = data.split("\n").map(function(row) {
            return row.split(" ").map(function(x) {
                return parseInt(x, 10);
            });
        })
        return array
    }

}



/*
export default function pixelImage(data, palette) {

    const pixelDataToArray = (data) => {
        let array = data.split("\n").map(function(row) {
            return row.split(" ").map(function(x) {
                return parseInt(x, 10);
            });
        })
        return array
    }


    // TODO: populate data cells with color
    function generatePixelImageFromData(data, size) {
        size = size || 10;
        let canvas = document.createElement("canvas");
        try {
            canvas.width = size * data.length;
            canvas.height = size * data[1].length;
            let ctx = canvas.getContext("2d");

            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].length; j++) {
                    const color = data[i][j];
                    if (color) {
                        ctx.fillStyle = color;
                        ctx.fillRect(i * size, j * size, size, size);
                    }
                }
            }
        } catch (e) {
            console.log("ERROR: Problem parsing pixel image data", e.toString())
        }
        return canvas.toDataURL();
    }

}

 */