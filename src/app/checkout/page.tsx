import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { CheckoutForm } from '@/components/checkout-form';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function CheckoutPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <SiteHeader />
      <CheckoutForm userEmail={user?.email ?? null} />
      <SiteFooter />
    </>
  );
}
