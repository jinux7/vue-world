import Vue from '../libs/vue';
import Router from '../libs/router';
import app from './app';
Vue.$use(Router);

app.$mount(document.getElementById('app'));
