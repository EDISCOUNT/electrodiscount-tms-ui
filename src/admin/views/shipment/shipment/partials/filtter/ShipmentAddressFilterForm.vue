<template>
    <v-card flat>
        <v-card-text>
            <v-row>
                <v-col :cols="12" :md="6">
                    <v-combobox v-model="data.firstName" label="First Name" placeholder="Enter Firstname" variant="outlined"
                        density="compact" multiple chips clearable>

                        <template v-slot:selection="{ item, index, }">
                            <template v-if="index == 0">
                                <v-chip size="small">{{ item?.raw }}</v-chip>
                            </template>
                            <template v-else-if="index == ((data.firstName?.length ?? 0) - 1)">
                                <v-chip size="small">
                                    +{{ (data.firstName!.length ?? 0) - 1 }} more
                                </v-chip>
                            </template>
                        </template>
                    </v-combobox>
                </v-col>
                <v-col :cols="12" :md="6">
                    <v-combobox v-model="data.lastName" label="Last Name" placeholder="Enter Lastname" variant="outlined"
                        density="compact" multiple chips clearable>
                        <template v-slot:selection="{ item, index, }">
                            <template v-if="index == 0">
                                {{ item?.raw }}
                            </template>
                            <template v-else-if="index == ((data.lastName?.length ?? 0) - 1)">
                                <v-chip size="small">
                                    +{{ (data.lastName!.length ?? 0) - 1 }} more
                                </v-chip>
                            </template>
                        </template>
                    </v-combobox>
                </v-col>

                <v-col :cols="12" :md="6">
                    <v-combobox v-model="data.emailAddress" label="Email address" placeholder="Enter email address"
                        variant="outlined" density="compact" multiple chips clearable>
                        <template v-slot:selection="{ item, index, }">
                            <template v-if="index == 0">
                                {{ item?.raw }}
                            </template>
                            <template v-else-if="index == ((data.emailAddress?.length ?? 0) - 1)">
                                <v-chip size="small">
                                    +{{ (data.emailAddress!.length ?? 0) - 1 }} more
                                </v-chip>
                            </template>
                        </template>
                    </v-combobox>
                </v-col>
                <v-col :cols="12" :md="6">
                    <v-combobox v-model="data.phoneNumber" label="Phone Number" placeholder="Enter phone number"
                        variant="outlined" density="compact" multiple chips clearable>
                        <template v-slot:selection="{ item, index, }">
                            <template v-if="index == 0">
                                {{ item?.raw }}
                            </template>
                            <template v-else-if="index == ((data.phoneNumber?.length ?? 0) - 1)">
                                <v-chip size="small">
                                    +{{ (data.phoneNumber!.length ?? 0) - 1 }} more
                                </v-chip>
                            </template>
                        </template>
                    </v-combobox>
                </v-col>


                <v-col :cols="12" :md="6">
                    <v-combobox v-model="data.company" label="Company" placeholder="Enter company or place name"
                        variant="outlined" density="compact" multiple chips clearable>
                        <template v-slot:selection="{ item, index, }">
                            <template v-if="index == 0">
                                {{ item?.raw }}
                            </template>
                            <template v-else-if="index == ((data.company?.length ?? 0) - 1)">
                                <v-chip size="small">
                                    +{{ (data.company!.length ?? 0) - 1 }} more
                                </v-chip>
                            </template>
                        </template>
                    </v-combobox>
                </v-col>

                <v-col :cols="12" :md="6">
                    <v-combobox v-model="data.street" label="Street Address" placeholder="Enter street" variant="outlined"
                        density="compact" multiple chips clearable>
                        <template v-slot:selection="{ item, index, }">
                            <template v-if="index == 0">
                                {{ item?.raw }}
                            </template>
                            <template v-else-if="index == ((data.street?.length ?? 0) - 1)">
                                <v-chip size="small">
                                    +{{ (data.street!.length ?? 0) - 1 }} more
                                </v-chip>
                            </template>
                        </template>
                    </v-combobox>
                </v-col>



                <v-col :cols="12" :md="6">
                    <v-combobox v-model="data.city" label="City/Town" placeholder="Enter city or town name"
                        variant="outlined" density="compact" multiple chips clearable>

                        <template v-slot:selection="{ item, index, }">
                            <template v-if="index == 0">
                                {{ item?.raw }}
                            </template>
                            <template v-else-if="index == ((data.city?.length ?? 0) - 1)">
                                <v-chip size="small">
                                    +{{ (data.city!.length ?? 0) - 1 }} more
                                </v-chip>
                            </template>
                        </template>
                    </v-combobox>
                </v-col>

                <v-col :cols="12" :md="6">
                    <v-combobox v-model="data.provinceName" label="State/Province Code(Optional)"
                        placeholder="Enter State or Province Code(Optional)" variant="outlined" density="compact" multiple
                        chips clearable>

                        <template v-slot:selection="{ item, index, }">
                            <template v-if="index == 0">
                                {{ item?.raw }}
                            </template>
                            <template v-else-if="index == ((data.provinceName?.length ?? 0) - 1)">
                                <v-chip size="small">
                                    +{{ (data.provinceName!.length ?? 0) - 1 }} more
                                </v-chip>
                            </template>
                        </template>
                    </v-combobox>
                </v-col>
                <v-col :cols="12" :md="6">
                    <v-combobox v-model="data.postcode" label="Postcode/Zipcode" placeholder="Enter postcode"
                        variant="outlined" density="compact" multiple chips clearable>
                        <template v-slot:selection="{ item, index, }">
                            <template v-if="index == 0">
                                {{ item?.raw }}
                            </template>
                            <template v-else-if="index == ((data.postcode?.length ?? 0) - 1)">
                                <v-chip size="small">
                                    +{{ (data.postcode!.length ?? 0) - 1 }} more
                                </v-chip>
                            </template>
                        </template>
                    </v-combobox>
                </v-col>
                <v-col :cols="12" :md="6">
                    <v-autocomplete v-model="data.countryCode" :items="countries" item-title="name" item-value="code"
                        label="Country" placeholder="Select country" variant="outlined" density="compact" clearable multiple
                        chips>

                        <template v-slot:selection="{ item, index, }">
                            <template v-if="index == 0">
                                {{ item?.raw?.name }}
                            </template>
                            <template v-else-if="index == ((data.countryCode?.length ?? 0) - 1)">
                                <v-chip size="small">
                                    +{{ (data.countryCode!.length ?? 0) - 1 }} more
                                </v-chip>
                            </template>
                        </template>

                    </v-autocomplete>
                </v-col>

            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-spacer/>
            <v-btn variant="plain" @click="() => clear()">
                Clear
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script lang="ts" setup>
import { AddressFormData } from '@/model/addressing/address';
import ShipmentFulfilmentType from '@/model/shipment/shipment_fulfilment_type';
import { getCountries } from '@/utils/intl';
import { like } from '@/utils/rsql';
import { Comparison, and, comparison, eq, inList, or, outList } from 'rsql-builder';
import { reactive, watch } from 'vue';
import { AddressFilterFormData } from './types';


const props = defineProps<{
    modelValue?: AddressFilterFormData;
}>();


const emit = defineEmits<{
    (e: 'update:rsql', rsql?: string): void;
    (e: 'update:model-value', value?: AddressFilterFormData): void;
}>();


const countries = getCountries();

const data = reactive<AddressFilterFormData>(props.modelValue ?? {});



// interface AddressFilterFormDataExtension
// // extends AddressFormData
// {
//     countryCode?: string[] | string;
// }

// type AddressFilterFormData = AddressFormData & AddressFilterFormDataExtension;


watch(() => data, () => {
    emit('update:rsql', buildRsql(data));
    emit('update:model-value', data);
}, { deep: true, immediate: false });



function buildRsql(input: AddressFilterFormData) {
    const reverseShipmentTypes = [ShipmentFulfilmentType.RETURN_ORDER, ShipmentFulfilmentType.EXCHANGE_ORDER];
    const originFilter = buildAddressRsql(input, 'originAddress');
    const destinationFilter = buildAddressRsql(input, 'destinationAddress');
    if (!originFilter && !destinationFilter) {
        return undefined;
    }
    return or(
        and(
            comparison('fulfilmentType', inList(...reverseShipmentTypes)),
            originFilter,
        ),
        and(
            comparison('fulfilmentType', outList(...reverseShipmentTypes)),
            destinationFilter,
        ),
    );
}

function buildAddressRsql(input: AddressFilterFormData, field: string): string {

    const predicates: (Comparison | string)[] = [];
    for (const key in input) {
        const value = (input as any)[key];
        if (key == 'street' || !value) {
            continue;
        }

        const selector = `${field}.${key}`;
        if (Array.isArray(value)) {
            if (value.length == 0) {
                continue;
            }
            predicates.push(comparison(selector, inList(...value)));
        } else {
            predicates.push(comparison(selector, eq(value)));
        }

    }

    if ('street' in input && input.street && input.street?.length > 0) {
        const street = input.street;
        const streetPredicates: Comparison[] = street.map(s => comparison(`${field}.street`, like(s)));
        if (streetPredicates.length > 0) {
            predicates.push(or(...streetPredicates));
        }
    }

    return and(...predicates);
}



function clear() {
    for (const key in data) {
        delete (data as any)[key];
    }
}
</script>