import { createClient } from "@supabase/supabase-js";

// REPLACE THESE VARIABLES WITH YOUR ACTUAL SUPABASE URL AND PUBLIC KEY
const SUPABASE_URL = "https://xaaobsxhxyujparluikl.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_2mrdg2h9vX4-kuDJ1neH0A_Yv2o-tso";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
