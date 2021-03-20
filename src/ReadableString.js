import { Readable } from 'stream'

class ReadableString extends Readable {
    sent = false
    str = null

    constructor(str) {
        super();
        this.str = str
    }

    _read() {
        if (!this.sent) {
            this.push(Buffer.from(this.str));
            this.sent = true
        }
        else {
            this.push(null)
        }
    }
}

export default ReadableString