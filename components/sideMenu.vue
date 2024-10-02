<template>
	<div class="relative">
		<button @click="toggleMenu" class="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors duration-300">
			<span class="block w-6 h-0.5 bg-white mb-1"></span>
			<span class="block w-6 h-0.5 bg-white mb-1"></span>
			<span class="block w-6 h-0.5 bg-white"></span>
		</button>
		<aside :class="['fixed top-0 left-0 h-full w-64 md:w-72 p-6 bg-black bg-opacity-80 text-white transition-transform duration-300 ease-in-out', isMenuOpen ? 'translate-x-0' : '-translate-x-full']">
			<nav class="space-y-8 text-sm">
				<div class="space-y-4">
					<h2 class="text-lg font-semibold tracking-wider uppercase text-yellow-400">Menú del Reino</h2>
					<div class="flex flex-col space-y-2">
						<NuxtLink class="hover:text-yellow-400 transition-colors duration-300" rel="noopener noreferrer" to="/home">Inicio</NuxtLink>
						<NuxtLink class="hover:text-yellow-400 transition-colors duration-300" rel="noopener noreferrer" to="/recursos">Recursos</NuxtLink>
						<NuxtLink class="hover:text-yellow-400 transition-colors duration-300" rel="noopener noreferrer" to="/edificios">Edificios</NuxtLink>
						<NuxtLink class="hover:text-yellow-400 transition-colors duration-300" rel="noopener noreferrer" to="/ejercito">Ejército</NuxtLink>
						<NuxtLink class="hover:text-yellow-400 transition-colors duration-300" rel="noopener noreferrer" to="/alianzas">Alianzas</NuxtLink>
					</div>
				</div>
				<div class="space-y-4">
					<h2 class="text-lg font-semibold tracking-wider uppercase text-yellow-400">Acciones</h2>
					<div class="flex flex-col space-y-2">
						<a class="hover:text-yellow-400 transition-colors duration-300" rel="noopener noreferrer" href="#" @click="cerrarSesion">Cerrar Sesión</a>
					</div>
				</div>
			</nav>
		</aside>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
	isMenuOpen.value = !isMenuOpen.value;
};

const cerrarSesion = () => {
	console.log('Cerrando sesión...');
	// Aquí puedes agregar la lógica para cerrar la sesión
	// Por ejemplo, podrías redirigir al usuario a la página de inicio de sesión
	// navigateTo('/login');
};
</script>
