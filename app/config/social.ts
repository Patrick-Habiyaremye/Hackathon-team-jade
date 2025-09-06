export const emailAddress = 'ndamukundavainqueur@gmail.com'
export const phoneNumber = '0784702015'

// Use international format for WhatsApp without leading + or zeros if applicable.
// Rwanda country code: 250 → 250784702015
export const whatsappNumber = ''
export const whatsappDefaultMessage = 'Hello! I came from Diaspora Bridge.'

// Social usernames or direct profile paths
export const facebookUsername = '' // for Messenger DM: m.me/<username>
export const instagramUsername = '' // for IG DM: ig.me/m/<username>
export const xProfileUrl = ''
export const telegramUsername = ''

export const linkedinProfileUrl = ''
export const locationText = ''

export function buildWhatsappLink() {
  if (!whatsappNumber) return ''
  const base = `https://wa.me/${whatsappNumber}`
  const text = encodeURIComponent(whatsappDefaultMessage)
  return `${base}?text=${text}`
}

export function buildMessengerLink() {
  return facebookUsername ? `https://m.me/${facebookUsername}` : ''
}

export function buildInstagramDmLink() {
  return instagramUsername ? `https://ig.me/m/${instagramUsername}` : ''
}

export function buildTelegramLink() {
  return telegramUsername ? `https://t.me/${telegramUsername}` : ''
}

export function buildXLink() {
  return xProfileUrl || ''
}

