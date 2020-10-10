<template>
	<div v-if="!excuted" id="fileupload">
		<!-- <input type="file" @change="pre" id="files"> -->
		<b-field>
			<b-upload v-model="dropFiles"
				drag-drop>
				<section class="section">
					<div v-if="dropFiles" class="tags">
						<span class="tag is-primary">
							{{dropFiles.name}}
						</span>
					</div>
					<div v-else class="content has-text-centered">
						<p>Drop your image or click to upload.</p>
					</div>
				</section>
			</b-upload>
		</b-field>
		<div v-if="dropFiles">
			<b-button size="is-small" @click="go">
				Start Analyze!
			</b-button>
			<b-button size="is-small" @click="deleteDropFile">
				Cancel
			</b-button>
		</div>
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
		go: function() {
			exif_jpeg.pushImage(this.dropFiles).then(() => {
				this.setBinaryData(exif_jpeg.getBinary());
				this.setAnalyzedData(exif_jpeg.load());
				this.excuted = true;
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
		deleteDropFile: function(index) {
			this.dropFiles = null;
		}
	},
	data() {
		return {
			excuted: false,
			dropFiles: null,
		}
	},
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
#fileupload {
  padding-top: 50px;
  text-align: center;
}
</style>
