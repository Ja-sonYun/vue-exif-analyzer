<template>
	<section>
		<p id="abex"><a class="AbutBlack" href="https://abex.dev">abex.dev</a></p>
		<div id="header">
			<p id="title">Exif Analyzer</p>
			<p v-if="isExecuted" id="subtitle">Extract exif from given jpeg file.<br>You can edit like captured date, device name, and etc.</p>
		</div>
	</section>
</template>

<script>

export default {
	name: 'Header',
	computed: {
		isExecuted() {
			return !this.$store.getters.getBinaryData;
		}
	}
}

</script>

<style>

#header {
	text-align: center;
}
#abex {
	font-weight: bold;
	position: absolute;
	margin-top: -45px;
	padding-left: 15px;
	font-family: "Lucida Console", Courier, monospace;
}

.AbutBlack {
	color: black;
}

#title {
	padding: 40px;
	font-size: 44px;
}

</style>
