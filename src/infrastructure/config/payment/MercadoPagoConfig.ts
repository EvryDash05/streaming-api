import { MercadoPagoConfig, Preference } from "mercadopago";

console.log('MP_ACCESS_TOKEN:', process.env.MP_ACCESS_TOKEN);
console.log('MP_PUBLIC_KEY:', process.env.MP_PUBLIC_KEY);

export const mpClient = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || '',
});

export const preferenceClient = new Preference(mpClient);