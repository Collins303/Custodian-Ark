# Database strategy

The production system should use Supabase PostgreSQL with UUID primary keys, indexing and explicit constraints. Recommended tables include:

- profiles
- products
- product_variants
- product_images
- categories
- product_categories
- product_specifications
- product_attributes
- brands
- carts
- cart_items
- wishlists
- wishlist_items
- addresses
- orders
- order_items
- payments
- payment_events
- inventory
- inventory_transactions
- coupons
- coupon_usage
- reviews
- quote_requests
- quote_items
- installation_requests
- service_requests
- wholesale_inquiries
- contact_messages
- newsletter_subscribers
- notifications
- admin_users
- audit_logs
- blog_posts
- blog_categories
- solar_calculator_submissions
- store_settings
- shipping_zones
- shipping_rates
- delivery_methods

## Security rules

- Enforce row-level security for customer data.
- Keep admin authorization server-side.
- Ensure inventory and pricing checks run on the backend.
- Add audit logging for status changes, refunds and admin edits.
