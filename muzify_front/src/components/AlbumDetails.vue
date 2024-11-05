<template>
    <aside v-if="visible" class="aside">
        <button @click="close" class="close-button"><font-awesome-icon icon="close" /></button>
        <div class="mb-5 mr-3">
            <img :src="album.url" alt="" class="rounded-lg">
        </div>
        <h2 class="text-xl font-bold">{{ album.title }}</h2>
        <p class="text-gray-600 mb-4">{{ album.name }}</p>
        <button @click="playMusic" class="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg">
            <font-awesome-icon icon="play" /> Play
        </button>

        <!-- Progress Bar -->
        <div class="mt-4">
            <div class="relative w-full h-2 bg-gray-200 rounded-full">
                <div :style="{ width: progress + '%' }" class="absolute h-full bg-green-500 rounded-full"></div>
            </div>
            <p class="text-sm text-gray-600 mt-1">{{ currentSongIndex + 1 }} / {{ songs.length }}</p>
        </div>

        <h3 class="mt-4 text-lg font-semibold">Songs:</h3>
        <ul class="mt-2 space-y-2">
            <li v-for="(song, index) in songs" :key="index"
                class="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-300">
                {{ song }}
            </li>
        </ul>
    </aside>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps<{
    album: {
        title: string;
        name: string;
        songsId: string;
        url: string;
    };
    visible: boolean;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
}>();

const close = () => {
    emit('close');
};

const songs = ref<string[]>([]);
const currentSongIndex = ref(0);
const progress = ref(0);
const intervalId = ref<number | null>(null);

// Fonction pour récupérer les chansons
const fetchSongs = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/album-lists');
        const albumList = response.data.find(list => list.id === props.album.songsId);
        if (albumList) {
            songs.value = albumList.songs;
            resetPlayback(); // Réinitialiser la lecture lorsque les chansons sont chargées
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des chansons:', error);
    }
};

// Fonction pour réinitialiser la lecture
const resetPlayback = () => {
    currentSongIndex.value = 0;
    progress.value = 0;
    clearInterval(intervalId.value); // Nettoyer l'ancien intervalle
};

// Fonction pour jouer la musique
const playMusic = () => {
    if (currentSongIndex.value < songs.value.length) {
        progress.value = 0; // Réinitialiser la progression
        const duration = 5; // Durée fictive de chaque chanson
        clearInterval(intervalId.value); // Assurez-vous de nettoyer l'ancien intervalle

        intervalId.value = window.setInterval(() => {
            if (progress.value < 100) {
                progress.value += (100 / duration);
            } else {
                clearInterval(intervalId.value!);
                currentSongIndex.value++;

                if (currentSongIndex.value < songs.value.length) {
                    playMusic();
                }
            }
        }, 1000);
    }
};

// Observer les changements de props.album pour réinitialiser la lecture
watch(() => props.album, () => {
    resetPlayback();
    fetchSongs(); // Récupérer les chansons pour le nouvel album
});

// Appeler la fonction lors du montage du composant
onMounted(() => {
    fetchSongs();
});

// Nettoyer l'intervalle lorsque le composant est détruit
onBeforeUnmount(() => {
    if (intervalId.value) {
        clearInterval(intervalId.value);
    }
});
</script>

<style scoped>
.aside {
    width: 300px;
    height: fit-content;
    background-color: white;
    box-shadow: 3px 0 10px rgba(0, 0, 0, 0.5);
    padding: 20px;
    z-index: 1000;
    margin-left: 100px;
    position: relative;
}

.close-button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
}
</style>