export const GENERAL_PUBLIC_CLIENT_ID = 'AAB96625-DD29-435B-B762-4BE408979B1D';

export const ROLES_STORAGE = 'roles';

export const RAW_MATERIAL_STORAGE = 'rawMaterials';

export const UNITS_STORAGE = 'units';

export const GENERIC_GREETINGS: string[] = [
  "¡Hola, qué gusto verte,",
  "Te damos la bienvenida,",
  "Es un placer saludarte,",
  "Qué alegría que estés aquí,",
  "¡Hola! Te damos la bienvenida,",
  "Buen día,",
  "Qué bueno volver a verte,",
  "¡Hola! Un gusto saludarte,",
  "Todo listo para comenzar,",
  "Te estábamos esperando,",
  "¡Hola! Qué bien que nos acompañas,",
  "Feliz jornada,",
  "Un gusto recibirte de nuevo,",
  "¡Hola! Es un gusto saludarte,",
  "Te damos la bienvenida a tu panel,"
];

export const getRandomInt = (min: number, max: number): number => {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);
  return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
};