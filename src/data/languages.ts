export interface LanguageOption {
  code: string
  label: string
}

// Los 10 idiomas más hablados del mundo (por número de hablantes).
export const COMMON_LANGUAGES: LanguageOption[] = [
  { code: "es", label: "Español" },
  { code: "en", label: "Inglés" },
  { code: "zh", label: "Chino (Mandarín)" },
  { code: "hi", label: "Hindi" },
  { code: "ar", label: "Árabe" },
  { code: "pt", label: "Portugués" },
  { code: "fr", label: "Francés" },
  { code: "ru", label: "Ruso" },
  { code: "de", label: "Alemán" },
  { code: "ja", label: "Japonés" },
]
