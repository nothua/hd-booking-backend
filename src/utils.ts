import { IPromo } from "./models/Promo";

export const TAX_RATE = 0.05;

export function calculateDiscount(promo: IPromo, subtotal: number): number {
    let discountAmount = 0;

    if (promo.discountType === 'percentage') {
        discountAmount = subtotal * (promo.discountValue / 100);
    } else if (promo.discountType === 'fixed') {
        discountAmount = promo.discountValue;
    }

    const clampedDiscount = Math.min(discountAmount, subtotal);
    
    return parseFloat(clampedDiscount.toFixed(2));
}

export function calculatePricing(subtotal: number, promo: IPromo | null) {
    let discount = 0;
    if (promo) {
        discount = calculateDiscount(promo, subtotal);
    }

    const subtotalAfterDiscount = subtotal - discount;
    const taxes = parseFloat((subtotalAfterDiscount * TAX_RATE).toFixed(2));

    const total = parseFloat((subtotalAfterDiscount + taxes).toFixed(2));

    return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        discount: parseFloat(discount.toFixed(2)),
        taxes,
        total,
    };
}
