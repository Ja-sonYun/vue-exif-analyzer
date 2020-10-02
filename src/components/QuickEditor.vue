<template>
	<div id="QuickEditor">
	</div>
</template>

<script>
export default {
	name: 'QuickEditor',
	data: function () {
		return {
			newdatetime: new Date(),
			isEditing: false,
		}
	},
	methods: {

	}
}
</script>

<style>

#QuickEditor {
	padding-top: 30px;
}

</style>
