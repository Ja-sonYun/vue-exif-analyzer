<template>
	<div id="app">
		<Header />
		<ImageAnalyzer />

		<div v-if="Object.keys(getAnalyzedData).length">
			<ExifEditor />
		</div>

		<Footer />
	</div>
</template>

<script>
import ImageAnalyzer from './components/ImageAnalyzer.vue'
import ExifEditor from './components/ExifEditor.vue'
import Header from './layout/header.vue';
import Footer from './layout/footer.vue';
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
		Header,
		Footer,
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
</style>
