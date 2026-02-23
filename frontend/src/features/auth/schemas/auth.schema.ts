import * as yup from 'yup';

export const loginSchema = yup.object().shape({
    username: yup
        .string()
        .required('Foydalanuvchi nomini kiriting')
        .min(3, 'Kamida 3 ta belgi kerak'),
    password: yup
        .string()
        .required('Parolni kiriting')
        .min(6, 'Kamida 6 ta belgi kerak'),
});

export type LoginFormInputs = yup.InferType<typeof loginSchema>;
