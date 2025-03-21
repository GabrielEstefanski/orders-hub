const normalizeDate = (dateString: string) => {
    if (!dateString) return "Data Inválida";
  
    const date = new Date(`${dateString}T00:00:00-03:00`);
  
    if (isNaN(date.getTime())) return "Data Inválida";
  
    return date;
  };
  
  export default normalizeDate;
  