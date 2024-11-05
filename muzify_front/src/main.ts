import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Importer Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons'; // Importer toutes les icônes solides

// Ajouter les icônes à la bibliothèque
library.add(fas);

const app = createApp(App);

// Enregistrer le composant FontAwesomeIcon globalement
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(router);
app.mount('#app');