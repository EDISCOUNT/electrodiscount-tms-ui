<template>
    <v-app>
        <v-main>
            <v-card :color="secondaryBg" height="100vh">
                <!-- {{ { secondaryBg } }} -->
                <!-- <v-card-text> -->

                <v-row justify="center" align="center" class="fill-height">
                    <v-card width="400px" flat>
                        <v-card-title>Login</v-card-title>
                        <v-card-subtitle>
                            Please login to continue
                        </v-card-subtitle>
                        <v-card-text>
                            <v-form ref="form">
                                <v-text-field label="Username" v-model="username" variant="outlined" density="compact" />
                                <v-text-field label="Password" v-model="password" type="password" variant="outlined"
                                    density="compact" />
                                <v-btn @click="login" color="primary" :elevation="0" :loading="authenticating"
                                    block>Login</v-btn>
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

import { reactive, ref, watch } from 'vue';
import { useAccountStore } from '@/store/app';
import { useRouter } from 'vue-router';
import { useNotifier } from 'vuetify-notifier';
import { useColorScheme } from '@/utils/color';

const accountStore = useAccountStore();
const router = useRouter();
const notifier = useNotifier();
const { secondaryBg } = useColorScheme();
//

const form = ref();

const username = ref<string>();
const password = ref<string>();

const authenticating = ref(false);


async function login() {
    try {

        const { valid } = await (form.value as any).validate();
        if (!valid)
            throw new Error("Form is not valid");

        authenticating.value = true;
        const data = {
            username: username.value as string,
            password: password.value as string,
        };
        await accountStore.login(data);
        notifier.toastSuccess({ text: "Login successful" });

        if (accountStore.hasTargetPath) {
            const route = accountStore.targetRoute!;
            router.push(route);
            console.log("Redirecting to target route", route);
        } else {
            if (accountStore.isGranted('ROLE_CARRIER_OPERATOR')) {
                router.replace({ name: 'carrier:home' });
            }
            else if (accountStore.isGranted('ROLE_ADMIN')) {
                router.replace({ name: 'admin:home' });
            }

            router.replace({ name: 'carrier:home' });
            console.log("Redirecting to Home",);
        }
    }
    catch (err) {
        if ('response' in (err as any)) {
            const { data: { status, message, detail, errors: _errors } } = (err as any).response;
            if (_errors) {
                for (const error of _errors) {
                    notifier.toastError(error.messag)
                }
            }
            else
                notifier.toastError(message ?? detail)
        }
        else {
            const message = (err as any).message;
            notifier.toastError(`Login failed: ${message}`);
        }
    }
    finally {
        authenticating.value = false;
    }
}

</script>
