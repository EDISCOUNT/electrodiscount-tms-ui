import Address from "@/model/addressing/address";
import { defineStore } from "pinia";
import { ref } from "vue";

const addressStore = defineStore('address-store',() => {

    const addresses = ref<Address[]>([]);

});