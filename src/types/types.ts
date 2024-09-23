export interface Comprobantes {
  comprobantes: Comprobante[];
  emailToSend: string;
}
export interface Comprobante {
  operacion: string;
  beneficiario: string;
  institucion: string;
  cuenta: string;
  referencia: string;
  concepto: string;
  clave: string;
  nota: string;
  fecha: Date;
  hora: Date;
  amount: string;
  company: string;
  nombreEmpresa: string;
  registroEmpresa: string;
  direccionEmpresa: string;
  cargo?: string;
  abono?: string;
  saldo?: string;
}
