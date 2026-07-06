import axios, { AxiosInstance } from 'axios';

const TCG_API_BASE = process.env.TCG_SANDBOX_MODE === 'true'
  ? 'https://api.shiplogic.com'
  : 'https://api.shiplogic.com';

const tcgClient = (): AxiosInstance =>
  axios.create({
    baseURL: TCG_API_BASE,
    headers: {
      Authorization: `Bearer ${process.env.TCG_API_KEY}`,
      'Content-Type': 'application/json',
    },
    timeout: 20_000,
  });

export interface TcgShipmentResult {
  trackingNumber?: string;
  labelUrl?: string;
  waybillNumber?: string;
  raw?: unknown;
}

interface TcgShipmentOrder {
  id: string;
  user?: {
    name?: string | null;
  };
}

interface TcgShipmentAddress {
  name?: string;
  street: string;
  city: string;
  postalCode: string;
  country?: string;
  phone?: string;
}

interface TcgShipmentItem {
  description?: string;
  quantity?: number;
  weight?: number;
  value?: number;
  price?: number;
  sku?: string;
  product?: {
    name?: string;
    weight?: number;
    sku?: string;
  };
}

export async function createTCGShipment(order: TcgShipmentOrder, address: TcgShipmentAddress, items: TcgShipmentItem[]): Promise<TcgShipmentResult> {
  const client = tcgClient();

  // Map items into a simple parcels/items list. Adjust per Shiplogic docs as needed.
  const payload = {
    reference: order.id,
    to: {
      name: address.name || `${order.user?.name || ''}`,
      street: address.street,
      city: address.city,
      postal_code: address.postalCode,
      country: address.country || 'South Africa',
      phone: address.phone,
    },
    items: items.map((it) => ({
      description: it.description || it.product?.name || 'Item',
      quantity: it.quantity || 1,
      weight: it.weight || (it.product?.weight ?? 0) || 0,
      value: it.value || it.price || 0,
      sku: it.sku || it.product?.sku || undefined,
    })),
    // You may need to include service_code, account, sender, etc. Add per account docs.
  };

  try {
    const resp = await client.post('/shipments', payload);

    return {
      trackingNumber: resp.data?.tracking_number || resp.data?.tracking_reference || resp.data?.id,
      labelUrl: resp.data?.label_url || resp.data?.label?.url,
      waybillNumber: resp.data?.waybill_number,
      raw: resp.data,
    };
  } catch (err: unknown) {
    const message = axios.isAxiosError(err)
      ? err.response?.data || err.message
      : err instanceof Error
      ? err.message
      : err;
    throw new Error(`TCG create shipment error: ${JSON.stringify(message)}`);
  }
}

export async function trackTCGShipment(trackingNumber: string) {
  const client = tcgClient();

  try {
    const resp = await client.get(`/shipments?tracking_reference=${encodeURIComponent(trackingNumber)}`);
    return resp.data;
  } catch (err: unknown) {
    const message = axios.isAxiosError(err)
      ? err.response?.data || err.message
      : err instanceof Error
      ? err.message
      : err;
    throw new Error(`TCG track shipment error: ${JSON.stringify(message)}`);
  }
}
