const formatDate = (dateString: string) => { 
  if (!dateString) return "Data Inválida";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Data Inválida";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default formatDate;
