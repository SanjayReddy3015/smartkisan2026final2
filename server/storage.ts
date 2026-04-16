import {
  type Farmer, type InsertFarmer,
  type Farm, type InsertFarm,
  type MarketPrice, type InsertMarketPrice,
  type PriceHistory, type InsertPriceHistory,
  type Product, type InsertProduct,
} from "@shared/schema";

export interface IStorage {
  getFarmers(): Promise<Farmer[]>;
  createFarmer(farmer: InsertFarmer): Promise<Farmer>;
  getFarms(): Promise<Farm[]>;
  createFarm(farm: InsertFarm): Promise<Farm>;
  getMarketPrices(): Promise<MarketPrice[]>;
  createMarketPrice(price: InsertMarketPrice): Promise<MarketPrice>;
  replaceAllMarketPrices(prices: InsertMarketPrice[]): Promise<void>;
  updateOrInsertMarketPrices(prices: InsertMarketPrice[]): Promise<void>;
  getPriceHistory(crop?: string, state?: string, days?: number): Promise<PriceHistory[]>;
  insertPriceHistory(records: InsertPriceHistory[]): Promise<void>;
  clearOldPriceHistory(keepDays?: number): Promise<void>;
  getProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  clearProducts(): Promise<void>;
}

export class MemStorage implements IStorage {
  private farmers: Map<number, Farmer>;
  private farms: Map<number, Farm>;
  private marketPrices: Map<number, MarketPrice>;
  private priceHistory: Map<number, PriceHistory>;
  private products: Map<number, Product>;

  private currentId: { [key: string]: number };

  constructor() {
    this.farmers = new Map();
    this.farms = new Map();
    this.marketPrices = new Map();
    this.priceHistory = new Map();
    this.products = new Map();
    this.currentId = { farmers: 1, farms: 1, marketPrices: 1, priceHistory: 1, products: 1 };
  }

  async getFarmers(): Promise<Farmer[]> {
    return Array.from(this.farmers.values()).sort((a, b) =>
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async createFarmer(farmer: InsertFarmer): Promise<Farmer> {
    const id = this.currentId.farmers++;
    const newFarmer: Farmer = { ...farmer, id, createdAt: new Date() } as Farmer;
    this.farmers.set(id, newFarmer);
    return newFarmer;
  }

  async getFarms(): Promise<Farm[]> {
    return Array.from(this.farms.values());
  }

  async createFarm(farm: InsertFarm): Promise<Farm> {
    const id = this.currentId.farms++;
    const newFarm: Farm = { ...farm, id, sizeAcres: farm.sizeAcres.toString() };
    this.farms.set(id, newFarm);
    return newFarm;
  }

  async getMarketPrices(): Promise<MarketPrice[]> {
    return Array.from(this.marketPrices.values())
      .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0))
      .slice(0, 500);
  }

  async createMarketPrice(price: InsertMarketPrice): Promise<MarketPrice> {
    const id = this.currentId.marketPrices++;
    const newPrice: MarketPrice = { ...price, id, date: price.date || new Date() } as MarketPrice;
    this.marketPrices.set(id, newPrice);
    return newPrice;
  }

  async replaceAllMarketPrices(prices: InsertMarketPrice[]): Promise<void> {
    this.marketPrices.clear();
    for (const p of prices) {
      await this.createMarketPrice(p);
    }
  }

  async updateOrInsertMarketPrices(prices: InsertMarketPrice[]): Promise<void> {
    for (const p of prices) {
      // Find existing
      let foundKey = -1;
      for (const [k, v] of this.marketPrices.entries()) {
        if (v.state === p.state && v.crop === p.crop) {
          foundKey = k; break;
        }
      }
      if (foundKey !== -1) {
        this.marketPrices.set(foundKey, { ...this.marketPrices.get(foundKey)!, ...p } as MarketPrice);
      } else {
        await this.createMarketPrice(p);
      }
    }
  }

  async getPriceHistory(crop?: string, state?: string, days = 60): Promise<PriceHistory[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return Array.from(this.priceHistory.values())
      .filter(p => {
        const recordDate = new Date(p.recordDate);
        if (recordDate < cutoff) return false;
        if (crop && p.crop !== crop) return false;
        if (state && p.state !== state) return false;
        return true;
      })
      .sort((a, b) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime());
  }

  async insertPriceHistory(records: InsertPriceHistory[]): Promise<void> {
    for (const record of records) {
      const id = this.currentId.priceHistory++;
      this.priceHistory.set(id, { ...record, id } as PriceHistory);
    }
  }

  async clearOldPriceHistory(keepDays = 65): Promise<void> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - keepDays);
    for (const [id, record] of this.priceHistory.entries()) {
      if (new Date(record.recordDate) < cutoff) {
        this.priceHistory.delete(id);
      }
    }
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentId.products++;
    const newProd: Product = { ...product, id } as Product;
    this.products.set(id, newProd);
    return newProd;
  }

  async clearProducts(): Promise<void> {
    this.products.clear();
  }
}

export const storage = new MemStorage();
