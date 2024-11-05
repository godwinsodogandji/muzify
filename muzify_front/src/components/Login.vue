<template>
    <div class=" login-container flex items-center justify-center min-h-screen bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md transition-transform transform hover:scale-105"
            style="background-color: rgba(229, 231, 235, 0.6);">
            <h2 class="text-3xl font-bold text-center mb-8 text-gray-800">Connexion</h2>
            <form @submit.prevent="handleSubmit">
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
                    Se connecter
                </button>
            </form>
            <p class="mt-4 text-center text-gray-600">
                Pas encore de compte ?
                <router-link to="/register"
                    class="text-blue-500 hover:underline transition duration-200 ease-in-out">Créez-en un
                    ici</router-link>
            </p>
            <p v-if="errorMessage" class="mt-4 text-center text-red-600">{{ errorMessage }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const email = ref('');
const password = ref('');
const router = useRouter();
const errorMessage = ref('');

const handleSubmit = async () => {
    errorMessage.value = ''; // Réinitialiser le message d'erreur
    try {
        const response = await axios.post('http://localhost:3000/api/login', {
            email: email.value,
            password: password.value,
        });


        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username)
            router.push('/');
        }
    } catch (error) {
        if (error.response) {
            errorMessage.value = error.response.data.error;
        } else {
            errorMessage.value = 'Erreur lors de la connexion. Veuillez réessayer.';
        }
    }
};
</script>

<style scoped>
.login-container {
    background-image: url('../assets/overhead-view-vinyl-records-headphone-wireless-speaker-with-laptop.jpg');

    background-size: cover;

    background-position: center;

}
</style>