<template>
	<div id="app">
		<Header />
			<div id="mainS">
				<ImageAnalyzer />

				<div v-if="Object.keys(getAnalyzedData).length">
					<ExifEditor />
				</div>
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
  position: relative;
  min-height: 100vh;
}
#mainS {
  padding-bottom: 50px;
}
</style>
