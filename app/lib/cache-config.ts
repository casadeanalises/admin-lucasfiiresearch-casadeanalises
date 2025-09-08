export const CACHE_CONFIG = {
  // Tempo de cache em segundos
  DEFAULT_CACHE_TIME: 60 * 5, // 5 minutos
  REPORTS_CACHE_TIME: 60 * 30, // 30 minutos
  DASHBOARD_CACHE_TIME: 60 * 15, // 15 minutos

  // Configurações de paginação
  ITEMS_PER_PAGE: 10,
  MAX_PAGES: 100,

  // Configurações de cache do Redis (se implementado no futuro)
  REDIS_CONFIG: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
  },
};
