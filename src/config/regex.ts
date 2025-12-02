export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const NAME_REGEX  = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;
export const NAME_USER_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/;
export const RFC_REGEX   = /^([A-ZÑ&]{3,4})(\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([A-Z0-9]{3})$/i;
export const PRODUCT_NAME_REGEX = /^(?! )(?!.* $)(?!.* {2})[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]{3,150}$/;;