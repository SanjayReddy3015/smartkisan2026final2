import { z } from 'zod';
import { insertFarmerSchema, farmers, farms, insertFarmSchema, marketPrices, priceHistory } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  farmers: {
    list: {
      method: 'GET' as const,
      path: '/api/farmers' as const,
      responses: {
        200: z.array(z.custom<typeof farmers.$inferSelect>()),
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/farmers' as const,
      input: insertFarmerSchema,
      responses: {
        201: z.custom<typeof farmers.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
  },
  farms: {
    list: {
      method: 'GET' as const,
      path: '/api/farms' as const,
      responses: {
        200: z.array(z.custom<typeof farms.$inferSelect>()),
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/farms' as const,
      input: insertFarmSchema,
      responses: {
        201: z.custom<typeof farms.$inferSelect>(),
        400: errorSchemas.validation,
      }
    }
  },
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products' as const,
      responses: {
        200: z.array(z.custom<any>()),
      }
    }
  },
  news: {
    list: {
      method: 'GET' as const,
      path: '/api/news' as const,
      responses: {
        200: z.array(z.custom<any>()),
      }
    }
  },
  marketPrices: {
    list: {
      method: 'GET' as const,
      path: '/api/market-prices' as const,
      responses: {
        200: z.array(z.custom<typeof marketPrices.$inferSelect>()),
      }
    },
    refresh: {
      method: 'POST' as const,
      path: '/api/market-prices/refresh' as const,
      responses: {
        200: z.object({ count: z.number(), message: z.string(), source: z.string() }),
        500: errorSchemas.internal,
      }
    }
  },
  priceHistory: {
    byCrop: {
      method: 'GET' as const,
      path: '/api/price-history' as const,
      responses: {
        200: z.array(z.custom<typeof priceHistory.$inferSelect>()),
      }
    }
  },
  weather: {
    get: {
      method: 'GET' as const,
      path: '/api/weather' as const,
      input: z.object({ lat: z.string().optional(), lng: z.string().optional() }).optional(),
      responses: {
        200: z.object({ temp: z.number(), condition: z.string(), humidity: z.number(), location: z.string() }),
      }
    }
  },
  ai: {
    chat: {
      method: 'POST' as const,
      path: '/api/ai/chat' as const,
      input: z.object({ message: z.string(), language: z.string().default('en') }),
      responses: {
        200: z.object({ reply: z.string() }),
        500: errorSchemas.internal,
      }
    },
    irrigationCalc: {
      method: 'POST' as const,
      path: '/api/ai/irrigation' as const,
      input: z.object({ cropType: z.string(), soilType: z.string(), temperature: z.number() }),
      responses: {
        200: z.object({ recommendation: z.string(), waterLitersPerAcre: z.coerce.number() })
      }
    },
    fertilizerCalc: {
      method: 'POST' as const,
      path: '/api/ai/fertilizer' as const,
      input: z.object({ cropType: z.string(), soilType: z.string(), stage: z.string() }),
      responses: {
        200: z.object({ recommendation: z.string() })
      }
    },
    yieldCalc: {
      method: 'POST' as const,
      path: '/api/ai/yield' as const,
      input: z.object({ cropType: z.string(), acres: z.number(), expectedPrice: z.number() }),
      responses: {
        200: z.object({ estimatedYieldQuintals: z.coerce.number(), estimatedProfit: z.coerce.number() })
      }
    }
  },
  admin: {
    verifyOtp: {
      method: 'POST' as const,
      path: '/api/admin/verify-otp' as const,
      input: z.object({ phone: z.string(), otp: z.string() }),
      responses: {
        200: z.object({ success: z.boolean(), token: z.string().optional() }),
        400: errorSchemas.validation,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
