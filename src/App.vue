<template>
	<div id="app">
		<div id="header">
			<p class="title">Exif editor</p>
			<ImageAnalyzer />
		</div>
		<div v-if="Object.keys(getAnalyzedData).length">
			<ExifEditor />
		</div>
	</div>
</template>

<script>
import ImageAnalyzer from './components/ImageAnalyzer.vue'
import ExifEditor from './components/ExifEditor.vue'
import { mapGetters } from 'vuex'

export default {
	name: 'App',
	computed: {
		...mapGetters([
			'getBinaryData',
			'getAnalyzedData'
		]),
	},
	components: {
		ImageAnalyzer,
		ExifEditor,
	},
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
#header {
  text-align: center;
}
</style>
