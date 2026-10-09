export const formatPrice = (price: number, transactionType: 'sale' | 'rent' = 'sale'): string => {
  const formatted = new Intl.NumberFormat('fr-DZ', {
    maximumFractionDigits: 0
  }).format(price);

  if (transactionType === 'rent') {
    return `${formatted} DZD / mois`;
  }
  return `${formatted} DZD`;
};

export const formatPropertyType = (type: string): string => {
  switch (type) {
    case 'appartement':
      return 'Appartement';
    case 'villa':
      return 'Villa';
    case 'studio':
      return 'Studio';
    case 'duplex':
      return 'Duplex';
    case 'penthouse':
      return 'Penthouse';
    case 'terrain':
      return 'Terrain';
    case 'local':
      return 'Local commercial';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

export const generateWhatsAppLink = (phone: string, propertyTitle: string, propertyId: string): string => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const message = encodeURIComponent(
    `Bonjour Mastin immobilier,\n\nJe suis intéressé(e) par l'annonce :\n"${propertyTitle}" (Réf: ${propertyId}).\n\nPourrions-nous convenir d'un rendez-vous ou d'une visite ? Merci d'avance !`
  );
  return `https://wa.me/${cleanPhone}?text=${message}`;
};
