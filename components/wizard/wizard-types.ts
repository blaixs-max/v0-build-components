export type Category = "buyukbas" | "kucukbas" | null
export type Gender = "disi" | "erkek"
export type AnimalType = "koyun" | "keci"
export type SaleType = "tekli" | "toplu"

export interface ListingFormData {
  category: Category
  gender: Gender
  breed: string
  age: string
  weight: string
  status: string[]
  animalType: AnimalType
  saleType: SaleType
  quantity: string
  price: string
  photos: string[]
  video: string | null
  city: string
  district: string
}

export const initialFormData: ListingFormData = {
  category: null,
  gender: "erkek",
  breed: "",
  age: "",
  weight: "",
  status: [],
  animalType: "koyun",
  saleType: "tekli",
  quantity: "1",
  price: "",
  photos: [],
  video: null,
  city: "",
  district: "",
}

export const BUYUKBAS_BREEDS = [
  { value: "simental", label: "Simental", image: "/simental-bull-cattle.jpg" },
  { value: "holstein", label: "Hoştayn", image: "/holstein-black-white-dairy-cow.jpg" },
  { value: "montofon", label: "Montofon", image: "/brown-swiss-heifer-cattle.jpg" },
  { value: "yerli", label: "Yerli", image: "/jersey-brown-dairy-cow.jpg" },
]

export const KUCUKBAS_BREEDS = [
  { value: "merinos", label: "Merinos", image: "/merino-ram-sheep-wool.jpg" },
  { value: "kivircik", label: "Kıvırcık", image: "/kivircik-lamb-sheep.jpg" },
  { value: "kilkecisi", label: "Kıl Keçisi", image: "/akkaraman-sheep-white.jpg" },
]

export const AGE_OPTIONS = ["0-6 Ay", "6-12 Ay", "1-2 Yaş", "2+ Yaş"]

export const BUYUKBAS_STATUS = ["Gebe", "Buzağılı", "Besilik", "Kurbanlık"]
export const KUCUKBAS_STATUS = ["Kuzulu", "Gebe", "Adaklık"]
