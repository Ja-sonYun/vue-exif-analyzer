<template>
	<div>
		<input type="file" @change="pre" id="files">
	</div>
</template>

<script>
import exif_jpeg from '../exif_jpeg.js';
import { mapMutations } from 'vuex';

export default {
	name: 'mainFunction',
	methods: {
		...mapMutations([
			'setBinaryData',
			'setAnalyzedData'
		]),
		pre: function(event) {
			exif_jpeg.pushImage(event.target.files[0]).then(() => {
				this.setBinaryData(exif_jpeg.getBinary());
				this.setAnalyzedData(exif_jpeg.load());
			}).catch(error => {
				this.$buefy.snackbar.open({
						duration: 5000,
						message: error,
						type: 'is-danger',
						actionText: 'Ok',
						queue: false,
					onAction: () => {
						this.$buefy.toast.open({
							message: 'please try with other jpeg image.',
							queue: false
						})
					}
				})
			});
		},
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
