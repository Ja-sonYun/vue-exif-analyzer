const EXIF_TAGS = require('./exif-tags.json');

(function () {
	let that = {};

	that.pushImage = async function(jpeg) {
		let b = await loadJpeg(jpeg);
		if(b.slice(0, 2) == '\xFF\xD8') {
			console.log('SOI marker found.');
			that.b = b;
			that.pointer = 2;
			return true;
		} else {
			return Promise.reject(new TypeError('Unsupported format'));
		}
	}

	that.getBinary = function() {
		return that.b;
	}

	that.load = function() {
		let willreturn = {};
		let JFIF = {};
		if(bn(2) == '\xFF\xE0') {
			console.log('APP0 marker found');

			JFIF.Length = bn(2, true);

			if(bn(5) != '\x4A\x46\x49\x46\x00') {
				throw new Error('couldn\'t find JFIF header!');
			}
			console.log('JFIF header found.');

			JFIF.Identifier = "JFIF";
			JFIF.JFIF_version = bn(2, true);
			JFIF.Density_units = bn(1, true);
			JFIF.Xdensity = bn(2, true);
			JFIF.Ydensity = bn(2, true);

			if(JFIF.Xdensity + JFIF.Ydensity == 0) {
				throw new Error('Wrong file format!')
			}

			JFIF.Xthumbnail = bn(1, true);
			JFIF.Ythumbnail = bn(1, true);

			willreturn.APP0 = JFIF;
		} else {
			console.error('Could\'t find Exif SubIFD');
			return willreturn;
		}

		let EXIF = {};
		if(bn(2) == '\xFF\xE1') {
			console.log('APP1 marker found');

			EXIF.APP1_data_size = bn(2, true);

			if(bn(6) != '\x45\x78\x69\x66\x00\x00') {
				throw new Error('couldn\'t find EXIF header');
			}
			console.log('EXIF header found.');

			EXIF.offset = that.pointer.toString(16);
			that.OFFSET = EXIF.offset;
			EXIF.byte_align = bn(2);
			if(EXIF.byte_align == '\x49\x49') {
				EXIF.byte_align = 'll, intel(little endian)';
			} else if(EXIF.byte_align == '\x4D\x4D') {
				EXIF.byte_align = 'mm, motorola(big endian)';
			}
			EXIF.tag_mark = bn(2, true);
			EXIF.IFD_offset = bn(4, true);

			willreturn.APP1 = EXIF;
		}

		let IFD0 = {};
		let IFD1 = {};
		let Exif_SubIFD = {};
		let next_IFD_Offset;

		IFD0.entries = new Entries().parse();
		if(IFD0.entries["Exif.Image.ExifTag"] != undefined) { // ExifTag
			Exif_SubIFD.offset = IFD0.entries["Exif.Image.ExifTag"].value.data_offset.hex2Int() + EXIF.offset.hex2Int();
			willreturn.Exif_SubIFD = Exif_SubIFD;
		}
		if(Exif_SubIFD.offset == undefined) {
			console.error('Could\'t find IFD0');
			return willreturn;
		}

		willreturn.IFD0 = IFD0;

		IFD0.next_IFD_Offset = bn(4, true);

		Exif_SubIFD.entries = new Entries(Exif_SubIFD.offset).parse(); // always exist

		if(bn(4) != '\x00\x00\x00\x00') {
			console.log('Next (IFD2..?) IFD offset found, but doesn\'t support yet');
		}

		if(IFD0.next_IFD_Offset == 0) {
			console.error('Could\'t find IFD1');
			return willreturn;
		}

		IFD1.entries = new Entries(IFD0.next_IFD_Offset, true).parse();

		willreturn.IFD1 = IFD1;

		return willreturn;
	}




	function bn(a, hexEncode=false, movePointer=true, resetPointer=false) {
		if(resetPointer) {
			that.pointer = resetPointer;
		}

		let sliced = that.b.slice(that.pointer, that.pointer+a);

		if(movePointer) {
			that.pointer += a;
		}

		if(hexEncode) {
			return sliced.hexEncode();
		}

		return sliced;
	}

	function loadJpeg(jpeg) {
		return new Promise(function(resolve, reject) {
			let reader = new FileReader();
			reader.addEventListener('loadend', (e) => {
				console.log(e.target.result.split(',')[0]);
				resolve(atob(e.target.result.split(',')[1]));
			});
			reader.readAsDataURL(jpeg);
		})
	}

	// start_address is Int type. use that.pointer as parameter
	function Entries(setPointer=false, requireOffset=false) {
		if(setPointer) {
			that.pointer = setPointer;
		}
		if(setPointer && requireOffset) {
			that.pointer = setPointer.hex2Int() + that.OFFSET.hex2Int();
		}
		this.entries_ea = bn(2).hex2Int(false); // Entry EA size: 2
	}

	Entries.prototype = {
		parse: function() {
			let entries = {};
			let tag, format, components, data_offset, value, value_hex, value_address, value_size, i;
			for(i = 0; i < this.entries_ea; i++) {
				tag = bn(2, true);
				format = bn(2, true);
				components = bn(4, true);
				data_offset = bn(4, true);
				if(data_offset.slice(0, 4) != 0 || data_offset == 0) {
					value_address = that.pointer - 4;
					if(data_offset.slice(0, 4) == 0) {
						value_hex = '0000';
					} else if(data_offset.slice(4, 8) == 0){
						value_hex = data_offset.slice(0, 4);
					} else {
						value_hex = data_offset;
					}
					value = value_hex.hex2Ascii();
					value_size = 4;
				} else {
					value_address = that.OFFSET.hex2Int() + data_offset.hex2Int();
					value_size = components.hex2Int() * EXIF_TAGS.Format[format].size;
					value = that.b.slice(value_address, value_address+value_size);
					value_hex = value.hexEncode();
				}

				entries[EXIF_TAGS.Tags['0x'+tag].Key] = ({
					hex: tag,
					format: {
						hex: format,
						name: EXIF_TAGS.Tags['0x'+tag].Type
					},
					value: {
						hex: value_hex,
						ascii: value,
						size: value_size,
						address: value_address,
						components: components,
						data_offset: data_offset,
					},
					description: EXIF_TAGS.Tags['0x'+tag]["Tag description"]
				});
			}
			return entries;
		}
	}

	String.prototype.hex2Int = function(Encoded=true) {
		if(Encoded) {
			return parseInt(this, 16);
		}
		return parseInt(this.hexEncode(), 16);
	}

	String.prototype.hexEncode = function() {
		let hex, i;
		let result = "";
		for(i=0; i<this.length; i++) {
			hex = this.charCodeAt(i).toString(16);
			if(hex.length < 2) { hex = "0" + hex }
			result += (hex).slice(-4);
		}

		return result;
	}

	String.prototype.hexDecode = function() {
		let i;
		let hexes = this.match(/.{1,4}/g) || [];
		let back = "";
		for(i=0; i<hexes.length; i++) {
			back += String.fromCharCode(parseInt(hexes[i], 16))
		}

		return back;
	}

	String.prototype.hex2Ascii = function() {
		let hex  = this.toString();
		let str = '';
		for (let n = 0; n < hex.length; n += 2) {
			str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
		}
		return str;
	}

	if (typeof module !== 'undefined' && module.exports) {
		exports = module.exports = that;
	}
})();

// const JFIF_structer = {
//     "SOI0": {
//         "optional": false,
//         "marker": "\xFF\xD8",
//         "marker size": 2
//     },
//     "JFIF-APP0": {
//         "optional": false,
//         "marker": "\xFF\xE0",
//         "marker size": 2,
//         "Length": 2,
//         "Identifier": 5, // 4A 46 49 46 00
//         "JFIF version": 2,
//         "Density units": 1,
//         "Xdensity": 2,
//         "Ydensity": 2,
//         "Xthumbnail": 1,
//         "Ythumbnail": 1,
//         "Thumbnail": 0 // 3 * ( Xthumbnail * Ythumbnail )
//     },
//     "JFXX-APP0": {
//         "optional": true,
//         "marker": "\xFF\xE0",
//         "marker size": 2,
//         // "segments size": {
//         // }
//     },
//     "APP1": {
//         "optional": false,
//         "marker": "\xFF\xE1",
//         "marker size": 2,
//         "App1 data size": 2,
//         "Exif Header": 6, // 45 78 69 66 00 00
//         // --------Offset-------- //
//         "TIFF Header": 2, // II => intel(little endian) , MM => motorola(big endian)
//         "Tag Mark": 2, // 00 2A, if byte align is intel, 2A 00.
//         "First IFD Offset": 4 // 00 00 00 08
//     },
//     "IFD0": { // doesnt have marker
//         "optional": false,
//         "Entry EA size": 2,
//         "Entry": {
//             "Tag": 2,
//             "Format": 2,
//             "Components": 4,
//             "data/offset": 4
//         },
//         "Next IFD Offset": 4
//     },
//     // Exif SubIFD Tag's data + Offset is the start address of this section.
//     "Exif SubIFD": {
//         "optional": false,
//         "Entry EA size": 2,
//         "Entry": {
//             "Tag": 2,
//             "Format": 2,
//             "Components": 4,
//             "data/offset": 4
//         },
//         "Next IFD Offset": 4
//     },
//     // IFD0["NEXT IFD OFFSET"] + Offset is the start address of this section
//     "IFD1": {
//         "optional": false,
//         "Entry EA size": 2,
//         "Entry": {
//             "Tag": 2,
//             "Format": 2,
//             "Components": 4,
//             "data/offset": 4
//         },
//         "Next IFD Offset": 4
//     },
//     "SOI1": {
//         "optional": false,
//         "marker": "\xFF\xD8",
//         "marker size": 2
//     },
// };
