// Türkiye İl ve İlçe Verileri
export interface District {
  value: string
  label: string
}

export interface City {
  value: string
  label: string
  districts: District[]
}

export const TURKEY_CITIES: City[] = [
  {
    value: "adana",
    label: "Adana",
    districts: [
      { value: "seyhan", label: "Seyhan" },
      { value: "cukurova", label: "Çukurova" },
      { value: "yuregir", label: "Yüreğir" },
      { value: "saricam", label: "Sarıçam" },
      { value: "kozan", label: "Kozan" },
      { value: "ceyhan", label: "Ceyhan" },
    ],
  },
  {
    value: "ankara",
    label: "Ankara",
    districts: [
      { value: "cankaya", label: "Çankaya" },
      { value: "kecioren", label: "Keçiören" },
      { value: "mamak", label: "Mamak" },
      { value: "etimesgut", label: "Etimesgut" },
      { value: "sincan", label: "Sincan" },
      { value: "yenimahalle", label: "Yenimahalle" },
      { value: "polatli", label: "Polatlı" },
      { value: "cubuk", label: "Çubuk" },
    ],
  },
  {
    value: "balikesir",
    label: "Balıkesir",
    districts: [
      { value: "altieylul", label: "Altıeylül" },
      { value: "karesi", label: "Karesi" },
      { value: "bandirma", label: "Bandırma" },
      { value: "edremit", label: "Edremit" },
      { value: "gonen", label: "Gönen" },
      { value: "susurluk", label: "Susurluk" },
    ],
  },
  {
    value: "bursa",
    label: "Bursa",
    districts: [
      { value: "osmangazi", label: "Osmangazi" },
      { value: "nilufer", label: "Nilüfer" },
      { value: "yildirim", label: "Yıldırım" },
      { value: "inegol", label: "İnegöl" },
      { value: "gemlik", label: "Gemlik" },
      { value: "mudanya", label: "Mudanya" },
      { value: "karacabey", label: "Karacabey" },
    ],
  },
  {
    value: "diyarbakir",
    label: "Diyarbakır",
    districts: [
      { value: "baglar", label: "Bağlar" },
      { value: "kayapinar", label: "Kayapınar" },
      { value: "yenisehir", label: "Yenişehir" },
      { value: "sur", label: "Sur" },
      { value: "bismil", label: "Bismil" },
      { value: "ergani", label: "Ergani" },
    ],
  },
  {
    value: "erzurum",
    label: "Erzurum",
    districts: [
      { value: "yakutiye", label: "Yakutiye" },
      { value: "palandoken", label: "Palandöken" },
      { value: "aziziye", label: "Aziziye" },
      { value: "horasan", label: "Horasan" },
      { value: "pasinler", label: "Pasinler" },
    ],
  },
  {
    value: "gaziantep",
    label: "Gaziantep",
    districts: [
      { value: "sahinbey", label: "Şahinbey" },
      { value: "sehitkamil", label: "Şehitkamil" },
      { value: "nizip", label: "Nizip" },
      { value: "islahiye", label: "İslahiye" },
    ],
  },
  {
    value: "istanbul",
    label: "İstanbul",
    districts: [
      { value: "kadikoy", label: "Kadıköy" },
      { value: "uskudar", label: "Üsküdar" },
      { value: "besiktas", label: "Beşiktaş" },
      { value: "fatih", label: "Fatih" },
      { value: "bakirkoy", label: "Bakırköy" },
      { value: "pendik", label: "Pendik" },
      { value: "maltepe", label: "Maltepe" },
      { value: "kartal", label: "Kartal" },
      { value: "umraniye", label: "Ümraniye" },
      { value: "avcilar", label: "Avcılar" },
      { value: "kucukcekmece", label: "Küçükçekmece" },
      { value: "silivri", label: "Silivri" },
    ],
  },
  {
    value: "izmir",
    label: "İzmir",
    districts: [
      { value: "konak", label: "Konak" },
      { value: "bornova", label: "Bornova" },
      { value: "karsiyaka", label: "Karşıyaka" },
      { value: "buca", label: "Buca" },
      { value: "bayrakli", label: "Bayraklı" },
      { value: "cigli", label: "Çiğli" },
      { value: "menemen", label: "Menemen" },
      { value: "torbali", label: "Torbalı" },
      { value: "odemis", label: "Ödemiş" },
      { value: "bergama", label: "Bergama" },
    ],
  },
  {
    value: "kayseri",
    label: "Kayseri",
    districts: [
      { value: "melikgazi", label: "Melikgazi" },
      { value: "kocasinan", label: "Kocasinan" },
      { value: "talas", label: "Talas" },
      { value: "develi", label: "Develi" },
      { value: "bunyan", label: "Bünyan" },
    ],
  },
  {
    value: "konya",
    label: "Konya",
    districts: [
      { value: "selcuklu", label: "Selçuklu" },
      { value: "meram", label: "Meram" },
      { value: "karatay", label: "Karatay" },
      { value: "eregli", label: "Ereğli" },
      { value: "aksehir", label: "Akşehir" },
      { value: "cihanbeyli", label: "Cihanbeyli" },
      { value: "beysehir", label: "Beyşehir" },
    ],
  },
  {
    value: "manisa",
    label: "Manisa",
    districts: [
      { value: "yunusemre", label: "Yunusemre" },
      { value: "sehzadeler", label: "Şehzadeler" },
      { value: "akhisar", label: "Akhisar" },
      { value: "turgutlu", label: "Turgutlu" },
      { value: "salihli", label: "Salihli" },
      { value: "soma", label: "Soma" },
    ],
  },
  {
    value: "mersin",
    label: "Mersin",
    districts: [
      { value: "yenisehir", label: "Yenişehir" },
      { value: "toroslar", label: "Toroslar" },
      { value: "mezitli", label: "Mezitli" },
      { value: "akdeniz", label: "Akdeniz" },
      { value: "tarsus", label: "Tarsus" },
      { value: "silifke", label: "Silifke" },
    ],
  },
  {
    value: "samsun",
    label: "Samsun",
    districts: [
      { value: "ilkadim", label: "İlkadım" },
      { value: "atakum", label: "Atakum" },
      { value: "canik", label: "Canik" },
      { value: "tekkeköy", label: "Tekkeköy" },
      { value: "bafra", label: "Bafra" },
      { value: "carsamba", label: "Çarşamba" },
    ],
  },
  {
    value: "sanliurfa",
    label: "Şanlıurfa",
    districts: [
      { value: "haliliye", label: "Haliliye" },
      { value: "eyubiye", label: "Eyyübiye" },
      { value: "karakopru", label: "Karaköprü" },
      { value: "suruc", label: "Suruç" },
      { value: "viransehir", label: "Viranşehir" },
      { value: "siverek", label: "Siverek" },
    ],
  },
  {
    value: "trabzon",
    label: "Trabzon",
    districts: [
      { value: "ortahisar", label: "Ortahisar" },
      { value: "akcaabat", label: "Akçaabat" },
      { value: "arakli", label: "Araklı" },
      { value: "of", label: "Of" },
      { value: "vakfikebir", label: "Vakfıkebir" },
    ],
  },
  {
    value: "van",
    label: "Van",
    districts: [
      { value: "ipekyolu", label: "İpekyolu" },
      { value: "tusba", label: "Tuşba" },
      { value: "edremit", label: "Edremit" },
      { value: "ercis", label: "Erciş" },
      { value: "muradiye", label: "Muradiye" },
    ],
  },
]

export function getCityByValue(value: string): City | undefined {
  return TURKEY_CITIES.find((city) => city.value === value)
}

export function getDistrictsByCityValue(cityValue: string): District[] {
  const city = getCityByValue(cityValue)
  return city ? city.districts : []
}
