import * as yup from 'yup';

export const createEmployeeSchema = yup.object().shape({
    full_name: yup.string().required('F.I.SH kiriting').min(2, 'Kamida 2 ta belgi'),
    username: yup.string().required('Login kiriting').min(3, 'Kamida 3 ta belgi'),
    password: yup.string().required('Parol kiriting').min(6, 'Kamida 6 ta belgi'),
    department: yup.string().required('Bo\'limni kiriting'),
    position: yup.string().required('Lavozimni kiriting'),
    phone: yup.string().nullable().default(null),
    status: yup.string().default('ACTIVE').required(),
});

export type CreateEmployeeInputs = yup.InferType<typeof createEmployeeSchema>;
