-- Run this in Supabase SQL Editor after the initial schema.sql

alter table guides
  drop column if exists content,
  add column if not exists wifi_name            text,
  add column if not exists wifi_password        text,
  add column if not exists checkin_instructions text,
  add column if not exists checkout_checklist   text,
  add column if not exists parking_instructions text,
  add column if not exists trash_instructions   text,
  add column if not exists emergency_contact    text;
