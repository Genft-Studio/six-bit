
function PixelEditor() {
    return (
        <div className="App">
            {/*<header className="App-header">*/}
            {/*    <h1>*/}
            {/*        Pixel Editor<br />*/}
            {/*        Coming Soon...*/}
            {/*    </h1>*/}
            {/*</header>*/}

            <div id="canvas" className="grid" onContextMenu="return false;">

            </div>
            <input id="c1" type="radio" name="color" value="1" checked />
            <input className="color" id="color1" value="331a00" />

            <input id="c2" type="radio" name="color" value="2" />
            <input className="color" id="color2" value="663300" />

            <input id="c3" type="radio" name="color" value="3" />
            <input className="color" id="color3" value="e67300" />

            <input id="c4" type="radio" name="color" value="4" />
            <input className="color" id="color4" value="ffb366" />

            <input id="c5" type="radio" name="color" value="5" />
            <input className="color" id="color5" value="ff9999" />

            <input id="c6" type="radio" name="color" value="6" />
            <input className="color" id="color6" value="00bb00" />
            <div>
                <input id="iw" type="number" value="50" />
                <input id="ih" type="number" value="50" />
                <button id="reset">
                    ⊘ Reset
                </button>
                <button id="print">
                    ↓ Print
                </button>
                <button id="read">
                    ↑ Read
                </button>
                <button id="redraw">
                    ↺ Redraw
                </button>
                <button id="palette">
                    Randomize
                </button>
                <input name="grid" type="checkbox" id="grid" checked />
                    <label htmlFor="grid">Grid</label>
                    <button id="png">
                        PNG
                    </button>
                    <input id="pngPixelSize" type="number" value="10" />
            </div>
            <div>
                <textarea id="out" />
            </div>
            <img id="png-out" style="border:2px solid" />
            <div id="license"
                 style="margin: 20px; padding: 10px; border: 1px solid #ccc; font-size: 0.5em; color: #555">
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
