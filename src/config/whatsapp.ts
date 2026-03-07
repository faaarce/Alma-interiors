/* ───────── WhatsApp Config (single source of truth) ───────── */

const WA_NUMBER = "6281717726000";
const WA_MESSAGE =
  "Halo Alma Interior, saya mau konsultasi interior. Mohon info ya, terima kasih";

export const WHATSAPP_URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;