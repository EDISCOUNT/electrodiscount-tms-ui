import Address, { AddressFormData} from "@/model/addressing/address";


export function formatAddress(address: Address | AddressFormData){
    if(!(address instanceof Address)){
        address = Address.fromJson(address);
    }
    return address.formatted;
}