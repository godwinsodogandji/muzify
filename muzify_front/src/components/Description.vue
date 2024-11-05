<template>
    <div class="description">
        <div class="description-container p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md mt-20"
            style="background-color: rgba(229, 231, 235, 0.4);">
            <h1 class="text-4xl font-bold text-gray-800 mb-4" v-if="album">{{ album.title }}</h1>
            <img v-if="album" :src="album.url" alt="Album Cover" class="rounded-lg mb-4 shadow-lg" />
            <p class="text-lg text-gray-700 mb-2" v-if="album">{{ album.name }}</p>
            <p class="text-gray-600 mb-4" v-if="album">{{ album.description }}</p>

            <p v-if="loading" class="text-gray-500">Chargement des détails de l'album...</p>
            <p v-if="error" class="text-red-500">{{ error }}</p>

            <router-link to="/"
                class="mt-4 inline-block text-blue-600 hover:text-blue-800 font-semibold transition duration-200">
                &larr; Retour à la liste des albums
            </router-link>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const album = ref(null);
const loading = ref(true);
const error = ref(null);
const route = useRoute();

const fetchAlbumDetails = async (id: string) => {
    loading.value = true; // Démarre le chargement
    error.value = null; // Réinitialise l'erreur

    try {
        const response = await axios.get(`http://localhost:3000/api/albums/${id}`);
        album.value = response.data;
    } catch (err) {
        console.error('Erreur lors de la récupération de l\'album :', err);
        error.value = "Impossible de récupérer les détails de l'album.";
        album.value = null; // Optionnel : définir album sur null en cas d'erreur.
    } finally {
        loading.value = false; // Arrête le chargement, qu'il y ait une erreur ou non.
    }
};

onMounted(() => {
    const albumId = route.params.id;
    fetchAlbumDetails(albumId);
});
</script>

<style scoped>
.description-container {

    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.description {
    background-image: url('../assets/black-bokeh-background.jpg');
    background-size: cover;
    background-position: center;
}
</style>