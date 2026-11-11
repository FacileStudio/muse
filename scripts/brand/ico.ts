/** One square PNG image to pack into an ICO file. */
export interface IcoImage {
    size: number;
    png: Uint8Array;
}

/** Packs PNG images into a PNG-in-ICO container: a 6-byte header, one 16-byte entry per image, then the PNGs. */
export function encodeIco(images: IcoImage[]): Uint8Array {
    const headerBytes = 6 + 16 * images.length;
    const total = headerBytes + images.reduce((sum, image) => sum + image.png.length, 0);
    const out = new Uint8Array(total);
    const view = new DataView(out.buffer);
    view.setUint16(2, 1, true);
    view.setUint16(4, images.length, true);
    let offset = headerBytes;
    images.forEach((image, index) => {
        const entry = 6 + 16 * index;
        view.setUint8(entry, image.size >= 256 ? 0 : image.size);
        view.setUint8(entry + 1, image.size >= 256 ? 0 : image.size);
        view.setUint16(entry + 4, 1, true);
        view.setUint16(entry + 6, 32, true);
        view.setUint32(entry + 8, image.png.length, true);
        view.setUint32(entry + 12, offset, true);
        out.set(image.png, offset);
        offset += image.png.length;
    });
    return out;
}
