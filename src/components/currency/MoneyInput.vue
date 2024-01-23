<template>
    <!-- <v-card variant="outlined" flat> -->
    <v-row no-gutters>
        <v-col :cols="4">
            <v-select v-model="data.currency" :items="currencies" item-value="code" item-title="code" placeholder="Currency"
                density="compact" class="ma-0 pa-0" variant="outlined" />
        </v-col>
        <v-col :cols="8">
            <v-text-field v-model.number="data.amount" style="font-size: 30px;" :step="0.01" :min="0"
                placeholder="Enter amount" class="ml-2" variant="outlined" density="compact" type="number">
                <template v-slot:prepend-inner>
                </template>
            </v-text-field>
        </v-col>
    </v-row>
    <!-- </v-card> -->
</template>
<script lang="ts" setup>
import Money, { MoneyFormData } from '@/model/currency/money';
import { onMounted } from 'vue';
import { reactive, watch } from 'vue';

const props = defineProps<{
    modelValue?: MoneyFormData,
}>();

const emit = defineEmits<{
    (e: 'update:model-value', value?: MoneyFormData): void;
}>();

const currencies = [
    {
        code: 'USD',
        symbol: '$',
    },
    {
        code: 'GBP',
        symbol: '%',
    },
    {
        code: 'EUR',
        symbol: '%',
    }
];

const data = reactive({
    currency: undefined as string | undefined,
    amount: undefined as number | undefined
});




watch(() => props.modelValue, (price) => updatePriceData(price));
onMounted(() => updatePriceData(props.modelValue));
//

watch(data, (priceInfo) => {
    const data = { ...priceInfo };
    if (typeof (data.amount) === 'number') {
        data.amount = Math.round(data.amount * 100);
    }
    emit('update:model-value', data);
    // const price = Money.fromJson(data);
    // console.log("OUT PRICE: ", price);
    // emit('update:model-value', price);
});


let price_updatable = true;
function updatePriceData(input?: MoneyFormData) {
    if (!price_updatable) {
        return;
    }
    price_updatable = false;
    if (input) {
        if (typeof (input.amount) === 'number') {
            input = { ...input };
            input.amount = Number(((input.amount?? 0) / 100).toFixed(2));
        }
        const { amount, currency } = input;

        // console.log("IN PRICE: ", { currency, amount });
        data.amount = amount;
        data.currency = currency;
    }
    else {
        data.amount = undefined;
        data.currency = undefined;
    }
    setTimeout(() => price_updatable = true, 10);
}

</script>