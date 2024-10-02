<script setup lang="ts">
import { object, string, type InferType, ref as yupRef } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { reactive, ref, onMounted } from "vue";
import { useRuntimeConfig } from "#app";

const runtimeConfig = useRuntimeConfig();

const loginSchema = object({
  username: string().required("Requerido"),
  password: string()
    .min(8, "Debe tener al menos 8 caracteres")
    .required("Requerido"),
});

type LoginSchema = InferType<typeof loginSchema>;

const loginState = reactive({
  username: "",
  password: "",
});

const errorEnCredenciales = ref(false);
const audioPlayer = ref<HTMLAudioElement | null>(null);
const registroNoDisponible = ref(true);

onMounted(() => {
  audioPlayer.value = new Audio('/audio/musicaMedieval.mp3');
  audioPlayer.value.loop = true;
  audioPlayer.value.play().catch(error => {
    console.error('Error al reproducir el audio:', error);
  });
});

async function onLoginSubmit(event: FormSubmitEvent<LoginSchema>) {
  // Función de inicio de sesión deshabilitada
  console.log("Inicio de sesión no disponible por el momento");
}

function irAJuego() {
  window.location.href = "/game";
}
</script>

<template>
  <div class="login-container">
    <h1 class="login-title">Legacy of Nations</h1>
    <h2 class="login-subtitle">Ingresa a tu reino</h2>
    <div class="login-box">
      <div class="login-form">
        <h2 class="form-title">ACCESO AL REINO</h2>
        <UForm
          :schema="loginSchema"
          :state="loginState"
          class="form-fields"
          @submit="onLoginSubmit"
        >
          <UFormGroup label="Nombre de usuario" name="username" class="form-group">
            <UInput v-model="loginState.username" type="text" class="form-input" disabled />
          </UFormGroup>
          <UFormGroup label="Contraseña" name="password" class="form-group">
            <UInput v-model="loginState.password" type="password" class="form-input" disabled />
          </UFormGroup>
          <UButton type="submit" class="submit-button" disabled>Entrar al Reino</UButton>
        </UForm>
        <p class="registro-no-disponible">El registro no está disponible por el momento</p>
      </div>
      <UButton @click="irAJuego" class="jugar-button">Probar versión demo beta</UButton>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: url('assets/images/medievalBackground.jfif') no-repeat center center fixed;
  background-size: cover;
  font-family: 'MedievalSharp', cursive;
  padding: 1rem;
}

.login-title {
  font-size: 2.5rem;
  color: #ffd700;
  text-shadow: 3px 3px 6px #000000;
  margin-bottom: 0.5rem;
  letter-spacing: 2px;
  text-align: center;
}

.login-subtitle {
  font-size: 1rem;
  color: #ffffff;
  text-shadow: 2px 2px 4px #000000;
  margin-bottom: 1rem;
  text-align: center;
}

.login-box {
  background: rgba(0, 0, 0, 0.8);
  padding: 1.5rem;
  border-radius: 10px;
  border: 2px solid #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  width: 90%;
  max-width: 400px;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-title {
  font-size: 1.3rem;
  color: #ffd700;
  margin-bottom: 1rem;
  text-align: center;
  text-shadow: 2px 2px 4px #000000;
  letter-spacing: 1px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  color: #ffffff;
  display: flex;
  flex-direction: column;
}

.form-input {
  padding: 0.5rem;
  border: 2px solid #808080;
  border-radius: 8px;
  font-size: 1rem;
  background-color: rgba(128, 128, 128, 0.3);
  color: #808080;
}

.submit-button, .jugar-button {
  background-color: #808080;
  color: #ffffff;
  padding: 0.8rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: not-allowed;
  transition: all 0.3s ease;
  font-family: 'MedievalSharp', cursive;
  text-transform: uppercase;
  font-weight: bold;
  margin-top: 1rem;
  letter-spacing: 1px;
  opacity: 0.7;
}

.jugar-button {
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  opacity: 1;
}

.jugar-button:hover {
  background-color: #45a049;
}

.registro-no-disponible {
  margin-top: 1rem;
  color: #ff6b6b;
  text-align: center;
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .login-title {
    font-size: 2rem;
  }

  .login-subtitle {
    font-size: 0.9rem;
  }

  .login-box {
    padding: 1rem;
  }

  .form-title {
    font-size: 1.1rem;
  }

  .submit-button, .jugar-button {
    font-size: 0.9rem;
  }
}
</style>