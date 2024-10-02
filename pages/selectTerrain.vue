<template>
  <div class="select-terrain-container">
    <h1 class="select-terrain-title">Selecciona tu Terreno</h1>
    <div v-if="terrenos.length > 0" class="terrain-table">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Ancho</th>
            <th>Alto</th>
            <th>Población</th>
            <th>Agricultura</th>
            <th>Ganadería</th>
            <th>Caza</th>
            <th>Pesca</th>
            <th>Tala</th>
            <th>Botánica</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="terreno in terrenos" :key="terreno.id">
            <td>{{ terreno.nombre }}</td>
            <td>{{ terreno.descripcion }}</td>
            <td>{{ terreno.ancho }}</td>
            <td>{{ terreno.alto }}</td>
            <td>{{ terreno.poblacion }}</td>
            <td>{{ terreno.agricultura }}</td>
            <td>{{ terreno.ganaderia }}</td>
            <td>{{ terreno.caza }}</td>
            <td>{{ terreno.pesca }}</td>
            <td>{{ terreno.tala }}</td>
            <td>{{ terreno.botanica }}</td>
            <td>
              <button @click="seleccionarTerreno(terreno.id)" class="select-button">Seleccionar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="loading">Cargando terrenos...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRuntimeConfig } from '#app';

const runtimeConfig = useRuntimeConfig();
const router = useRouter();

const terrenos = ref([]);

onMounted(async () => {
  await verificarTerrenoExistente();
  await cargarTerrenos();
});

async function verificarTerrenoExistente() {
  try {
    const response = await fetch(`${runtimeConfig.public.backendurl}/user/seleccionarTerreno/0`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getCookie('token')}`
      }
    });
    const data = await response.json();
    if (data.message === "El usuario ya tiene un terreno asignado") {
      router.push('/home');
    }
  } catch (error) {
    console.error('Error:', error);
    // Si el error es de ID inválido, continuamos normalmente
  }
}

async function cargarTerrenos() {
  try {
    const response = await fetch(`${runtimeConfig.public.backendurl}/xterreno`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getCookie('token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Error al cargar los terrenos');
    }
    terrenos.value = await response.json();
  } catch (error) {
    console.error('Error:', error);
    alert('Error al cargar los terrenos');
  }
}

async function seleccionarTerreno(terrenoId) {
  try {
    const response = await fetch(`${runtimeConfig.public.backendurl}/user/seleccionarTerreno/${terrenoId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getCookie('token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Error al seleccionar el terreno');
    }
    alert('Terreno seleccionado con éxito');
    router.push('/home');
  } catch (error) {
    console.error('Error:', error);
    alert('Error al seleccionar el terreno');
  }
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
</script>

<style scoped>
.select-terrain-container {
  /* Estilos para el contenedor principal */
}

.select-terrain-title {
  /* Estilos para el título */
}

.terrain-table {
  /* Estilos para la tabla de terrenos */
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.select-button {
  /* Estilos para el botón de selección */
}

.loading {
  /* Estilos para el mensaje de carga */
}
</style>