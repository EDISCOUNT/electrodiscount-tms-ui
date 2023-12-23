<template>
    <v-app>
        <v-main>
            <v-card color="secondary-bg" height="100vh">
                <!-- <v-card-text> -->

                <v-row justify="center" align="center" class="fill-height">
                    <v-card width="400px" flat>
                        <v-card-title>Admin Login</v-card-title>
                        <v-card-text>
                            <v-form>
                                <v-text-field label="Username" v-model="username" variant="outlined" />
                                <v-text-field label="Password" v-model="password" variant="outlined" />
                                <v-btn @click="login" color="primary" :elevation="0" block>Login</v-btn>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-row>
                <!-- </v-card-text> -->
            </v-card>
        </v-main>
    </v-app>
</template>
<script lang="ts" setup>

import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()

async function login() {
    const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username.value, password: password.value })
    })
    if (response.ok) {
        router.push('/admin')
    }
}

</script>
