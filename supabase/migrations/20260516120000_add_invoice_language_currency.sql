-- SnapBill: per-invoice display language and currency

alter table public.invoices
  add column if not exists language text not null default 'vi',
  add column if not exists currency text not null default 'VND';

alter table public.invoices
  drop constraint if exists invoices_language_check;

alter table public.invoices
  add constraint invoices_language_check check (
    language in ('vi', 'en')
  );

alter table public.invoices
  drop constraint if exists invoices_currency_check;

alter table public.invoices
  add constraint invoices_currency_check check (
    currency in ('VND', 'USD', 'EUR', 'GBP')
  );

comment on column public.invoices.language is 'Invoice preview label language: vi | en.';
comment on column public.invoices.currency is 'Display currency: VND | USD | EUR | GBP.';
