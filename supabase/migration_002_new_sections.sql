-- Run this in Supabase SQL Editor

alter table guides
  add column if not exists tv_entertainment text,
  add column if not exists laundry          text,
  add column if not exists amenities        text;
