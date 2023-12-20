<template>
    <address>
        <strong>{{ address.fullName }}</strong>
        <br />
        {{ address.street }}
        <br />
        {{ address.city }},
        <template v-if="address.state">
            {{ address.state }},
            <!-- <br /> -->
        </template>
        {{ address.postcode }},
        <!-- <br /> -->
        {{ address.countryCode }}
        <br />
        {{ address.phoneNumber }}
    </address>
</template>
<script lang="ts" setup>
import Address from "@/model/addressing/address";

const props = defineProps<{
    address: Address;
}>();

</script>