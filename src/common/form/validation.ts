// {
//     required: value => !!value || 'This field is required',
//     email: value => /.+@.+\..+/.test(value) || 'Enter a valid email address',
//   }



export const required = () =>  (value: string) => !!value || 'This field is required';
export const email = () =>  (value: string) => /.+@.+\..+/.test(value) || 'Enter a valid email address';
export const length = ({ min, max }: { min?: number, max?: number } = {}) => (value: string) => {
    if (!value) {
        return true;
    }
    if (typeof (min) == 'number') {
        return value.length >= min;
    }
    if (typeof (max) == 'number') {
        return value.length <= max;
    }
    return true;
} 