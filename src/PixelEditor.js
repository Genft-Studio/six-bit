import "./PixelEditor.css"
import {useState} from "react";
import {useEffect} from "react";
import { Users, BrowserStorage } from '@spacehq/users'

function PixelEditor(props) {
    const emptyColor = "#ffffff"
    const [currentColor, setCurrentColor] = useState("1")
    const [color1, setColor1] = useState("331a00")
    const [color2, setColor2] = useState("663300")
    const [color3, setColor3] = useState("e67300")
    const [color4, setColor4] = useState("ffb366")
    const [color5, setColor5] = useState("ff9999")
    const [color6, setColor6] = useState("00bb00")
    const [iw, setIw] = useState("16")
    const [ih, setIh] = useState("16")
    const [grid, setGrid] = useState(true)
    const [pngPixelSize, setPngPixelSize] = useState("10")
    const [out, setOut] = useState("")
    // const [a, setA] = useState(initArray(16, 16))
    const initialState = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
    const [a, setA] = useState(initialState)
    const [pngSrc, setPngSrc] = useState("")
    const [mouseState, setMouseState] = useState(-1)

    const handleColorSelect = (changeEvent) => {
        console.log("Select color: ", changeEvent.target.value)
        setCurrentColor(changeEvent.target.value)
    }

    function initArray(w, h) {
        let imageArray = []
        for (let i = 0; i < h; i++) {
            let row = []
            imageArray.push(row);
            for (let j = 0; j < w; j++) {
                row.push(0)
            }
        }
        console.log("initArray: ", imageArray)
        return imageArray
    }

    function getActiveColorId() {
        return parseInt(currentColor, 10);
    }

    function getColorCode(colorId) {
        // console.log("Get Color Code: ", colorId)
        if (!colorId || colorId === 0) {
            return "#ffffff";
        }
        switch (colorId) {
            case 1 || "1":
                return "#" + color1
            case 2 || "2":
                return "#" + color2
            case 3 || "3":
                return "#" + color3
            case 4 || "4":
                return "#" + color4
            case 5 || "5":
                return "#" + color5
            case 6 || "6":
                return "#" + color6
            default:
                return "#ffffff"
        }
    }

    /*
function drawCanvas(array) {
    console.log("TODO: drawCanvas")
        $canvas.html('')
        array.forEach(function(subArray, i) {
            var $row = $("
                <div className='row'></div>
            ").appendTo($canvas);
            subArray.forEach(function (cell, j
            ) {
                var color = getColorCode(cell)
                var $cell = $("<div class='cell' style='background-color:" + color + "'></div>").appendTo($row)
                $cell.on("mousedown", function(e) {
                    var colorId = getActiveColorId();
                    var colorCode = getColorCode(colorId)
                    if (e.which === 1 && array[i][j] != colorId) {
                        array[i][j] = colorId;
                        $cell.css("background-color", colorCode);
                    } else {
                        array[i][j] = 0
                        $cell.css("background-color", emptyColor);
                    }
                });
                $cell.on("mouseenter", function(e) {
                    var colorId = getActiveColorId();
                    var colorCode = getColorCode(colorId);
                    if (e.which === 1) {
                        array[i][j] = colorId;
                        $cell.css("background-color", colorCode)
                    }
                    if (e.which === 3) {
                        array[i][j] = 0;
                        $cell.css("background-color", emptyColor);
                    }
                    e.preventDefault();
                    e.stopPropagation();
                })
            })
        })
        }
     */


    const handleReset = () => {
        console.log("Reset pixel canvas")
        setA(initArray(parseInt(iw, 10), parseInt(ih, 10)))
    }

    const handlePrint = () => {
        const print = a.map(function(row, i) {
            return row.join(" ")
        }).join("\n")
        console.log(print)
        setOut(print)
    }

    const handleRead = () => {
        let str = out;
        let array = str.split("\n").map(function(row) {
            return row.split(" ").map(function(x) {
                return parseInt(x, 10);
            });
        })
        let newA = array
        setA(newA)
        // drawCanvas(newA)
        console.log(newA)
    }

    const handleRedraw = () => {
        // TODO: Remove Redraw button
        // drawCanvas(a)
    }

    const handleRandomizePalette = () => {
        console.log("TODO: Randomize Palette")
        generateColorPalette()
        // drawCanvas(a)
    }

    const handlePng = () => {
        setPngSrc(generatePNG())
    }

    function randomHex256() {
        const n = Math.floor(Math.random() * 256);
        //console.log(n);
        return ("0" + n.toString(16)).slice(-2);
    }

    function randomHexColor() {
        return randomHex256() + randomHex256() + randomHex256();
    }

    function RGBToHSL(r, g, b) {
        if (Array.isArray(r)) {
            g = r[1];
            b = r[2];
            r = r[0];
        }
        r = r / 255;
        g = g / 255;
        b = b / 255;
        const cMax = Math.max(r, g, b);
        const cMin = Math.min(r, g, b);
        const delta = cMax - cMin;
        let h = 0
        if (delta === 0) {
            h = 0;
        } else if (cMax === r) {
            h = 60 * (((g - b) / delta) % 6);
        } else if (cMax === g) {
            h = 60 * ((b - r) / delta + 2);
        } else if (cMax === b) {
            h = 60 * ((r - g) / delta + 4);
        }
        if (h < 0) {
            h += 360;
        }
        const l = (cMax + cMin) / 2;

        let s
        if (delta === 0) {
            s = 0;
        } else {
            s = delta / (1 - Math.abs(2 * l - 1));
        }
        //console.log("H:", h, " S:", s, " L:", l);
        return [h, s, l]
    }

    function HSLToRGB(h, s, l) {
        if (Array.isArray(h)) {
            s = h[1];
            l = h[2];
            h = h[0];
        }
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        let r, g, b
        if (h >= 0 && h < 60) {
            r = c;
            g = x;
            b = 0;
        } else if (h >= 60 && h < 120) {
            r = x;
            g = c;
            b = 0;
        } else if (h >= 120 && h < 180) {
            r = 0;
            g = c;
            b = x;
        } else if (h >= 180 && h < 240) {
            r = 0;
            g = x;
            b = c;
        } else if (h >= 240 && h < 300) {
            r = x;
            g = 0;
            b = c;
        } else if (h >= 300 && h < 360) {
            r = c;
            g = 0;
            b = x;
        }
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);
        return [r, g, b]
    }

    function RGBToHex(r, g, b) {
        if (Array.isArray(r)) {
            g = r[1];
            b = r[2];
            r = r[0];
        }
        return ("0" + r.toString(16)).slice(-2) + ("0" + g.toString(16)).slice(-2) + ("0" + b.toString(16)).slice(-2);
    }

    function hexToRGB(hex) {
        return [parseInt(hex.slice(0, 2), 16),
            parseInt(hex.slice(2, 4), 16),
            parseInt(hex.slice(4, 6), 16)
        ]
    }

    function testColor() {
        const rch = randomHexColor();
        const rc = hexToRGB(rch);
        const hsl = RGBToHSL(rc);
        const rgb = HSLToRGB(hsl)
        const hx = RGBToHex(rgb);
        console.log(rch);
        console.log(rc);
        console.log(hsl);
        console.log(rgb);
        console.log(hx);
    }


    function generateColorPalette() {
        var hex = randomHexColor();
        var hsl = RGBToHSL(hexToRGB(hex));

        var h = hsl[0];
        var s = hsl[1];
        var l = hsl[2];
        var h1 = (h + 0) % 360;
        var h2 = (h + 0) % 360;
        var h3 = (h + 0) % 360;
        var h4 = (h + 0) % 360;
        var h5 = (h + 320) % 360

        var c1 = HSLToRGB(h1, 1, 0.1);
        var c2 = HSLToRGB(h2, 1, 0.2);
        var c3 = HSLToRGB(h3, 1, 0.45);
        var c4 = HSLToRGB(h4, 1, 0.7);
        var c5 = HSLToRGB(h5, 1, 0.8);

        setColor1(RGBToHex(c1))
        setColor2(RGBToHex(c2))
        setColor3(RGBToHex(c3))
        setColor4(RGBToHex(c4))
        setColor5(RGBToHex(c5))
        // TODO: Figure out why color6 is never randomized and how it is handled by the parser
        // setColor6(RGBToHex(c6))
    }

    function generatePNG(){
        let canvas = document.createElement("canvas");
        const data = a;
        const colors = [0,1,2,3,4,5,6].map(function(id){
            switch (id) {
                case 1 || "1":
                    return "#" + color1
                case 2 || "2":
                    return "#" + color2
                case 3 || "3":
                    return "#" + color3
                case 4 || "4":
                    return "#" + color4
                case 5 || "5":
                    return "#" + color5
                case 6 || "6":
                    return "#" + color6
                default:
                    return emptyColor
            }
        })

        const size = parseInt(pngPixelSize, 10);
        canvas.width = size * data[1].length;
        canvas.height = size * data.length;
        let ctx = canvas.getContext('2d');
        for (let j = 0; j < data.length; j++) {
            const row = data[j];
            for (let i = 0; i < row.length; i++) {
                const color = colors[row[i]];
                if (color) {
                    ctx.fillStyle = color;
                    ctx.fillRect(i * size, j * size, size, size);
                }
            }
        }
        return canvas.toDataURL();
    }

    const setCellColor = (row, col, color) => {
        let aChange = [...a]
        if (a[row][col] !== color) {
            aChange[row][col] = color
        } else {
            aChange[row][col] = 0
        }
        setA(aChange)
        // console.log("aChange", aChange)
    }

    useEffect(() => {
        // drawCanvas(a)
        document.onmousedown=function(e){
            setMouseState(e.button)
            // console.log("Mouse Down: ", e.button)
        }
        document.onmouseup=function(e){
            setMouseState(-1);
            // console.log("Mouse Up")
        }
    }, [])

    return (
        <div className="App">

            <div id="canvas" className={grid ? "grid": ""} onContextMenu={() => {return false}}>
                {a.map((row, rowIndex) => {
                    return (
                        <div className="row" key={"row" + rowIndex}>
                            {row.map((cell, cellIndex) => {
                                return (
                                    <div
                                        className="cell"
                                        key={"cell" + cellIndex}
                                        style={{backgroundColor: getColorCode(cell)}}
                                        onMouseDown={e => {
                                            setCellColor(rowIndex, cellIndex, parseInt(currentColor))
                                        }}
                                        onMouseEnter={e => {
                                            if(mouseState === 0) {
                                                setCellColor(rowIndex, cellIndex, parseInt(currentColor))
                                            } else if(mouseState === 2) {
                                                setCellColor(rowIndex, cellIndex, parseInt(emptyColor))
                                            }
                                        }}
                                    >
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>

            <input id="c1" type="radio" name="color" value="1" checked={currentColor === "1"} onChange={handleColorSelect} />
            <input className="color" id="color1" value={color1} onChange={e => setColor1(e.target.value)} style={{backgroundColor: "#" + color1}} />

            <input id="c2" type="radio" name="color" value="2" checked={currentColor === "2"} onChange={handleColorSelect} />
            <input className="color" id="color2" value={color2} onChange={e => setColor2(e.target.value)} style={{backgroundColor: "#" + color2}} />

            <input id="c3" type="radio" name="color" value="3" checked={currentColor === "3"} onChange={handleColorSelect} />
            <input className="color" id="color3" value={color3} onChange={e => setColor3(e.target.value)} style={{backgroundColor: "#" + color3}} />

            <input id="c4" type="radio" name="color" value="4" checked={currentColor === "4"} onChange={handleColorSelect} />
            <input className="color" id="color4" value={color4} onChange={e => setColor4(e.target.value)} style={{backgroundColor: "#" + color4}} />

            <input id="c5" type="radio" name="color" value="5" checked={currentColor === "5"} onChange={handleColorSelect} />
            <input className="color" id="color5" value={color5} onChange={e => setColor5(e.target.value)} style={{backgroundColor: "#" + color5}} />

            <input id="c6" type="radio" name="color" value="6" checked={currentColor === "6"} onChange={handleColorSelect} />
            <input className="color" id="color6" value={color6} onChange={e => setColor6(e.target.value)} style={{backgroundColor: "#" + color6}} />
            <div>
                <input id="iw" type="number" value={iw} onChange={e => setIw(e.target.value)} />
                <input id="ih" type="number" value={ih} onChange={e => setIh(e.target.value)} />
                <button id="reset" onClick={handleReset}>
                    ⊘ Reset
                </button>
                <button id="print" onClick={handlePrint}>
                    ↓ Print
                </button>
                <button id="read" onClick={handleRead}>
                    ↑ Read
                </button>
                <button id="redraw" onClick={handleRedraw}>
                    ↺ Redraw
                </button>
                <button id="palette"onClick={handleRandomizePalette}>
                    Randomize
                </button>
                <input name="grid" type="checkbox" id="grid" checked={grid} onChange={e => {console.log("grid: ", e); setGrid(e.target.checked)}} />
                    <label htmlFor="grid">Grid</label>
                    <button id="png" onClick={handlePng}>
                        PNG
                    </button>
                    <input id="pngPixelSize" type="number" value={pngPixelSize} onChange={e => setPngPixelSize(e.target.value)} />
            </div>
            <div>
                <textarea id="out" value={out} onChange={e => setOut(e.target.value)} />
            </div>
            <img id="png-out" style={{border:"2px solid"}} alt="" src={pngSrc} />
            <div id="license"
                 style={{margin: "20px", padding: "10px", border: "1px solid #ccc", fontSize: "0.5em", color: "#555"}}>
                <h2>License</h2>
                <p>Copyright © 2021 Ponderware Ltd.</p>

                <p>Permission is hereby granted, free of charge, to any
                    person obtaining a copy of this software and
                    associated documentation files (the “Software”), to
                    deal in the Software without restriction, including
                    without limitation the rights to use, copy, modify,
                    merge, publish, distribute, sublicense, and/or sell
                    copies of the Software, and to permit persons to
                    whom the Software is furnished to do so, subject to
                    the following conditions:</p>

                <p>The above copyright notice and this permission notice
                    shall be included in all copies or substantial
                    portions of the Software.</p>

                <p>THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF
                    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
                    LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                    FITNESS FOR A PARTICULAR PURPOSE AND
                    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
                    COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES
                    OR OTHER LIABILITY, WHETHER IN AN ACTION OF
                    CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
                    IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
                    DEALINGS IN THE SOFTWARE.</p>
            </div>

        </div>
    )
}

export default PixelEditor
