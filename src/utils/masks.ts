/**
 * Utilitários para aplicar máscaras em campos de formulário
 */

/**
 * Remove todos os caracteres não numéricos de uma string
 */
export function removeNonNumeric(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Aplica máscara de CNPJ: 00.000.000/0000-00
 */
export function maskCNPJ(value: string): string {
  const numbers = removeNonNumeric(value);
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
  if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
  if (numbers.length <= 12)
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
}

/**
 * Aplica máscara de CPF: 000.000.000-00
 */
export function maskCPF(value: string): string {
  const numbers = removeNonNumeric(value);
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
}

/**
 * Aplica máscara de CEP: 00000-000
 */
export function maskCEP(value: string): string {
  const numbers = removeNonNumeric(value);
  if (numbers.length <= 5) return numbers;
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
}

/**
 * Aplica máscara de telefone fixo: (00) 0000-0000
 */
export function maskPhone(value: string): string {
  const numbers = removeNonNumeric(value);
  if (numbers.length <= 2) return numbers.length > 0 ? `(${numbers}` : '';
  if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6, 10)}`;
}

/**
 * Aplica máscara de celular: (00) 00000-0000
 */
export function maskCellPhone(value: string): string {
  const numbers = removeNonNumeric(value);
  if (numbers.length <= 2) return numbers.length > 0 ? `(${numbers}` : '';
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
}

/**
 * Aplica máscara de WhatsApp (número sem código do país): (00) 00000-0000
 * Similar ao celular, mas assume que o código do país já foi removido
 */
export function maskWhatsAppNumber(value: string): string {
  return maskCellPhone(value);
}

/**
 * Valida CNPJ (formato e dígitos verificadores)
 */
export function validateCNPJ(cnpj: string): boolean {
  const numbers = removeNonNumeric(cnpj);
  if (numbers.length !== 14) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) return false;

  // Validação dos dígitos verificadores
  let length = numbers.length - 2;
  let numbersOnly = numbers.substring(0, length);
  const digits = numbers.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += Number(numbersOnly.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== Number(digits.charAt(0))) return false;

  length = length + 1;
  numbersOnly = numbers.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += Number(numbersOnly.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== Number(digits.charAt(1))) return false;

  return true;
}

/**
 * Valida CPF (formato e dígitos verificadores)
 */
export function validateCPF(cpf: string): boolean {
  const numbers = removeNonNumeric(cpf);

  if (numbers.length !== 11) return false;
  if (/^(\d)\1+$/.test(numbers)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number(numbers.charAt(i)) * (10 - i);
  }

  let firstDigit = (sum * 10) % 11;
  if (firstDigit === 10) firstDigit = 0;
  if (firstDigit !== Number(numbers.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number(numbers.charAt(i)) * (11 - i);
  }

  let secondDigit = (sum * 10) % 11;
  if (secondDigit === 10) secondDigit = 0;
  if (secondDigit !== Number(numbers.charAt(10))) return false;

  return true;
}

/**
 * Valida CEP (formato)
 */
export function validateCEP(cep: string): boolean {
  const numbers = removeNonNumeric(cep);
  return numbers.length === 8;
}

/**
 * Valida telefone fixo (formato)
 */
export function validatePhone(phone: string): boolean {
  const numbers = removeNonNumeric(phone);
  return numbers.length === 10;
}

/**
 * Valida celular (formato)
 */
export function validateCellPhone(phone: string): boolean {
  const numbers = removeNonNumeric(phone);
  return numbers.length === 11;
}

/**
 * Valida WhatsApp número (formato brasileiro: 11 dígitos)
 */
export function validateWhatsAppNumber(whatsapp: string): boolean {
  const numbers = removeNonNumeric(whatsapp);
  return numbers.length === 11;
}

/**
 * Máscara CPF/CNPJ: CPF até 11 dígitos; a partir do 12º assume CNPJ.
 */
export function maskCpfCnpj(value: string): string {
  const numbers = removeNonNumeric(value).slice(0, 14);
  return numbers.length > 11 ? maskCNPJ(numbers) : maskCPF(numbers);
}

export function validateCpfCnpj(value: string): boolean {
  const numbers = removeNonNumeric(value);
  if (numbers.length === 11) {
    return validateCPF(numbers);
  }
  if (numbers.length === 14) {
    return validateCNPJ(numbers);
  }
  return false;
}

/**
 * Máscara de cartão: 0000 0000 0000 0000 (até 19 dígitos)
 */
export function maskCardNumber(value: string): string {
  const numbers = removeNonNumeric(value).slice(0, 19);
  return numbers.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

/**
 * Máscara de validade: MM/AAAA
 */
export function maskCardExpiry(value: string): string {
  const numbers = removeNonNumeric(value).slice(0, 6);
  if (numbers.length <= 2) {
    return numbers;
  }
  return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
}

/**
 * Máscara de CVV: 3 ou 4 dígitos
 */
export function maskCardCvv(value: string): string {
  return removeNonNumeric(value).slice(0, 4);
}

export function validateCardNumber(value: string): boolean {
  const numbers = removeNonNumeric(value);
  if (numbers.length < 13 || numbers.length > 19) {
    return false;
  }

  let sum = 0;
  let shouldDouble = false;
  for (let i = numbers.length - 1; i >= 0; i--) {
    let digit = Number(numbers.charAt(i));
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

export function validateCardExpiry(value: string): boolean {
  const numbers = removeNonNumeric(value);
  if (numbers.length !== 6) {
    return false;
  }

  const month = Number(numbers.slice(0, 2));
  const year = Number(numbers.slice(2, 6));
  if (month < 1 || month > 12) {
    return false;
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) {
    return false;
  }
  if (year === currentYear && month < currentMonth) {
    return false;
  }

  return true;
}

export function validateCardCvv(value: string): boolean {
  const numbers = removeNonNumeric(value);
  return numbers.length === 3 || numbers.length === 4;
}

export function validateCardHolderName(value: string): boolean {
  const normalized = value.trim().replace(/\s+/g, ' ');
  if (normalized.length < 3 || normalized.length > 120) {
    return false;
  }
  return /^[A-Za-zÀ-ÿ' -]+$/.test(normalized);
}

