export const emailAddress = 'ndamukundavainqueur@gmail.com'

// Use international format for WhatsApp without leading + or zeros if applicable.
// Rwanda country code: 250 → 250784702015
export const whatsappNumber = '250784702015'
export const whatsappDefaultMessage = 'Hello! I came from Diaspora Bridge.'

// Social usernames or direct profile paths
export const facebookProfileUrl = 'https://www.facebook.com/ndamukunda.vanqueur'
export const instagramProfileUrl = 'https://www.instagram.com/rumanzi_boi/'
export const xProfileUrl = 'https://x.com/Ndamukunda37603'
export const telegramUsername = ''

export const linkedinProfileUrl = ''
export const locationText = 'Rwamagana, Gishali, Eastern Province'

export function buildWhatsappLink() {
  if (!whatsappNumber) return ''
  const base = `https://wa.me/${whatsappNumber}`
  const text = encodeURIComponent(whatsappDefaultMessage)
  return `${base}?text=${text}`
}

export function buildMessengerLink() {
  // If you later want to use Messenger username, switch to m.me/<username>
  return facebookProfileUrl || ''
}

export function buildInstagramDmLink() {
  // IG DM links require username; profile link is provided instead
  return instagramProfileUrl || ''
}

export function buildTelegramLink() {
  return telegramUsername ? `https://t.me/${telegramUsername}` : ''
}

export function buildXLink() {
  return xProfileUrl || ''
}

