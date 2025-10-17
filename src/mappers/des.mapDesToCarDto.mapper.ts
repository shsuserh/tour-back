export function mapDesToCarDto(car) {
  if (!car) return null;
  const { model_name, model, number, cert_num } = car;

  return {
    model: model_name + ' ' + model,
    carNumber: number,
    certNumber: cert_num,
  };
}
