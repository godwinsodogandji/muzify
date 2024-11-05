<template>
  <div class="albums-container p-6 mt-6">
    <h1 class="text-3xl text-center font-bold mb-10 text-gray-800">Page principale Album Music</h1>
    <div class="mb-6 mx-20 flex justify-center">
      <input type="text" placeholder="Search..." v-model="searchQuery"
        class="border border-gray-400 rounded-lg p-2 w-2/4" />
    </div>
    <div class="flex">
      <!-- Aside pour les détails de l'album à gauche -->
      <AlbumDetails v-if="selectedAlbum" :album="selectedAlbum" :visible="showAside" @close="closeAside"
        class="aside" />

      <!-- Contenu des albums à droite -->
      <div class="flex-1">
        <div class="grid grid-cols-1 gap-6 mx-2">
          <div v-if="loading" class="text-center text-gray-600">Chargement des albums...</div>
          <div v-if="error" class="text-center text-red-600">{{ error }}</div>
          <div v-for="album in paginatedAlbums" :key="album.id"
            class="bg-white p-4 mx-20 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 flex items-center"
            style="background-color: rgba(229, 231, 235, 0.7);">
            <div class="w-1/3 pr-6">
              <router-link :to="`/description/${album.id}`">
                <img :src="album.url" alt="Album Cover" class="rounded-lg" />
              </router-link>
            </div>
            <div class="w-2/3 flex flex-col">
              <h2 class="text-xl font-semibold text-gray-800">{{ album.title }}</h2>
              <p class="text-gray-500">{{ album.name }}</p>
              <p class="mt-2 text-gray-600">{{ album.description }}</p>
              <div class="flex justify-between items-center mt-4">
                <span v-for="tag in album.tags" :key="tag"
                  class="bg-yellow-400 text-gray-800 px-2 py-1 rounded-full text-sm">{{ tag }}</span>
              </div>
              <div class="flex justify-between items-center mt-4">
                <span class="text-gray-600">
                  <font-awesome-icon icon="heart" /> {{ album.like }}
                </span>
                <span class="text-gray-600">
                  <font-awesome-icon icon="clock" />
                  {{ album.duration }} min
                </span>
                <button @click="showDetails(album)"
                  class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                  <font-awesome-icon icon="info-circle" />
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div class="flex justify-between items-center mt-4">
          <div class="flex">
            <button @click="prevPage" :disabled="currentPage === 1"
              class="flex items-center bg-blue-500 text-white px-3 py-1 rounded-l-lg hover:bg-blue-600 disabled:opacity-50 transition duration-200">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="flex items-center bg-blue-500 text-white px-3 py-1 rounded-r-lg hover:bg-blue-600 disabled:opacity-50 transition duration-200">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div class="flex justify-center mt-4 space-x-2">
          <button v-if="currentPage > 2" @click="goToPage(1)"
            class="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-300">1</button>
          <span v-if="currentPage > 3" class="self-center">...</span>
          <button v-for="page in pageNumbers" :key="page" @click="goToPage(page)"
            :class="{ 'bg-blue-500 text-white': currentPage === page, 'bg-gray-200 text-gray-800': currentPage !== page }"
            class="px-3 py-1 rounded-lg hover:bg-gray-300">
            {{ page }}
          </button>
          <span v-if="currentPage < totalPages - 2" class="self-center">...</span>
          <button v-if="currentPage < totalPages - 1" @click="goToPage(totalPages)"
            class="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-300">{{ totalPages }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import AlbumDetails from './AlbumDetails.vue';
import { RouterLink } from 'vue-router';

const albums = ref([]);
const loading = ref(true);
const error = ref('');
const currentPage = ref(1);
const itemsPerPage = 5; // Nombre d'albums par page
const selectedAlbum = ref(null);
const showAside = ref(false);
const searchQuery = ref(''); // Variable pour la recherche

const fetchAlbums = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/albums');
    albums.value = response.data.ALBUMS;
  } catch (err) {
    error.value = 'Erreur lors de la récupération des albums.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Méthode de filtrage des albums
const filteredAlbums = computed(() => {
  return albums.value.filter(album => {
    return album.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      album.name.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

const paginatedAlbums = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredAlbums.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(filteredAlbums.value.length / itemsPerPage);
});

// Logique de pagination
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const goToPage = (page) => {
  currentPage.value = page;
};

const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i);
  }
  return pages;
});

// Fonctions pour afficher et fermer l'aside
const showDetails = (album) => {
  selectedAlbum.value = album;
  showAside.value = true;
};

const closeAside = () => {
  showAside.value = false;
  selectedAlbum.value = null;
};

onMounted(() => {
  fetchAlbums();
});
</script>

<style scoped>
button {
  transition: background-color 0.2s ease;
}

.albums-container {
  background-image: url('../assets/black-bokeh-background.jpg');
  background-size: cover;
  background-position: center;
}

.flex {
  display: flex;
}
</style>