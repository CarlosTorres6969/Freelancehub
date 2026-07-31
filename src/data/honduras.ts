export interface HondurasDepartment {
  name: string
  municipalities: string[]
}

// Lista de los 18 departamentos de Honduras y sus municipios.
// Reconstruida de fuentes generales; si detectas algún municipio
// faltante o mal escrito, avisa para corregirlo.
export const HONDURAS_DEPARTMENTS: HondurasDepartment[] = [
  { name: "Atlántida", municipalities: ["La Ceiba", "Arizona", "El Porvenir", "Esparta", "Jutiapa", "La Masica", "San Francisco", "Tela"] },
  { name: "Choluteca", municipalities: ["Choluteca", "Apacilagua", "Concepción de María", "Duyure", "El Corpus", "El Triunfo", "Marcovia", "Morolica", "Namasigüe", "Orocuina", "Pespire", "San Antonio de Flores", "San Isidro", "San José", "San Marcos de Colón", "Santa Ana de Yusguare"] },
  { name: "Colón", municipalities: ["Trujillo", "Balfate", "Bonito Oriental", "Iriona", "Limón", "Sabá", "Santa Fe", "Santa Rosa de Aguán", "Sonaguera", "Tocoa"] },
  { name: "Comayagua", municipalities: ["Comayagua", "Ajuterique", "El Rosario", "Esquías", "Humuya", "La Libertad", "Lamaní", "La Trinidad", "Lejamaní", "Meámbar", "Minas de Oro", "Ojos de Agua", "San Jerónimo", "San José de Comayagua", "San José del Potrero", "San Luis", "San Sebastián", "Siguatepeque", "Taulabé", "Villa de San Antonio", "Las Lajas"] },
  { name: "Copán", municipalities: ["Santa Rosa de Copán", "Cabañas", "Concepción", "Copán Ruinas", "Corquín", "Cucuyagua", "Dolores", "Dulce Nombre", "El Paraíso", "Florida", "La Jigua", "La Unión", "Nueva Arcadia", "San Agustín", "San Antonio", "San Jerónimo", "San José", "San Juan de Opoa", "San Nicolás", "San Pedro de Copán", "Santa Rita", "Trinidad de Copán", "Veracruz"] },
  { name: "Cortés", municipalities: ["San Pedro Sula", "Choloma", "La Lima", "Omoa", "Pimienta", "Potrerillos", "Puerto Cortés", "San Antonio de Cortés", "San Francisco de Yojoa", "San Manuel", "Santa Cruz de Yojoa", "Villanueva"] },
  { name: "El Paraíso", municipalities: ["Yuscarán", "Alauca", "Danlí", "El Paraíso", "Güinope", "Jacaleapa", "Liure", "Morocelí", "Oropolí", "Potrerillos", "San Antonio de Flores", "San Lucas", "San Matías", "Soledad", "Teupasenti", "Texiguat", "Trojes", "Vado Ancho", "Yauyupe"] },
  { name: "Francisco Morazán", municipalities: ["Distrito Central", "Alubarén", "Cedros", "Curarén", "El Porvenir", "Guaimaca", "La Libertad", "La Venta", "Lepaterique", "Maraita", "Marale", "Nueva Armenia", "Ojojona", "Orica", "Reitoca", "Sabanagrande", "San Antonio de Oriente", "San Buenaventura", "San Ignacio", "San Juan de Flores", "San Miguelito", "Santa Ana", "Santa Lucía", "Talanga", "Tatumbla", "Valle de Ángeles", "Vallecillo", "Villa de San Francisco"] },
  { name: "Gracias a Dios", municipalities: ["Puerto Lempira", "Ahuas", "Brus Laguna", "Juan Francisco Bulnes", "Ramón Villeda Morales", "Wampusirpi"] },
  { name: "Intibucá", municipalities: ["La Esperanza", "Camasca", "Colomoncagua", "Concepción", "Dolores", "Intibucá", "Jesús de Otoro", "Magdalena", "Masaguara", "San Antonio", "San Francisco de Opalaca", "San Isidro", "San Juan", "San Marcos de la Sierra", "San Miguelito", "Santa Lucía", "Yamaranguila"] },
  { name: "Islas de la Bahía", municipalities: ["Roatán", "Guanaja", "José Santos Guardiola", "Utila"] },
  { name: "La Paz", municipalities: ["La Paz", "Aguanqueterique", "Cabañas", "Cane", "Chinacla", "Guajiquiro", "Lauterique", "Marcala", "Mercedes de Oriente", "Opatoro", "San Antonio del Norte", "San José", "San Juan", "San Pedro de Tutule", "Santa Ana", "Santa Elena", "Santa María", "Santiago de Puringla", "Yarula"] },
  { name: "Lempira", municipalities: ["Gracias", "Belén", "Candelaria", "Cololaca", "Erandique", "Gualcince", "Guarita", "La Campa", "La Iguala", "La Unión", "La Virtud", "Las Flores", "Lepaera", "Mapulaca", "Piraera", "San Andrés", "San Francisco", "San Juan Guarita", "San Manuel Colohete", "San Marcos de Caiquín", "San Rafael", "San Sebastián", "Santa Cruz", "Talgua", "Tambla", "Tomalá", "Valladolid", "Virginia"] },
  { name: "Ocotepeque", municipalities: ["Ocotepeque", "Belén Gualcho", "Concepción", "Dolores Merendón", "Fraternidad", "La Encarnación", "La Labor", "Lucerna", "Mercedes", "San Fernando", "San Francisco del Valle", "San Jorge", "San Marcos", "Santa Fe", "Sensenti", "Sinuapa"] },
  { name: "Olancho", municipalities: ["Juticalpa", "Campamento", "Catacamas", "Concordia", "Dulce Nombre de Culmí", "El Rosario", "Esquipulas del Norte", "Gualaco", "Guarizama", "Guata", "Guayape", "Jano", "La Unión", "Mangulile", "Manto", "Patuca", "Salamá", "San Esteban", "San Francisco de Becerra", "San Francisco de la Paz", "Santa María del Real", "Silca", "Yocón"] },
  { name: "Santa Bárbara", municipalities: ["Santa Bárbara", "Arada", "Atima", "Azacualpa", "Ceguaca", "Concepción del Norte", "Concepción del Sur", "Chinda", "El Níspero", "Gualala", "Ilama", "Las Vegas", "Macuelizo", "Naranjito", "Nueva Celilac", "Petoa", "Protección", "Quimistán", "San Francisco de Ojuera", "San José de Colinas", "San Luis", "San Marcos", "San Nicolás", "San Pedro de Zacapa", "San Vicente Centenario", "Santa Rita", "Trinidad"] },
  { name: "Valle", municipalities: ["Nacaome", "Alianza", "Amapala", "Aramecina", "Caridad", "Goascorán", "Langue", "San Francisco de Coray", "San Lorenzo"] },
  { name: "Yoro", municipalities: ["Yoro", "Arenal", "El Negrito", "El Progreso", "Jocón", "Morazán", "Olanchito", "Santa Rita", "Sulaco", "Victoria", "Yorito"] },
]
