import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';

// ===== ENVIRONMENT =====
// Use sandbox URL if TCG_SANDBOX_MODE=true, otherwise production
const TCG_API_BASE = 'https://api.shiplogic.com';

const tcgClient = (): AxiosInstance =>
  axios.create({
    baseURL: TCG_API_BASE,
    headers: {
      Authorization: `Bearer ${process.env.TCG_API_KEY}`,
      'Content-Type': 'application/json',
    },
    timeout: 30_000,
  });

function requireApiKey() {
  if (!process.env.TCG_API_KEY) throw new Error('TCG_API_KEY is not configured');
}

export interface TcgShipmentResult {
  trackingNumber?: string;
  labelUrl?: string;
  waybillNumber?: string;
  raw?: unknown;
}

export interface TcgShipmentOrder {
  id: string;
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

export interface TcgShipmentAddress {
  name?: string;
  street: string;
  city: string;
  postalCode: string;
  country?: string;
  phone?: string;
  email?: string;
}

export interface TcgShipmentItem {
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
  dimensions?: { length: number; width: number; height: number };
}

export async function createTCGShipment(
  order: TcgShipmentOrder,
  address: TcgShipmentAddress,
  items: TcgShipmentItem[]
): Promise<TcgShipmentResult> {
  requireApiKey();
  const client = tcgClient();

  // ===== Build the payload according to Shiplogic API specs =====
  const payload = {
    // Optional reference for your own tracking
    customer_reference: order.id,
    customer_reference_name: 'Order no.',

    // ----- Collection (pickup) address -----
    collection_address: {
      type: 'business',                           // or 'residential'
      company: 'VerdeAfrique Botanicals',
      street_address: '90 Ruth Street',
      local_area: 'Johannesburg',                 // suburb/area
      city: 'Johannesburg',
      zone: 'Gauteng',                            // province/state
      country: 'ZA',                              // ISO code, not full name
      code: '1709',                               // postal code
    },
    collection_contact: {
      name: 'VerdeAfrique Warehouse',
      mobile_number: '+27678667662',
      email: 'thinkgreenintl@gmail.com',
    },

    // ----- Delivery (destination) address -----
    delivery_address: {
      type: 'residential',                        // or 'business'
      street_address: address.street,
      city: address.city,
      zone: 'Gauteng',                            // you can make this dynamic or hardcode
      country: 'ZA',                              // always ISO
      code: address.postalCode,
    },
    delivery_contact: {
      name: address.name || order.user?.name || 'Customer',
      mobile_number: address.phone || '',
      email: address.email || order.user?.email || '',
    },

    // ----- Service level (required) -----
    service_level_code: 'ECO',                    // ECO, STANDARD, EXPRESS (choose one)

    // ----- Parcels (items) -----
    parcels: items.map((it) => ({
      parcel_description: it.description || it.product?.name || 'Item',
      submitted_length_cm: it.dimensions?.length || 20,
      submitted_width_cm: it.dimensions?.width || 20,
      submitted_height_cm: it.dimensions?.height || 10,
      submitted_weight_kg: it.weight || (it.product?.weight ?? 0) || 1,
      // Optional: alternative_tracking_reference: it.sku || undefined,
    })),

    // Optional extras
    // mute_notifications: false,
    // declared_value: items.reduce((sum, it) => sum + (it.value || it.price || 0), 0),
  };

  // Log the payload for debugging (remove in production)
  console.log('📦 Payload sent to TCG:', JSON.stringify(payload, null, 2));

  try {
    console.log('📦 TCG REQUEST URL:', `${TCG_API_BASE}/shipments`);
    const resp = await client.post('/shipments', payload);
    console.log('📦 TCG RESPONSE:', JSON.stringify(resp.data, null, 2));
    // Parse response – field names may vary; adjust as needed
    return {
      ...(resp.data?.tracking_number || resp.data?.tracking_reference || resp.data?.id
        ? {
            trackingNumber: String(
              resp.data.tracking_number || resp.data.tracking_reference || resp.data.id
            ),
          }
        : {}),
      ...(resp.data?.label_url || resp.data?.label?.url
        ? { labelUrl: resp.data.label_url || resp.data.label.url }
        : {}),
      ...(resp.data?.waybill_number || resp.data?.waybill || resp.data?.id
        ? {
            waybillNumber: String(resp.data.waybill_number || resp.data.waybill || resp.data.id),
          }
        : {}),
      raw: resp.data,
    };
  } catch (err: unknown) {
    // Enhanced error logging
    if (axios.isAxiosError(err)) {
      console.error('❌ TCG API error status:', err.response?.status);
      console.error('❌ TCG API error data:', JSON.stringify(err.response?.data, null, 2));
    }
    const message = axios.isAxiosError(err)
      ? err.response?.data || err.message
      : err instanceof Error
        ? err.message
        : err;
    throw new Error(`TCG create shipment error: ${JSON.stringify(message)}`);
  }
}

export async function trackTCGShipment(trackingNumber: string) {
  requireApiKey();
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

export function verifyWebhookSignature(payload: Buffer, signature: string, secret: string): boolean {
  const expected = crypto.createHmac('sha256', secret).update(payload).digest();
  const normalizedSignature = signature.replace(/^sha256=/i, '');
  const provided = Buffer.from(normalizedSignature, /^[0-9a-f]+$/i.test(normalizedSignature) ? 'hex' : 'base64');
  return provided.length === expected.length && crypto.timingSafeEqual(expected, provided);
}