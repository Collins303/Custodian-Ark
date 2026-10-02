import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AccountDashboard } from '@/components/account-dashboard';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect('/login');
  }

  const [{ data: profile }, { data: orders, error: ordersError }] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, phone, created_at')
      .eq('id', userData.user.id)
      .maybeSingle(),
    supabase
      .from('orders')
      .select('id, order_number, status, payment_status, total, currency, created_at')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  const metadata = userData.user.user_metadata ?? {};
  const metadataName = typeof metadata.full_name === 'string'
    ? metadata.full_name
    : typeof metadata.name === 'string'
      ? metadata.name
      : '';

  return (
    <>
      <SiteHeader />
      <AccountDashboard
        email={userData.user.email ?? ''}
        fullName={profile?.full_name?.trim() || metadataName || userData.user.email?.split('@')[0] || 'Customer'}
        phone={profile?.phone ?? null}
        memberSince={profile?.created_at ?? userData.user.created_at}
        orders={(orders ?? []).map((order) => ({
          id: order.id,
          orderNumber: order.order_number,
          status: order.status,
          paymentStatus: order.payment_status,
          total: Number(order.total),
          currency: order.currency,
          createdAt: order.created_at,
        }))}
        ordersError={ordersError ? 'Recent orders are temporarily unavailable.' : null}
      />
      <SiteFooter />
    </>
  );
}
