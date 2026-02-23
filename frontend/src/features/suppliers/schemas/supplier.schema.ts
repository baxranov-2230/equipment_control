import * as yup from 'yup';

export const createSupplierSchema = yup.object().shape({
    name: yup.string().required('Firma nomini kiriting').min(2, 'Kamida 2 ta belgi'),
    contact_person: yup.string().nullable().default(null),
    phone: yup.string().nullable().default(null),
    email: yup.string().email('Yaroqli email kiriting').nullable().default(null),
    address: yup.string().nullable().default(null),
    status: yup.string().default('ACTIVE').required(),
});

export type CreateSupplierInputs = yup.InferType<typeof createSupplierSchema>;
