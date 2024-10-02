<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const schema = object({
  email: string().email('Invalid email').required('Required'),
  password: string()
    .min(8, 'Must be at least 8 characters')
    .required('Required'),
  address: string().required('Required'),
  creditCard: string().required('Required') // You can add validation rules specific to credit card numbers
})

type Schema = InferType<typeof schema>

const state = reactive({
  email: undefined,
  password: undefined,
  address: undefined,
  creditCard: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  window.location.href = "/home";
  console.log(event.data)
}
</script>
<template>
    <Menu2></Menu2>
    <body>
    <div>
      <!-- Your existing components (Menu2, UForm, etc.) can go here -->
  
      <!-- Additional fields -->
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Email" name="email" >
        <UInput v-model="state.email" />
      </UFormGroup>
  
      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>
  
      <UFormGroup label="Repeat Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>
  
      <!-- New fields -->
      <UFormGroup label="Address" name="address">
        <UInput v-model="state.address" />
      </UFormGroup>
  
      <UFormGroup label="Credit Card Number" name="credit-card">
        <UInput v-model="state.creditCard" />
      </UFormGroup>
  
      <!-- Add any other necessary fields here -->
  
      <UButton type="submit" class="btn btn-primary btn-lg">
        Submit
      </UButton>
    </UForm>
    </div>
  </body>
  </template>
  
  <style scoped>
  body {
    text-align: center;
    padding: 2rem;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    height: 600px;
    background-color: rgba(255, 228, 196, 0.2);
  }</style>
  