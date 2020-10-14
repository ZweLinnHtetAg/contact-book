
require('./bootstrap');
import routes from './router';
import MainComponent from './components/MainComponent'
import Vue from 'vue'
import { Form, HasError, AlertError } from 'vform'
import Swal from 'sweetalert2'
import VueProgressBar from 'vue-progressbar'
import Loading from 'vue-loading-overlay';


 
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)


window.Vue = require('vue');
window.form = Form;

window.Swal = Swal;
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});
window.Toast = Toast;
const options = {
    color: '#3490dc',
    failedColor: 'red',
    thickness: '5px',
    transition: {
      speed: '0.2s',
      opacity: '1s',
      termination: 300
    },
    autoRevert: true,
    location: 'top',
    inverse: false
  }

Vue.use(Loading);
Vue.use(VueProgressBar, options)


Vue.component('main-component', MainComponent);
Vue.component('pagination', require('laravel-vue-pagination'));

const app = new Vue({
    el: '#app',
    components : {
        MainComponent,
    },
    routes
});
