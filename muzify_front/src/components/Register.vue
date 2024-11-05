<template>
    <div class=" register-container flex items-center justify-center min-h-screen bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md transition-transform transform hover:scale-105"
            style="background-color: rgba(229, 231, 235, 0.6);">
            <h2 class="text-3xl font-bold text-center mb-8 text-gray-800">Créer un Compte</h2>
            <form @submit.prevent="handleSubmit">
                <div class="mb-6">
                    <label for="username" class="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                    <input type="text" id="username" v-model="username" required
                        placeholder="Entrez votre nom d'utilisateur"
                        class="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out" />
                </div>
                <div class="mb-6">
                    <label for="email" class="block text-sm font-medium text-gray-700">E-mail</label>
                    <input type="email" id="email" v-model="email" required placeholder="Entrez votre e-mail"
                        class="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out" />
                </div>
                <div class="mb-6">
                    <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
                    <input type="password" id="password" v-model="password" required
                        placeholder="Entrez votre mot de passe"
                        class="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out" />
                </div>
                <button type="submit"
                    class="w-full bg-blue-400 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out shadow-md transform hover:translate-y-1">
                    S'inscrire
                </button>
            </form>
            <p v-if="errorMessage" class="mt-4 text-center text-red-600">{{ errorMessage }}</p>
            <p class="mt-4 text-center text-gray-600">
                Déjà un compte ?
                <router-link to="/login"
                    class="text-blue-600 hover:underline transition duration-200 ease-in-out">Connectez-vous
                    ici</router-link>
            </p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const username = ref('');
const email = ref('');
const password = ref('');
const router = useRouter();
const errorMessage = ref(''); // Variable pour stocker le message d'erreur

const handleSubmit = async () => {
    errorMessage.value = '';
    try {
        const response = await axios.post('http://localhost:3000/api/register', {
            username: username.value,
            email: email.value,
            password: password.value,
        });

        // Vérifiez si la réponse est réussie
        if (response.status === 201) {
            router.push('/login'); // Rediriger vers la page de connexion
        }
    } catch (error) {
        // Vérifiez si l'erreur est due à une réponse du serveur
        if (error.response) {
            errorMessage.value = error.response.data.error;
        } else {
            errorMessage.value = 'Erreur lors de l\'inscription. Veuillez réessayer.';
            console.error('Erreur lors de l\'inscription:', error.message);
        }
    }
};
</script>

<style scoped>
.register-container {
    background-image: url('../assets/vinyl-records-headphone-wireless-speaker-with-laptop-against-white-background.jpg');
    /* Remplacez par le chemin de votre image */
    background-size: cover;
    /* Couvre tout l'écran */
    background-position: center;
    /* Centre l'image */
}
</style>