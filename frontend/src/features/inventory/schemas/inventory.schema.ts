import * as yup from 'yup';

export const createInventorySchema = yup.object().shape({
    name: yup.string().required('Jihoz nomini kiriting').min(2, 'Kamida 2 ta belgi'),
    category: yup.string().required('Kategoriyani tanlang'),
    serial_number: yup.string().required('Seriya raqami majburiy'),
    quantity: yup.number().required('Miqdorini kiriting').min(1, 'Kamida 1 ta bo\'lishi kerak'),
    purchase_date: yup.string().required('Xarid sanasini kiriting'),
    price: yup.number().nullable().transform((v, o) => (o === '' ? null : v)),
    status: yup.string().default('ACTIVE'),
    notes: yup.string().nullable(),
});

export type CreateInventoryInputs = yup.InferType<typeof createInventorySchema>;
