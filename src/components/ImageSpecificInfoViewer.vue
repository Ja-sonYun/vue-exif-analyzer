<template>
	<section>
		<p hidden>{{ calculated = false }}</p>
		<span v-for="(section_item, sections) in analyzedData" :key="sections">
			<p class="title is-6">{{ sections }}</p>
			<span v-for="(value, tag) in section_item" :key="tag">
				<div v-if="tag == 'entries'" class="subtitle">
					<span v-for="(values, tagname) in value" :key="sections+tagname">
						<p hidden>{{ lastAddress = values.value.address+values.value.size > lastAddress ? values.value.address+values.value.size: lastAddress }}</p>
						<b-tooltip :label="values.description">
							<p>{{ tagname }} => at {{ values.value.address }}(int) , hex value is <strong>{{ values.value.hex }}</strong> , as ascii is <strong>{{ values.value.ascii }}</strong></p>
						</b-tooltip>
					</span>
				</div>
				<p v-else class="subtitle">{{ tag }} : {{ value }}</p>
			</span>
			<hr>
		</span>
		<p hidden>{{ calculated = true }}</p>
	</section>
</template>

<script>

export default {
	name: 'ImageSpecificInfoViewer',
	data: function() {
		return {
			calculated: false,
			lastAddress: 0,
		}
	},
	computed: {
		analyzedData() {
			console.log(this.$store.getters.getAnalyzedData);
			return this.$store.getters.getAnalyzedData;
		}
	},
	watch: {
		calculated: function(val) {
			if(val) {
				this.$emit('gotLastAddress', this.lastAddress);
			}
		}
	}
}

</script>
