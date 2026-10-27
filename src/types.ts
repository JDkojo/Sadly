export interface Product {
  id: string;
  name: string;
  category: 'provisions' | 'breakfast' | 'canned' | 'toiletries' | 'beverages' | 'cleaning';
  price: number;
  originalPrice?: number;
  unit: string;
  unitPrice?: string;
  images: string[];
  badges: { text: string; variant: 'primary' | 'secondary' | 'accent' | 'neutral' }[];
  rating: number;
  reviewCount: number;
  description: string;
  packageDetails?: string;
  inStock: boolean;
  sku?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'unpaid' | 'paid' | 'packing' | 'ready' | 'collected';

export interface OrderState {
  orderId: string;
  customerName: string;
  customerPhone: string;
  placedTime: string;
  paidTime?: string;
  collectedTime?: string;
  status: OrderStatus;
  paymentMethod: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export type ScanResultType = 'ready' | 'packing' | 'unpaid' | 'collected' | 'not_found';

export interface ScanResult {
  type: ScanResultType;
  title: string;
  subtitle: string;
  order?: OrderState;
}
