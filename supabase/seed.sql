-- SEED FILE: Initial Produce Catalog
-- Run this in your Supabase SQL Editor after the migration schema

INSERT INTO public.produce_catalog (name, category, unit_type, aliases, handling_guidance) VALUES
('Tomatoes (Hybrid)', 'Vegetables', 'kg', ARRAY['Tamatar', 'Solanum lycopersicum'], 'Store at 12-15°C. Avoid direct sunlight and excessive stacking.'),
('Tomatoes (Desi)', 'Vegetables', 'kg', ARRAY['Country Tomatoes', 'Desi Tamatar'], 'Perishable, prioritize rapid transit within 24-48 hours.'),
('Potatoes (Jyoti)', 'Vegetables', 'kg', ARRAY['Aloo', 'Kufri Jyoti'], 'Keep in dry, dark, well-ventilated space. Prevent sprouting.'),
('Red Onions (Nashik)', 'Vegetables', 'kg', ARRAY['Pyaz', 'Kanda'], 'Requires low humidity and continuous air flow.'),
('Green Chillies (G4)', 'Vegetables', 'kg', ARRAY['Hari Mirch', 'Pusa Jwala'], 'Store at 7-10°C in breathable perforated crates.'),
('Cauliflower', 'Vegetables', 'kg', ARRAY['Phool Gobhi'], 'Keep wrapped in original leaves to prevent browning.'),
('Cabbage', 'Vegetables', 'kg', ARRAY['Patta Gobhi'], 'Tolerates cooler temperatures (0-4°C).'),
('Spinach (Palak)', 'Vegetables', 'kg', ARRAY['Palak', 'Greens'], 'Highly perishable. Requires chilled transit or same-day delivery.'),
('Capsicum (Green)', 'Vegetables', 'kg', ARRAY['Shimla Mirch', 'Bell Pepper'], 'Sensitive to moisture condensation; handle with care.'),

-- Fruits
('Mangoes (Alphonso)', 'Fruits', 'kg', ARRAY['Hapus', 'Ratnagiri Alphonso'], 'Handle with cushioning. Ripens best at 22-25°C.'),
('Mangoes (Kesar)', 'Fruits', 'kg', ARRAY['Gir Kesar'], 'Sweet aromatic variety, store with adequate ventilation.'),
('Bananas (Robusta)', 'Fruits', 'kg', ARRAY['Kela', 'Cavendish'], 'Never refrigerate below 13°C. Sensitive to chilling injury.'),
('Pomegranates (Bhagwa)', 'Fruits', 'kg', ARRAY['Anar'], 'Longer shelf life if skins remain intact and dry.'),
('Papaya (Red Lady)', 'Fruits', 'kg', ARRAY['Papita'], 'Fragile skin; harvest at color break stage.'),

-- Grains
('Wheat (Sharbati)', 'Grains', 'quintal', ARRAY['Gehun', 'Golden Wheat'], 'Dry thoroughly below 10% moisture before bagging.'),
('Basmati Rice (1121)', 'Grains', 'quintal', ARRAY['Chawal', 'Aromatic Rice'], 'Store in pest-resistant airtight gunny or HDPE bags.'),
('Maize / Corn', 'Grains', 'quintal', ARRAY['Makka'], 'Ensure low moisture to prevent fungal growth.'),

-- Pulses
('Toor Dal (Pigeon Pea)', 'Pulses', 'quintal', ARRAY['Arhar', 'Tuvar'], 'Keep dry in ventilated warehouse pallets.'),
('Chana (Bengal Gram)', 'Pulses', 'quintal', ARRAY['Desi Chana', 'Chickpeas'], 'Maintain fumigated clean storage.'),
('Moong (Green Gram)', 'Pulses', 'quintal', ARRAY['Moong Dal', 'Whole Moong'], 'Keep protected from beetles and moisture.'),

-- Seasonal Produce
('Pumpkin (Kaddu)', 'Seasonal Produce', 'kg', ARRAY['Kaddu', 'Kohra'], 'Tough rind permits ambient storage for weeks.'),
('Watermelon (Sugar Baby)', 'Seasonal Produce', 'kg', ARRAY['Tarbooj'], 'Protect from bruising during transit.'),
('Bottle Gourd (Lauki)', 'Seasonal Produce', 'kg', ARRAY['Ghiya', 'Lauki'], 'Prone to surface scratching; handle in cushioned crates.'),

-- Other Produce
('Ginger (Fresh)', 'Other Produce', 'kg', ARRAY['Adrak'], 'Clean soil gently; store in cool humid area.'),
('Garlic (Desi)', 'Other Produce', 'kg', ARRAY['Lahsun'], 'Air dry cured bulbs; avoid moist plastic covers.'),
('Turmeric (Raw)', 'Other Produce', 'kg', ARRAY['Kacchi Haldi'], 'Wash and sort before storage.')
ON CONFLICT DO NOTHING;

