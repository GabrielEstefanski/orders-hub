import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';

const formatDateGrouped = (dateString: string, groupByDate: string) => { 
  const formattedDate = format(new Date(dateString), groupByDate, { locale: ptBR });
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};

export default formatDateGrouped;
