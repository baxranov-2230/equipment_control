import * as yup from 'yup';

export const createRequestSchema = yup.object().shape({
    inventory_id: yup.string().required('Jihozni tanlang').uuid('Yaroqli ID kiriting'),
    description: yup.string().required('Muammo tavsifini kiriting').min(10, 'Kamida 10 ta belgi'),
    priority: yup.string().oneOf(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('LOW').required('Muhimlik darajasini tanlang'),
});

export type CreateRequestInputs = yup.InferType<typeof createRequestSchema>;
