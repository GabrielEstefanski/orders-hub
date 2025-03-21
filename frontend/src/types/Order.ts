export default interface Order {
  id: string;
  cliente: string;
  produto: string;
  valor: number;
  status: number;
  dataCriacao: string;
}