<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-gray-400 p-3">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <img src="../assets/1.png" alt="Muzify Logo" class="h-8 w-8 mr-2 rounded-lg" />
            <span class="text-xl font-semibold text-gray-900">Muzify</span>
          </div>
          <div class="hidden md:flex space-x-4">
            <router-link to="/" class="text-gray-800 mr-3 hover:text-white">Home</router-link>
            <router-link to="/login" class="text-gray-800 hover:text-white">Se connecter</router-link>
          </div>
          <div class="hidden md:flex items-center">
            <span class="text-md text-gray-800">{{ timer }}</span>
            <span class="ml-10 text-md text-gray-800" v-if="username">Bienvenue, {{ username }}</span>
            <button @click="logout" class="ml-10 text-md  text-gray-800 hover:text-red-500">Déconnexion</button>
          </div>
        </div>
      </div>
    </nav>
    <main>
      <Albums />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Albums from '../components/Albums.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const timer = ref("00:00:00");
let intervalId: ReturnType<typeof setInterval> | null = null;
let elapsedTime = 0;
const username = ref<string | null>(null);

// Fonction pour démarrer le timer
const startTimer = () => {
  intervalId = setInterval(() => {
    elapsedTime++;
    timer.value = formatTime(elapsedTime);
  }, 1000);
};

// Fonction pour arrêter le timer
const stopTimer = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

// Fonction pour formater le temps en HH:MM:SS
const formatTime = (seconds: number) => {
  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${secs}`;
};

// Fonction de déconnexion
const logout = async () => {
  try {
    await axios.post('http://localhost:3000/api/logout', {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` // Envoyer le token pour la déconnexion
      }
    });
    localStorage.removeItem('token'); 
    localStorage.removeItem('username');
    username.value = null; 
    router.push('/login'); 
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
};

// Récupérer le nom d'utilisateur depuis le stockage local
onMounted(() => {
  username.value = localStorage.getItem('username');
  startTimer();
});

// Nettoyer l'intervalle lorsque le composant est détruit
onBeforeUnmount(() => {
  stopTimer();
});
</script>

<style scoped></style>