<template>
    <div>
      <h1>Crear Nuevo Usuario</h1>
      <form @submit.prevent="createUser">
        <label for="username">Nombre de Usuario:</label>
        <input type="text" id="username" v-model="username" required><br>
        
        <label for="password">Contraseña:</label>
        <input type="password" id="password" v-model="password" required><br>
        
        <label for="role">Rol:</label>
        <input type="text" id="role" v-model="role"><br>
        
        <button type="submit">Crear Usuario</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRuntimeConfig } from "#app";
  import { useRouter } from 'vue-router'; // Importar el router
  
  const router = useRouter(); // Obtener la instancia del router
  
  const runtimeConfig = useRuntimeConfig();
  
  const username = ref("");
  const password = ref("");
  const role = ref("");
  
  const createUser = async () => {
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
  
      const response = await fetch(`${runtimeConfig.public.backendurl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
          role: role.value,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
  
      alert('User created successfully!');
      username.value = '';
      password.value = '';
      role.value = '';
  
      // Redirigir al usuario a la página productsAdmin después de crear el usuario
      router.push('/productsAdmin');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user. Please try again.');
    }
  };
  </script>
  