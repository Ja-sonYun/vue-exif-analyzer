import Vue from 'vue'
import Vuex from 'vuex'
import Buefy from 'buefy'
import App from './App.vue'
import 'buefy/dist/buefy.css'
import 'es6-promise/auto'
import store from "./store";

Vue.config.productionTip = false
Vue.use(Buefy);
Vue.use(Vuex);

new Vue({
	el: "#app",
	store: store,
	render: h => h(App),
}).$mount('#app')
