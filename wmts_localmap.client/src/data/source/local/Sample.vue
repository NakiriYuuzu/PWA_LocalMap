<template>
  <div>
    <h1>Image Manager</h1>
    <input type="file" @change="handleFileChange" />
    <input v-model="imageName" placeholder="Image Name" />
    <button @click="addImageHandler">Add Image</button>
    <button @click="fetchAllImagesHandler">Fetch All Images</button>

    <div v-if="allImages.length">
      <h2>All Images</h2>
      <ul>
        <li v-for="image in allImages" :key="image.name">
          {{ image.name }}: {{ image.image.name }}
          <img :src="previewImage(image.image)" alt="Stored Image" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import {addImage, getAllImages} from "@/data/source/local/IDBStorage"
import {ref} from "vue"


const imageName = ref('')
const imageFile = ref<File | null>(null)
const allImages = ref<Array<{ name: string; image: File }>>([])

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    imageFile.value = input.files[0]
  }
}

const addImageHandler = async () => {
  if (imageName.value && imageFile.value) {
    await addImage(imageName.value, imageFile.value)
    imageName.value = ''
    imageFile.value = null
  }
}

const fetchAllImagesHandler = async () => {
  allImages.value = await getAllImages()
}

const previewImage = (file: File) => {
  return URL.createObjectURL(file)
}
</script>