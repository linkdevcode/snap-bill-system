-- SnapBill: Japanese UI + JPY currency

alter table public.invoices
  drop constraint if exists invoices_language_check;

alter table public.invoices
  add constraint invoices_language_check check (
    language in ('vi', 'en', 'zh', 'ja')
  );

alter table public.invoices
  drop constraint if exists invoices_currency_check;

alter table public.invoices
  add constraint invoices_currency_check check (
    currency in ('VND', 'USD', 'EUR', 'GBP', 'CNY', 'JPY')
  );

comment on column public.invoices.language is 'Invoice preview label language: vi | en | zh | ja.';
comment on column public.invoices.currency is 'Display currency: VND | USD | EUR | GBP | CNY | JPY.';
