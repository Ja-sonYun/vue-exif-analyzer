<template>
	<section>
		<b-tabs v-model="activeTab">
			<b-tab-item label="Quick view">
				<QuickView />
				<QuickEditor />
			</b-tab-item>
			<b-tab-item label="Image Specific Informations">
				<ImageSpecificInfoViewer v-on:gotLastAddress="receivedLastAddress"/>
			</b-tab-item>
			<b-tab-item label="Hex Editor">
				<p class="subtitle">Last address: 0x{{ lastAddress.toString(16).toUpperCase() }}</p>
				<HexEditor :until="lastAddress"/>
			</b-tab-item>
		</b-tabs>
	</section>
</template>

<script>
import HexEditor from './HexEditor.vue';
import QuickView from './QuickView.vue';
import QuickEditor from './QuickEditor.vue';
import ImageSpecificInfoViewer from './ImageSpecificInfoViewer.vue';
// exif_jpeg is imported.
// String => hexEncode(), hexDecode(), hex2Ascii(), hex2Int() are imported.

export default {
	name: 'ExifEditor',
	components: {
		HexEditor,
		QuickEditor,
		QuickView,
		ImageSpecificInfoViewer,
	},
	data: function () {
		return {
			activeTab: 0,
			lastAddress: 0,
		}
	},
	methods: {
		receivedLastAddress(value) {
			this.lastAddress = value;
		},
	}
}

</script>
