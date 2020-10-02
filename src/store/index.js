import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
	binaryData: '',
	analyzedData: {},
};

const mutations = {
	setBinaryData(state, binaryData) {
		state.binaryData = binaryData;
	},
	setAnalyzedData(state, analyzedData) {
		state.analyzedData = JSON.parse(JSON.stringify(analyzedData));
	}
}

const actions = {
	setBinaryData ({ state, commit }, binaryData) {
		commit('setBinaryData', binaryData);
	},
	setAnalyzedData ({ state, commit }, analyzedData) {
		commit('setAnalyzedData', analyzedData);
	},
}

const getters = {
	getBinaryData: (state, getters) => {
		return state.binaryData;
	},
	getAnalyzedData: (state, getters) => {
		return state.analyzedData;
	}
}

export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
});
