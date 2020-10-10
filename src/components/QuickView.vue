<template>
	<section>
		<b-field class="editButtons">
			<b-button v-if="isEditEnteredEditMode" size="is-small" @click="rebuildAndSetupLink">download</b-button>
			<b-button size="is-small" @click="isEditEnteredEditMode=!isEditEnteredEditMode">edit</b-button>
		</b-field>
		<p v-if="JFIF_version">JFIF : {{ JFIF_version }}</p>
		<p v-if="EXIF_version">EXIF : {{ EXIF_version }}</p>
		<p v-if="Byte_align">Byte align : {{ Byte_align }}</p>
		<div v-if="Make != 'not found.'">
			<p>Make : {{ Make }}</p>
			<b-input v-if="isEditEnteredEditMode" v-model="Make" placeholder="Make" class="newValueField"></b-input>
		</div>
		<div v-if="Model != 'not found.'">
			<p>Model : {{ Model }}</p>
			<b-input v-if="isEditEnteredEditMode" v-model="Model" class="newValueField"></b-input>
		</div>
		<div v-if="Software != 'not found.'">
			<p>Software : {{ Software }}</p>
			<b-input v-if="isEditEnteredEditMode" v-model="Software" class="newValueField"></b-input>
		</div>
		<div v-if="LensMake != 'not found.'">
			<p>LensMake : {{ LensMake }}</p>
			<b-input v-if="isEditEnteredEditMode" v-model="LensMake" class="newValueField"></b-input>
		</div>
		<div v-if="LensModel != 'not found.'">
			<p>LensModel : {{ LensModel }}</p>
			<b-input v-if="isEditEnteredEditMode" v-model="LensModel" class="newValueField"></b-input>
		</div>
		<div v-if="DateTime != 'not found.'">
			<p>DateTime : {{ DateTime }}</p>
			<b-input v-if="isEditEnteredEditMode" v-model="DateTime" class="newValueField"></b-input>
		</div>
		<div v-if="DateTimeOriginal != 'not found.'">
			<p>DateTimeOriginal : {{ DateTimeOriginal }}</p>
			<b-input v-if="isEditEnteredEditMode" v-model="DateTimeOriginal" class="newValueField"></b-input>
		</div>
		<div v-if="DateTimeDigitized != 'not found.'">
			<p>DateTimeDigitized : {{ DateTimeDigitized }}</p>
			<b-input v-if="isEditEnteredEditMode" v-model="DateTimeDigitized" class="newValueField"></b-input>
		</div>

	</section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'QuickView',
	data: function() {
		return {
			updatedImageLink: '',
			JFIF_version: '',
			EXIF_version: '',
			Byte_align: '',
			Make: '',
			Model: '',
			Software: '',
			LensMake: '',
			LensModel: '',
			DateTime: '',
			DateTimeOriginal: '',
			DateTimeDigitized: '',
			isEditEnteredEditMode: false,
			SizeOverflowed: [],
		}
	},
	computed: {
		...mapGetters([
			'getBinaryData',
			'getAnalyzedData'
		])
	},
	mounted() {
		this.JFIF_version = this.versionConvert(this.returnIfExist(this.getAnalyzedData.APP0.JFIF_version, false));
		this.EXIF_version = this.versionConvert(this.returnIfExist(this.getAnalyzedData.Exif_SubIFD.entries["Exif.Photo.ExifVersion"]));
		this.Byte_align = this.returnIfExist(this.getAnalyzedData.APP1.byte_align, false);
		this.Make = this.returnIfExist(this.getAnalyzedData.IFD0.entries["Exif.Image.Make"]);
		this.Model = this.returnIfExist(this.getAnalyzedData.IFD0.entries["Exif.Image.Model"]);
		this.Software = this.returnIfExist(this.getAnalyzedData.IFD0.entries["Exif.Image.Software"]);
		this.LensMake = this.returnIfExist(this.getAnalyzedData.Exif_SubIFD.entries["Exif.Photo.LensMake"]);
		this.LensModel = this.returnIfExist(this.getAnalyzedData.Exif_SubIFD.entries["Exif.Photo.LensModel"]);
		this.DateTime = this.returnIfExist(this.getAnalyzedData.IFD0.entries["Exif.Image.DateTime"]);
		this.DateTimeOriginal = this.returnIfExist(this.getAnalyzedData.Exif_SubIFD.entries["Exif.Photo.DateTimeOriginal"]);
		this.DateTimeDigitized = this.returnIfExist(this.getAnalyzedData.Exif_SubIFD.entries["Exif.Photo.DateTimeDigitized"]);
	},
	methods: {
		returnIfExist(value, withAscii=true) {
			if(withAscii) {
				return value ? value.value.ascii : 'not found.';
			}
			return value ? value : 'not found.';
		},
		versionConvert(version) {
			return `${parseInt(version.slice(0, 2))}.${version.slice(2, 4)} version`
		},
		rebuildAndSetupLink() {
			let copiedBinary = this.getBinaryData;

			if(this.Make != this.getAnalyzedData.IFD0.entries["Exif.Image.Make"].value.ascii) {
				copiedBinary = this.pushNewValue(copiedBinary,
					parseInt(this.getAnalyzedData.IFD0.entries["Exif.Image.Make"].value.data_offset,16) + parseInt(this.getAnalyzedData.APP1.offset, 16),
					this.getAnalyzedData.IFD0.entries["Exif.Image.Make"].value,
					this.Make);
			}

			if(this.Model != this.getAnalyzedData.IFD0.entries["Exif.Image.Model"].value.ascii) {
				copiedBinary = this.pushNewValue(copiedBinary,
					parseInt(this.getAnalyzedData.IFD0.entries["Exif.Image.Model"].value.data_offset,16) + parseInt(this.getAnalyzedData.APP1.offset, 16),
					this.getAnalyzedData.IFD0.entries["Exif.Image.Model"].value,
					this.Model);
			}

			if(this.Software != this.getAnalyzedData.IFD0.entries["Exif.Image.Software"].value.ascii) {
				copiedBinary = this.pushNewValue(copiedBinary,
					parseInt(this.getAnalyzedData.IFD0.entries["Exif.Image.Software"].value.data_offset,16) + parseInt(this.getAnalyzedData.APP1.offset, 16),
					this.getAnalyzedData.IFD0.entries["Exif.Image.Software"].value,
					this.Software);
			}

			if(this.DateTime != this.getAnalyzedData.IFD0.entries["Exif.Image.DateTime"].value.ascii) {
				copiedBinary = this.pushNewValue(copiedBinary,
					parseInt(this.getAnalyzedData.IFD0.entries["Exif.Image.DateTime"].value.data_offset,16) + parseInt(this.getAnalyzedData.APP1.offset, 16),
					this.getAnalyzedData.IFD0.entries["Exif.Image.DateTime"].value,
					this.DateTime);
			}

			if(this.DateTimeDigitized != this.getAnalyzedData.Exif_SubIFD.entries["Exif.Photo.DateTimeDigitized"].value.ascii) {
				copiedBinary = this.pushNewValue(copiedBinary,
					parseInt(this.getAnalyzedData.Exif_SubIFD.entries["Exif.Photo.DateTimeDigitized"].value.data_offset,16) + parseInt(this.getAnalyzedData.APP1.offset, 16),
					this.getAnalyzedData.Exif_SubIFD.entries["Exif.Photo.DateTimeDigitized"].value,
					this.DateTimeDigitized);
			}

			if(this.DateTimeOriginal != this.getAnalyzedData.Exif_SubIFD.entries["Exif.Photo.DateTimeOriginal"].value.ascii) {
				copiedBinary = this.pushNewValue(copiedBinary,
					parseInt(this.getAnalyzedData.Exif_SubIFD.entries["Exif.Photo.DateTimeOriginal"].value.data_offset,16) + parseInt(this.getAnalyzedData.APP1.offset, 16),
					this.getAnalyzedData.Exif_SubIFD.entries["Exif.Photo.DateTimeOriginal"].value,
					this.DateTimeOriginal);
			}

			if(this.LensMake != this.getAnalyzedData.Exif_SubIFD.entries["Exif.Photo.LensMake"].value.ascii) {
				copiedBinary = this.pushNewValue(copiedBinary,
					parseInt(this.getAnalyzedData.Exif_SubIFD.entries["Exif.Photo.LensMake"].value.data_offset,16) + parseInt(this.getAnalyzedData.APP1.offset, 16),
					this.getAnalyzedData.Exif_SubIFD.entries["Exif.Photo.LensMake"].value,
					this.LensMake);
			}

			if(this.LensModel != this.getAnalyzedData.Exif_SubIFD.entries["Exif.Photo.LensModel"].value.ascii) {
				copiedBinary = this.pushNewValue(copiedBinary,
					parseInt(this.getAnalyzedData.Exif_SubIFD.entries["Exif.Photo.LensModel"].value.data_offset,16) + parseInt(this.getAnalyzedData.APP1.offset, 16),
					this.getAnalyzedData.Exif_SubIFD.entries["Exif.Photo.LensModel"].value,
					this.LensModel);
			}

			if(this.SizeOverflowed.length > 0) {
				this.$buefy.snackbar.open({
					duration: 5000,
					message: 'Couldn\'t update these values... =>' + this.SizeOverflowed.toString(),
					type: 'is-danger',
					position: 'is-bottom-left',
					actionText: 'Ok',
					queue: false,
				})
			}

			let href = 'data:image/jpeg;base64,' + btoa(copiedBinary);
			let a = document.createElement("a"); //Create <a>
			a.href = href; //Image Base64 Goes here
			a.download = "newImage.jpeg"; //File name Here
			a.click(); //Downloaded file

		},
		pushNewValue(copiedBinary, valAddress, orignalValues, val) {
			if(val > orignalValues.ascii.length) {
				this.SizeOverflowed.push(val);
				return copiedBinary; // size overflowed
			}
			return copiedBinary.replaceAt(valAddress, val.hexEncode().hexDecode(orignalValues.size));
		}
	}
}

String.prototype.replaceAt = function(index, replacement) {
	return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

String.prototype.hexDecode = function(size) {
	let i;
	let hexes = this.match(/.{1,2}/g) || [];
	let back = "";
	for(i=0; i<hexes.length; i++) {
		back += String.fromCharCode(parseInt(hexes[i], 16))
	}

	if(back.length < size) {
		back += '\x00'.repeat(size-back.length);
	}

	return back;
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

</script>

<style>
.editButtons {
	position: absolute;
	right: 0;
	margin-right: 10px;
}

.newValueField {
	width: 200px;
}
</style>
