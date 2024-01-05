<template>
    <v-app-bar v-if="xs">
        <template v-slot:prepend>
            <v-btn @click="() => toggleNavbar()" :elevation="0" icon>
                <v-icon>mdi-menu</v-icon>
            </v-btn>
        </template>
        <v-toolbar-items>
            <v-list-item v-if="user" prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg" :title="user.fullName"
                :subtitle="user.username" nav>
                <template v-slot:append>
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props">
                                <v-icon>mdi-menu-down</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item @click="() => logout()">
                                <template v-slot:prepend>
                                    <v-icon>mdi-logout</v-icon>
                                </template>
                                <template v-slot:title>
                                    <span>Logout</span>
                                </template>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </template>
            </v-list-item>
        </v-toolbar-items>
    </v-app-bar>
    <v-navigation-drawer v-model="isOpen" :color="isDark ? undefined : 'primary'" :expand-on-hover="!sm" :rail="!xs">

        <!-- <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height"> -->

        <template v-slot:prepend>
            <v-list-item v-if="user" prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg" :title="user.fullName"
                :subtitle="user.username" nav>
                <template v-slot:append>
                    <v-tooltip>
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" @click="() => logout()" icon="mdi-logout" variant="plain" :elevation="0">
                            </v-btn>
                        </template>
                        <small>Logout</small>
                    </v-tooltip>
                </template>
            </v-list-item>
            <v-divider></v-divider>
        </template>

        <template v-slot:append>
            <v-list-item @click="() => toggleColorScheme()" title="Toggle color scheme" nav>
                <template v-slot:prepend>
                    <!-- <div class=""> -->
                        <template v-if="isDark">
                            <i class="v-icon notranslate v-theme--light v-icon--size-default v-icon--start"
                                aria-hidden="true"><svg class="v-icon__svg" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24" role="img" aria-hidden="true">
                                    <path
                                        d="M3.55,18.54L4.96,19.95L6.76,18.16L5.34,16.74M11,22.45C11.32,22.45 13,22.45 13,22.45V19.5H11M12,5.5A6,6 0 0,0 6,11.5A6,6 0 0,0 12,17.5A6,6 0 0,0 18,11.5C18,8.18 15.31,5.5 12,5.5M20,12.5H23V10.5H20M17.24,18.16L19.04,19.95L20.45,18.54L18.66,16.74M20.45,4.46L19.04,3.05L17.24,4.84L18.66,6.26M13,0.55H11V3.5H13M4,10.5H1V12.5H4M6.76,4.84L4.96,3.05L3.55,4.46L5.34,6.26L6.76,4.84Z">
                                    </path>
                                </svg></i>
                        </template>
                        <template v-else>
                            <i class="v-icon notranslate v-theme--light v-icon--size-default v-icon--start"
                                aria-hidden="true"><svg class="v-icon__svg" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24" role="img" aria-hidden="true">
                                    <path
                                        d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z">
                                    </path>
                                </svg></i>
                        </template>
                    <!-- </div> -->
                </template>
            </v-list-item>
            <v-divider></v-divider>
        </template>

        <v-container class="fill-height pa-0 ma-0">
            <v-responsive class="align-center fill-height pa-0 ma-0">


                <v-list density="compact" nav>

                    <!-- <v-list-item prepend-icon="mdi-package-variant-closed" title="Shipments"
                        :to="{ name: 'admin:shipment:index' }" value="myfiles"></v-list-item> -->

                    <!-- <v-list-group>
                        <template v-slot:activator="{ props, }">
                            <v-list-item v-bind="props" prepend-icon="mdi-package-variant-closed"
                                title="Shipments"></v-list-item>
                        </template>

                        <create-shipment-button>
                            <template v-slot:activator="{ props }">
                                <v-list-item v-bind="props" prepend-icon="mdi-truck" title="Create Shipment">
                                    <template v-slot:append>
                                        <v-icon>mdi-menu-down</v-icon>
                                    </template>
                                </v-list-item>
                            </template>
                        </create-shipment-button>
                        <v-list-item prepend-icon="mdi-package-variant-closed" title="Shipments"
                            :to="{ name: 'admin:shipment:index' }" value="myfiles"></v-list-item>
                    </v-list-group> -->


                    <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" :to="{ name: 'admin:home' }"
                        value="dashboard"></v-list-item>

                    <v-divider />
                    <create-shipment-button>
                        <template v-slot:activator="{ props, to }">
                            <!-- <v-list-item v-bind="props" prepend-icon="mdi-truck" title="Create Shipment">
                                <template v-slot:append>
                                    <v-icon>mdi-menu-down</v-icon>
                                </template>
                            </v-list-item> -->
                            <v-list-item :to="to" prepend-icon="mdi-truck" title="Create Shipment">
                            </v-list-item>
                        </template>
                    </create-shipment-button>
                    <v-list-item prepend-icon="mdi-package-variant-closed" title="Shipments"
                        :to="{ name: 'admin:shipment:index' }" value="myfiles"></v-list-item>

                    <v-list-item prepend-icon="mdi-storefront" title="Channels" :to="{ name: 'admin:channel:index' }"
                        value="shared"></v-list-item>
                    <!-- <v-list-subheader>
                Orders
            </v-list-subheader> -->
                    <v-divider />
                    <v-list-item prepend-icon="mdi-shopping" title="Orders" :to="{ name: 'admin:order:index' }"
                        value="orders"></v-list-item>
                    <v-list-item prepend-icon="mdi-tools" title="Additional Services"
                        :to="{ name: 'admin:order:additional_service:index' }" value="additional_service"></v-list-item>
                    <!--  -->
                    <v-list-item prepend-icon="mdi-truck-delivery" title="Carriers" :to="{ name: 'admin:carrier:index' }"
                        value="carrier"></v-list-item>
                    <!--  -->
                    <v-list-item prepend-icon="mdi-cart" title="Products" :to="{ name: 'admin:catalog:product:index' }"
                        value="products"></v-list-item>
                    <v-divider />
                    <v-list-item prepend-icon="mdi-account" title="Users" :to="{ name: 'admin:account:user:index' }"
                        value="users"></v-list-item>
                    <v-divider />
                    <v-list-item prepend-icon="mdi-email" title="Email Templates"
                        :to="{ name: 'admin:mailing:template:index' }" value="email_message_template"></v-list-item>
                </v-list>
            </v-responsive>
        </v-container>
    </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { useAccountStore, useUser } from '@/store/app';
import { useDisplay, useTheme } from 'vuetify';
import CreateShipmentButton from '../views/shipment/shipment/partials/CreateShipmentButton.vue';
import { useNotifier } from 'vuetify-notifier';
import { computed, ref, onMounted } from 'vue';


const { user, loading, error } = useUser();
const { logout: doLogout } = useAccountStore();
const { xs, sm } = useDisplay();
const theme = useTheme();
const notifier = useNotifier();


const isOpen = ref(false);
onMounted(() => {
    if (!xs.value) {
        isOpen.value = true;
    }
});

function toggleNavbar() {
    isOpen.value = !isOpen.value;
}

async function logout() {
    try {
        await doLogout();
        notifier.toastSuccess("You have been logged out");
        // window.location.href = '/admin/login';
    }
    catch (e) {
        const message = (e as any).message;
        notifier.toastError(message);
    }
}


const isDark = computed(() => theme.global.current.value.dark);

async function toggleColorScheme() {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

</script>