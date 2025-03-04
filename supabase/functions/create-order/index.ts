
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.9.0";

// كونفيغيرشن CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// معالجة الـ CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
};

// نوع البيانات المرسلة في الطلب
interface CreateOrderRequest {
  order: {
    store_id: string;
    order_number: string;
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    shipping_address: string;
    payment_method: string;
    status: string;
    total: number;
    notes?: string;
  };
  items: {
    product_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[];
}

serve(async (req: Request) => {
  // معالجة الـ CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  
  try {
    // فقط نقبل طلبات POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }), 
        { 
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // إنشاء عميل Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
        auth: {
          persistSession: false,
        },
      }
    );
    
    // استخراج البيانات من الطلب
    const { order, items }: CreateOrderRequest = await req.json();
    
    // 1. إنشاء الطلب
    const { data: orderData, error: orderError } = await supabaseClient
      .from('orders')
      .insert([order])
      .select()
      .single();
    
    if (orderError) {
      console.error('Error creating order:', orderError);
      return new Response(
        JSON.stringify({ error: 'Failed to create order', details: orderError }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // 2. إضافة عناصر الطلب
    const orderItems = items.map(item => ({
      ...item,
      order_id: orderData.id
    }));
    
    const { error: itemsError } = await supabaseClient
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) {
      console.error('Error adding order items:', itemsError);
      // في حالة حدوث خطأ، نقوم بحذف الطلب المنشأ سابقًا
      await supabaseClient.from('orders').delete().eq('id', orderData.id);
      
      return new Response(
        JSON.stringify({ error: 'Failed to add order items', details: itemsError }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // 3. جلب تفاصيل الطلب مع العناصر
    const { data: completeOrder, error: fetchError } = await supabaseClient
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(name)
        )
      `)
      .eq('id', orderData.id)
      .single();
    
    if (fetchError) {
      console.error('Error fetching complete order:', fetchError);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Order created successfully but failed to fetch complete details',
          order: orderData
        }), 
        { 
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // تنسيق تفاصيل الطلب
    const formattedOrder = {
      ...completeOrder,
      items: completeOrder.items.map((item: any) => ({
        ...item,
        product_name: item.product?.name
      }))
    };
    
    // استجابة ناجحة
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Order created successfully',
        order: formattedOrder
      }), 
      { 
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
