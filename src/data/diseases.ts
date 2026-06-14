// =============================================================================
// BioRare · Capa de datos
// -----------------------------------------------------------------------------
// Fuente de verdad única para las enfermedades de la red. Todas las pantallas
// (buscador, ficha, dashboard) leen de aquí; ninguna debe llevar datos inline.
//
// AVISO: los valores son de DEMOSTRACIÓN para un proyecto académico. Aunque se
// basan en información pública real (ORPHA, ICD-10, genes), las frecuencias de
// variantes, muestras y proveedores son ilustrativas y no clínicas.
// =============================================================================

export type Severity = "alta" | "media";
export type TreatmentStatus = "approved" | "trial";
export type StockState = "disponible" | "bajo" | "pedido";

/** Aspecto clínico crítico (columna ancha del resumen). */
export interface ClinicalFeature {
  sev: Severity;
  label: string;
  desc: string;
}

/** Tratamiento experimental o aprobado, con su fase clínica. */
export interface Treatment {
  name: string;
  phase: string;
  status: TreatmentStatus;
  note: string;
}

/** Datos genéticos puntuales (columna angosta). */
export interface GeneFacts {
  gen: string;
  cromosoma: string;
  locus: string;
  herencia: string;
  omim: string;
}

/** Variante patogénica (tabla monoespaciada). */
export interface Variant {
  hgvs: string;
  protein: string;
  type: string;
  freq: string;
  patho: string;
}

/** Criterio diagnóstico (lista numerada). */
export interface DiagnosticCriterion {
  title: string;
  desc: string;
}

/** Bloque de diagnóstico completo. */
export interface Diagnosis {
  criterios: DiagnosticCriterion[];
  pruebas: string[];
  callout: string;
}

/** Insumo de sourcing vinculado a la enfermedad. */
export interface Supply {
  name: string;
  spec: string;
  cat: SupplyCategory;
  lab: string;
  stock: StockState;
}

/** Muestra disponible en la red de biobancos. */
export interface NetworkSample {
  biobank: string;
  city: string;
  type: string;
  n: number;
  avail: StockState;
}

/** Referencia bibliográfica. */
export interface Paper {
  title: string;
  authors: string;
  journal: string;
  year: number;
  type: string;
}

export interface Disease {
  /** Identificador para la URL: /ficha/<slug> */
  slug: string;
  nombre: string;
  orpha: string;
  icd10: string;
  /** Texto mostrado en la cabecera, p. ej. "X (Xq28)". */
  cromosoma: string;
  prevalencia: string;
  /** Etiqueta de categoría (chip teal en la cabecera). */
  categoria: string;
  /** Resumen corto para el buscador. */
  resumen: string;
  gene: GeneFacts;
  clinical: ClinicalFeature[];
  treatments: Treatment[];
  variants: Variant[];
  diagnosis: Diagnosis;
  sourcing: Supply[];
  samples: NetworkSample[];
  papers: Paper[];
}

// -----------------------------------------------------------------------------
// Categorías de sourcing (compartidas por todas las fichas).
// -----------------------------------------------------------------------------
export const supplyCategories = [
  "Todos",
  "Kits PCR",
  "Reactivos",
  "Materiales",
  "Implementos quirúrgicos",
] as const;
export type SupplyCategory = Exclude<(typeof supplyCategories)[number], "Todos">;

// Metadatos de estado de stock / disponibilidad (chip + etiqueta).
export const stockMeta: Record<StockState, { chip: string; text: string }> = {
  disponible: { chip: "chip-green", text: "Disponible" },
  bajo: { chip: "chip-amber", text: "Bajo stock" },
  pedido: { chip: "chip-gray", text: "Bajo pedido" },
};

// -----------------------------------------------------------------------------
// Catálogo de enfermedades
// -----------------------------------------------------------------------------
export const diseases: Disease[] = [
  // ===== 1. Síndrome de Rett ==================================================
  {
    slug: "rett",
    nombre: "Síndrome de Rett",
    orpha: "778",
    icd10: "F84.2",
    cromosoma: "X (Xq28)",
    prevalencia: "1 / 10.000 ♀",
    categoria: "Neurodesarrollo",
    resumen:
      "Trastorno del neurodesarrollo ligado al X causado por mutaciones en MECP2, con regresión tras un desarrollo inicial normal.",
    gene: {
      gen: "MECP2",
      cromosoma: "X",
      locus: "Xq28",
      herencia: "Dominante lig. X",
      omim: "312750",
    },
    clinical: [
      { sev: "alta", label: "Regresión del desarrollo", desc: "Pérdida de habilidades manuales y del lenguaje entre los 6 y 18 meses." },
      { sev: "alta", label: "Estereotipias manuales", desc: "Movimientos repetitivos de lavado/retorcimiento de manos, casi patognomónicos." },
      { sev: "media", label: "Trastorno de la marcha", desc: "Apraxia / ataxia; muchas pacientes no llegan a caminar de forma autónoma." },
      { sev: "media", label: "Crisis epilépticas", desc: "Aparecen en ~60% de los casos, habitualmente tras los 2 años." },
      { sev: "alta", label: "Disautonomía respiratoria", desc: "Hiperventilación y apneas en vigilia; relevante para el manejo clínico." },
    ],
    treatments: [
      { name: "Trofinetida", phase: "Aprobado (FDA)", status: "approved", note: "Análogo de IGF-1; mejora en escalas conductuales." },
      { name: "Terapia génica MECP2", phase: "Fase I/II", status: "trial", note: "Vector AAV9 intratecal; ensayos en curso." },
      { name: "Blarcamesina", phase: "Fase III", status: "trial", note: "Agonista sigma-1, neuroprotección." },
      { name: "Ketamina (baja dosis)", phase: "Fase II", status: "trial", note: "Modulación de NMDA en síntomas nocturnos." },
    ],
    variants: [
      { hgvs: "c.473C>T", protein: "p.Thr158Met", type: "Missense", freq: "0.0041", patho: "Patogénica" },
      { hgvs: "c.502C>T", protein: "p.Arg168*", type: "Nonsense", freq: "0.0038", patho: "Patogénica" },
      { hgvs: "c.916C>T", protein: "p.Arg306Cys", type: "Missense", freq: "0.0029", patho: "Patogénica" },
      { hgvs: "c.763C>T", protein: "p.Arg255*", type: "Nonsense", freq: "0.0021", patho: "Patogénica" },
      { hgvs: "c.1157del", protein: "p.Leu386fs", type: "Frameshift", freq: "0.0009", patho: "Prob. patog." },
    ],
    diagnosis: {
      criterios: [
        { title: "Criterios principales", desc: "Pérdida parcial/total de habilidades manuales y del lenguaje adquirido, estereotipias y alteración de la marcha." },
        { title: "Periodo de regresión", desc: "Seguido de recuperación o estabilización." },
        { title: "Exclusión", desc: "De lesión cerebral secundaria, metabolopatías y trastornos neurodegenerativos." },
        { title: "Confirmación molecular", desc: "Mediante secuenciación del gen MECP2." },
      ],
      pruebas: [
        "Secuenciación Sanger / NGS de MECP2",
        "MLPA para grandes deleciones",
        "EEG (patrón epileptiforme)",
        "Evaluación neurológica seriada",
        "Cribado de X-frágil (diagnóstico diferencial)",
      ],
      callout: "Tiempo medio al diagnóstico en la red: 2,7 meses (vs. 14 meses fuera de BioRare).",
    },
    sourcing: [
      { name: "Kit secuenciación MECP2", spec: "Panel NGS · 12 exones · cobertura 250×", cat: "Kits PCR", lab: "GenoTech Iberia", stock: "disponible" },
      { name: "Primers Xq28 (set x24)", spec: "Oligos HPLC · 25 nmol · Tm 60±1 °C", cat: "Reactivos", lab: "BioPrimers SL", stock: "bajo" },
      { name: "Master Mix qPCR", spec: "2× · ROX · 500 reacciones", cat: "Reactivos", lab: "Roche Diagnostics", stock: "disponible" },
      { name: "Placas 96 pocillos PCR", spec: "Skirted · grado óptico · pack 50", cat: "Materiales", lab: "LabWare BCN", stock: "disponible" },
      { name: "Kit extracción ADN sangre", spec: "Columna sílice · 200 µL · 250 prep", cat: "Kits PCR", lab: "Qiagen Iberia", stock: "bajo" },
      { name: "Aguja biopsia muscular", spec: "Bergström 5 mm · estéril · individual", cat: "Implementos quirúrgicos", lab: "MedSurg Supplies", stock: "pedido" },
      { name: "Crioviales 2 mL (x500)", spec: "PP · rosca externa · −196 °C", cat: "Materiales", lab: "LabWare BCN", stock: "disponible" },
      { name: "Sonda TaqMan MECP2", spec: "FAM/MGB · variante c.473C>T", cat: "Reactivos", lab: "Thermo Fisher", stock: "pedido" },
    ],
    samples: [
      { biobank: "Biobanco IDIBELL", city: "Barcelona", type: "ADN + Fibroblastos", n: 84, avail: "disponible" },
      { biobank: "Biobanco La Paz", city: "Madrid", type: "Suero · Plasma", n: 62, avail: "disponible" },
      { biobank: "BioBank Navarra", city: "Pamplona", type: "ARN · Línea celular", n: 41, avail: "bajo" },
      { biobank: "Biobanc HUVH", city: "Barcelona", type: "Tejido congelado", n: 29, avail: "pedido" },
    ],
    papers: [
      { title: "MECP2 mutations in patients with classic and atypical Rett syndrome", authors: "Neul J. et al.", journal: "Nature Genetics", year: 2024, type: "Cohorte" },
      { title: "Trofinetide for the treatment of Rett syndrome: a phase III trial", authors: "Percy A. et al.", journal: "The Lancet Neurology", year: 2023, type: "Ensayo clínico" },
      { title: "AAV9 gene therapy restores MeCP2 function in murine models", authors: "Sinnett S. et al.", journal: "Brain", year: 2025, type: "Preclínico" },
      { title: "Genotype-phenotype correlations across the MECP2 spectrum", authors: "Cuddapah V. et al.", journal: "J. Med. Genetics", year: 2024, type: "Revisión" },
    ],
  },

  // ===== 2. Fibrosis quística =================================================
  {
    slug: "fibrosis-quistica",
    nombre: "Fibrosis quística",
    orpha: "586",
    icd10: "E84",
    cromosoma: "7 (7q31.2)",
    prevalencia: "1 / 3.000 (Europa)",
    categoria: "Metabólica / Pulmonar",
    resumen:
      "Enfermedad autosómica recesiva por mutaciones en CFTR que altera el transporte de cloro y produce secreciones espesas en pulmón y páncreas.",
    gene: {
      gen: "CFTR",
      cromosoma: "7",
      locus: "7q31.2",
      herencia: "Autosómica recesiva",
      omim: "219700",
    },
    clinical: [
      { sev: "alta", label: "Enfermedad pulmonar crónica", desc: "Bronquiectasias, infecciones recurrentes por P. aeruginosa y deterioro respiratorio progresivo." },
      { sev: "alta", label: "Insuficiencia pancreática", desc: "Maldigestión y malabsorción en ~85% de los pacientes; afecta el crecimiento." },
      { sev: "media", label: "Íleo meconial", desc: "Obstrucción intestinal neonatal, a menudo primera manifestación." },
      { sev: "media", label: "Diabetes asociada a FQ", desc: "Aparece en la adolescencia/adultez por daño progresivo del páncreas endocrino." },
      { sev: "alta", label: "Pérdida de sal / deshidratación", desc: "Sudor con cloro elevado; riesgo de alcalosis hipoclorémica en calor." },
    ],
    treatments: [
      { name: "Elexacaftor/Tezacaftor/Ivacaftor", phase: "Aprobado (FDA/EMA)", status: "approved", note: "Triple modulador CFTR; eficaz en portadores de F508del." },
      { name: "Ivacaftor", phase: "Aprobado", status: "approved", note: "Potenciador CFTR para mutaciones de gating (G551D)." },
      { name: "Terapia de ARNm CFTR inhalado", phase: "Fase I/II", status: "trial", note: "Reposición del transcrito por vía nebulizada." },
      { name: "Edición génica CFTR", phase: "Preclínico", status: "trial", note: "Estrategias CRISPR en epitelio respiratorio." },
    ],
    variants: [
      { hgvs: "c.1521_1523del", protein: "p.Phe508del", type: "Deleción", freq: "0.0700", patho: "Patogénica" },
      { hgvs: "c.1652G>A", protein: "p.Gly551Asp", type: "Missense", freq: "0.0017", patho: "Patogénica" },
      { hgvs: "c.1624G>T", protein: "p.Gly542*", type: "Nonsense", freq: "0.0024", patho: "Patogénica" },
      { hgvs: "c.3909C>G", protein: "p.Asn1303Lys", type: "Missense", freq: "0.0013", patho: "Patogénica" },
      { hgvs: "c.489+1G>T", protein: "—", type: "Splicing", freq: "0.0008", patho: "Patogénica" },
    ],
    diagnosis: {
      criterios: [
        { title: "Cribado neonatal", desc: "Tripsinógeno inmunorreactivo (TIR) elevado en la prueba del talón." },
        { title: "Test del sudor", desc: "Cloro en sudor ≥ 60 mmol/L confirma; 30–59 mmol/L es indeterminado." },
        { title: "Confirmación genética", desc: "Identificación de dos variantes patogénicas en CFTR." },
        { title: "Evaluación de órgano diana", desc: "Función pulmonar y pancreática para estadificar la afectación." },
      ],
      pruebas: [
        "Test del sudor (cloro)",
        "Panel/secuenciación de CFTR + MLPA",
        "Espirometría y TAC torácico",
        "Elastasa fecal (función pancreática)",
        "Cultivo de esputo / microbiología",
      ],
      callout: "Tiempo medio al diagnóstico en la red: 1,2 meses gracias al cribado neonatal integrado.",
    },
    sourcing: [
      { name: "Panel NGS CFTR", spec: "Panel · todos los exones + MLPA · cobertura 200×", cat: "Kits PCR", lab: "GenoTech Iberia", stock: "disponible" },
      { name: "Test del sudor (electrodos)", spec: "Iontoforesis pilocarpina · reutilizable", cat: "Materiales", lab: "MedSurg Supplies", stock: "disponible" },
      { name: "Master Mix qPCR", spec: "2× · ROX · 500 reacciones", cat: "Reactivos", lab: "Roche Diagnostics", stock: "disponible" },
      { name: "Sonda TaqMan F508del", spec: "FAM/VIC · discriminación alélica", cat: "Reactivos", lab: "Thermo Fisher", stock: "bajo" },
      { name: "Kit extracción ADN sangre", spec: "Columna sílice · 200 µL · 250 prep", cat: "Kits PCR", lab: "Qiagen Iberia", stock: "disponible" },
      { name: "Tubos recogida esputo", spec: "Estériles · 50 mL · pack 100", cat: "Materiales", lab: "LabWare BCN", stock: "disponible" },
      { name: "Cepillo citológico bronquial", spec: "Endoscópico · estéril · individual", cat: "Implementos quirúrgicos", lab: "MedSurg Supplies", stock: "pedido" },
    ],
    samples: [
      { biobank: "Biobanco La Paz", city: "Madrid", type: "ADN · Suero", n: 118, avail: "disponible" },
      { biobank: "Biobanco IDIBELL", city: "Barcelona", type: "Epitelio respiratorio", n: 73, avail: "disponible" },
      { biobank: "Biobanco IBSAL", city: "Salamanca", type: "Esputo · Plasma", n: 54, avail: "bajo" },
      { biobank: "BioBank Navarra", city: "Pamplona", type: "Línea celular", n: 38, avail: "disponible" },
    ],
    papers: [
      { title: "Elexacaftor–Tezacaftor–Ivacaftor for cystic fibrosis with a single Phe508del allele", authors: "Middleton P. et al.", journal: "New England J. of Medicine", year: 2023, type: "Ensayo clínico" },
      { title: "CFTR modulator therapy: long-term real-world outcomes", authors: "Burgel P. et al.", journal: "The Lancet Respiratory Medicine", year: 2024, type: "Cohorte" },
      { title: "mRNA therapeutics for cystic fibrosis airway disease", authors: "Rowe S. et al.", journal: "Nature Medicine", year: 2025, type: "Preclínico" },
      { title: "Newborn screening strategies for cystic fibrosis: a review", authors: "Castellani C. et al.", journal: "J. of Cystic Fibrosis", year: 2024, type: "Revisión" },
    ],
  },

  // ===== 3. Atrofia muscular espinal ==========================================
  {
    slug: "atrofia-muscular-espinal",
    nombre: "Atrofia muscular espinal",
    orpha: "83330",
    icd10: "G12.0",
    cromosoma: "5 (5q13.2)",
    prevalencia: "1 / 10.000",
    categoria: "Neuromuscular",
    resumen:
      "Degeneración de motoneuronas del asta anterior por pérdida de SMN1, con debilidad muscular progresiva; gravedad modulada por el número de copias de SMN2.",
    gene: {
      gen: "SMN1",
      cromosoma: "5",
      locus: "5q13.2",
      herencia: "Autosómica recesiva",
      omim: "253300",
    },
    clinical: [
      { sev: "alta", label: "Debilidad muscular proximal", desc: "Simétrica, de predominio proximal; las piernas suelen afectarse antes que los brazos." },
      { sev: "alta", label: "Insuficiencia respiratoria", desc: "Por debilidad de músculos intercostales; principal causa de morbimortalidad en tipo I." },
      { sev: "media", label: "Hipotonía y arreflexia", desc: "Lactante hipotónico ('floppy infant') con reflejos osteotendinosos abolidos." },
      { sev: "media", label: "Dificultades de deglución", desc: "Riesgo de aspiración y compromiso nutricional en formas graves." },
      { sev: "media", label: "Escoliosis y contracturas", desc: "Deformidad progresiva del raquis en supervivientes de larga evolución." },
    ],
    treatments: [
      { name: "Onasemnogén abeparvovec", phase: "Aprobado (FDA/EMA)", status: "approved", note: "Terapia génica AAV9 en dosis única; reemplaza SMN1." },
      { name: "Nusinersén", phase: "Aprobado", status: "approved", note: "Oligonucleótido antisentido intratecal que modula el splicing de SMN2." },
      { name: "Risdiplam", phase: "Aprobado", status: "approved", note: "Modificador del splicing de SMN2 por vía oral." },
      { name: "Inhibidores de miostatina", phase: "Fase II/III", status: "trial", note: "Terapia muscular adyuvante para aumentar masa y fuerza." },
    ],
    variants: [
      { hgvs: "ex7-8 del", protein: "—", type: "Deleción homocigota", freq: "0.0095", patho: "Patogénica" },
      { hgvs: "c.840C>T", protein: "(SMN2)", type: "Splicing modif.", freq: "—", patho: "Modificador" },
      { hgvs: "c.815A>G", protein: "p.Tyr272Cys", type: "Missense", freq: "0.0006", patho: "Patogénica" },
      { hgvs: "c.5C>G", protein: "p.Ala2Gly", type: "Missense", freq: "0.0004", patho: "Patogénica" },
      { hgvs: "c.683T>A", protein: "p.Leu228*", type: "Nonsense", freq: "0.0003", patho: "Patogénica" },
    ],
    diagnosis: {
      criterios: [
        { title: "Sospecha clínica", desc: "Lactante o niño con hipotonía, debilidad proximal simétrica y arreflexia." },
        { title: "Confirmación molecular", desc: "Deleción homocigota de SMN1 (exón 7) por MLPA o qPCR." },
        { title: "Recuento de copias SMN2", desc: "Determina el pronóstico y guía la elección terapéutica." },
        { title: "Cribado neonatal", desc: "Detección presintomática que habilita el tratamiento precoz." },
      ],
      pruebas: [
        "MLPA / qPCR de SMN1 y SMN2 (nº de copias)",
        "Cribado neonatal de SMN1",
        "Electromiografía y velocidad de conducción",
        "Función respiratoria (capacidad vital)",
        "CK sérica (diagnóstico diferencial)",
      ],
      callout: "Tiempo medio al diagnóstico en la red: 0,9 meses en casos detectados por cribado neonatal.",
    },
    sourcing: [
      { name: "Kit MLPA SMN1/SMN2", spec: "Cuantificación de copias · 25 reacciones", cat: "Kits PCR", lab: "GenoTech Iberia", stock: "disponible" },
      { name: "Master Mix qPCR", spec: "2× · ROX · 500 reacciones", cat: "Reactivos", lab: "Roche Diagnostics", stock: "disponible" },
      { name: "Primers SMN exón 7/8", spec: "Oligos HPLC · 25 nmol", cat: "Reactivos", lab: "BioPrimers SL", stock: "bajo" },
      { name: "Aguja EMG concéntrica", spec: "26G · desechable · pack 25", cat: "Implementos quirúrgicos", lab: "MedSurg Supplies", stock: "disponible" },
      { name: "Kit extracción ADN sangre", spec: "Columna sílice · 200 µL · 250 prep", cat: "Kits PCR", lab: "Qiagen Iberia", stock: "disponible" },
      { name: "Crioviales 2 mL (x500)", spec: "PP · rosca externa · −196 °C", cat: "Materiales", lab: "LabWare BCN", stock: "pedido" },
    ],
    samples: [
      { biobank: "Biobanc HUVH", city: "Barcelona", type: "ADN · Línea celular", n: 67, avail: "disponible" },
      { biobank: "Biobanco La Paz", city: "Madrid", type: "Suero · ADN", n: 49, avail: "disponible" },
      { biobank: "BioBank Navarra", city: "Pamplona", type: "Fibroblastos", n: 31, avail: "bajo" },
      { biobank: "Biobanco IDIBELL", city: "Barcelona", type: "Tejido muscular", n: 22, avail: "pedido" },
    ],
    papers: [
      { title: "Single-dose gene-replacement therapy for spinal muscular atrophy", authors: "Mendell J. et al.", journal: "New England J. of Medicine", year: 2023, type: "Ensayo clínico" },
      { title: "Nusinersen in presymptomatic infants: the NURTURE study", authors: "De Vivo D. et al.", journal: "Neuromuscular Disorders", year: 2024, type: "Cohorte" },
      { title: "SMN2 copy number as a predictor of SMA phenotype", authors: "Calucho M. et al.", journal: "J. Med. Genetics", year: 2024, type: "Revisión" },
      { title: "Risdiplam restores SMN protein in motor neurons", authors: "Ratni H. et al.", journal: "Nature Communications", year: 2025, type: "Preclínico" },
    ],
  },

  // ===== 4. Enfermedad de Huntington ==========================================
  {
    slug: "huntington",
    nombre: "Enfermedad de Huntington",
    orpha: "399",
    icd10: "G10",
    cromosoma: "4 (4p16.3)",
    prevalencia: "1 / 20.000 (Europa)",
    categoria: "Neurodegenerativa",
    resumen:
      "Enfermedad neurodegenerativa autosómica dominante por expansión de repeticiones CAG en HTT, con corea, deterioro cognitivo y alteraciones psiquiátricas.",
    gene: {
      gen: "HTT",
      cromosoma: "4",
      locus: "4p16.3",
      herencia: "Autosómica dominante",
      omim: "143100",
    },
    clinical: [
      { sev: "alta", label: "Corea", desc: "Movimientos involuntarios, irregulares y fluidos; signo motor más característico." },
      { sev: "alta", label: "Deterioro cognitivo", desc: "Disfunción ejecutiva progresiva que evoluciona a demencia subcortical." },
      { sev: "alta", label: "Trastornos psiquiátricos", desc: "Depresión, irritabilidad y riesgo de suicidio elevado; pueden preceder a lo motor." },
      { sev: "media", label: "Distonía y rigidez", desc: "Predominan en fases avanzadas y en la variante juvenil (Westphal)." },
      { sev: "media", label: "Pérdida de peso", desc: "Balance energético negativo pese a ingesta conservada." },
    ],
    treatments: [
      { name: "Tetrabenazina / Deutetrabenazina", phase: "Aprobado (FDA)", status: "approved", note: "Inhibidor de VMAT2; control sintomático de la corea." },
      { name: "Tominersén", phase: "Fase II (reanálisis)", status: "trial", note: "Oligonucleótido antisentido que reduce la huntingtina total." },
      { name: "Edición/silenciamiento alelo-específico", phase: "Fase I", status: "trial", note: "Estrategias dirigidas al alelo mutado." },
      { name: "Branaplam (splicing)", phase: "Preclínico", status: "trial", note: "Reducción de HTT por modulación del splicing." },
    ],
    variants: [
      { hgvs: "CAG 40–50", protein: "polyQ expandida", type: "Expansión repet.", freq: "—", patho: "Patogénica" },
      { hgvs: "CAG 36–39", protein: "polyQ reducida", type: "Penetr. incompleta", freq: "—", patho: "Penetr. variable" },
      { hgvs: "CAG 27–35", protein: "alelo intermedio", type: "Premutación", freq: "—", patho: "Inestable" },
      { hgvs: "CAG ≥ 60", protein: "polyQ juvenil", type: "Expansión grande", freq: "—", patho: "Patog. (juvenil)" },
      { hgvs: "CAG ≤ 26", protein: "normal", type: "No expandido", freq: "—", patho: "Benigna" },
    ],
    diagnosis: {
      criterios: [
        { title: "Antecedente familiar", desc: "Patrón autosómico dominante; anticipación entre generaciones." },
        { title: "Signos motores", desc: "Corea u otros trastornos del movimiento en la exploración neurológica." },
        { title: "Confirmación molecular", desc: "Recuento de repeticiones CAG en HTT ≥ 36." },
        { title: "Consejo genético", desc: "Imprescindible antes del test, especialmente presintomático." },
      ],
      pruebas: [
        "PCR de repeticiones CAG en HTT",
        "Resonancia magnética cerebral (atrofia del caudado)",
        "Evaluación neuropsicológica",
        "Escala UHDRS (motor/funcional)",
        "Valoración psiquiátrica",
      ],
      callout: "Tiempo medio al diagnóstico en la red: 1,8 meses; el consejo genético se ofrece en el 100% de los casos.",
    },
    sourcing: [
      { name: "Kit PCR repeticiones CAG", spec: "Fragment analysis · capilar · 50 muestras", cat: "Kits PCR", lab: "GenoTech Iberia", stock: "disponible" },
      { name: "Primers HTT (FAM)", spec: "Marcados FAM · 25 nmol · Tm 60 °C", cat: "Reactivos", lab: "BioPrimers SL", stock: "disponible" },
      { name: "Polímero electroforesis capilar", spec: "POP-7 · 960 inyecciones", cat: "Reactivos", lab: "Thermo Fisher", stock: "bajo" },
      { name: "Master Mix PCR GC-rich", spec: "Optimizado para regiones ricas en GC", cat: "Reactivos", lab: "Roche Diagnostics", stock: "disponible" },
      { name: "Placas 96 pocillos PCR", spec: "Skirted · grado óptico · pack 50", cat: "Materiales", lab: "LabWare BCN", stock: "disponible" },
      { name: "Kit extracción ADN sangre", spec: "Columna sílice · 200 µL · 250 prep", cat: "Kits PCR", lab: "Qiagen Iberia", stock: "pedido" },
    ],
    samples: [
      { biobank: "Biobanco IDIBELL", city: "Barcelona", type: "ADN · Plasma", n: 58, avail: "disponible" },
      { biobank: "Biobanco La Paz", city: "Madrid", type: "Suero · ADN", n: 44, avail: "disponible" },
      { biobank: "Biobanco IBSAL", city: "Salamanca", type: "Línea celular", n: 27, avail: "bajo" },
      { biobank: "BioBank Navarra", city: "Pamplona", type: "Tejido cerebral (post-mortem)", n: 18, avail: "pedido" },
    ],
    papers: [
      { title: "Targeting huntingtin expression with tominersen: lessons learned", authors: "Tabrizi S. et al.", journal: "Nature Reviews Neurology", year: 2024, type: "Revisión" },
      { title: "Somatic CAG repeat expansion drives onset in Huntington's disease", authors: "Lee J. et al.", journal: "Cell", year: 2024, type: "Cohorte" },
      { title: "Allele-selective lowering of mutant HTT in patient neurons", authors: "Kingwell K. et al.", journal: "Science Translational Medicine", year: 2025, type: "Preclínico" },
      { title: "Predictive testing uptake and outcomes: a 20-year registry", authors: "Baig S. et al.", journal: "J. Med. Genetics", year: 2023, type: "Cohorte" },
    ],
  },

  // ===== 5. Esclerosis lateral amiotrófica ====================================
  {
    slug: "ela",
    nombre: "Esclerosis lateral amiotrófica",
    orpha: "803",
    icd10: "G12.21",
    cromosoma: "9 / 21 (varios loci)",
    prevalencia: "2–3 / 100.000 / año",
    categoria: "Neurodegenerativa",
    resumen:
      "Degeneración de motoneuronas superior e inferior, mayormente esporádica; un 10% es familiar, con C9orf72 y SOD1 entre los genes más frecuentes.",
    gene: {
      gen: "C9orf72 / SOD1",
      cromosoma: "9p21 / 21q22",
      locus: "9p21.2",
      herencia: "AD (formas familiares)",
      omim: "105400",
    },
    clinical: [
      { sev: "alta", label: "Debilidad progresiva", desc: "Inicio focal (extremidad o bulbar) que se extiende de forma contigua." },
      { sev: "alta", label: "Insuficiencia respiratoria", desc: "Por debilidad diafragmática; principal causa de mortalidad." },
      { sev: "alta", label: "Afectación bulbar", desc: "Disartria y disfagia; alto riesgo de aspiración y desnutrición." },
      { sev: "media", label: "Espasticidad e hiperreflexia", desc: "Signos de motoneurona superior que coexisten con atrofia y fasciculaciones." },
      { sev: "media", label: "Deterioro cognitivo frontotemporal", desc: "Hasta un 15% desarrolla DFT asociada, especialmente con C9orf72." },
    ],
    treatments: [
      { name: "Riluzol", phase: "Aprobado", status: "approved", note: "Antiglutamatérgico; prolonga modestamente la supervivencia." },
      { name: "Edaravona", phase: "Aprobado (FDA)", status: "approved", note: "Antioxidante; enlentece el declive funcional en subgrupos." },
      { name: "Tofersén", phase: "Aprobado (SOD1)", status: "approved", note: "Oligonucleótido antisentido para ELA por mutación de SOD1." },
      { name: "Terapia anti-C9orf72", phase: "Fase I/II", status: "trial", note: "ASO dirigidos a la expansión hexanucleotídica." },
    ],
    variants: [
      { hgvs: "GGGGCC exp.", protein: "(C9orf72)", type: "Expansión intrónica", freq: "—", patho: "Patogénica" },
      { hgvs: "c.272A>C", protein: "p.Asp91Ala", type: "Missense (SOD1)", freq: "0.0006", patho: "Patogénica" },
      { hgvs: "c.13A>G", protein: "p.Ala5Thr", type: "Missense (SOD1)", freq: "0.0004", patho: "Patogénica" },
      { hgvs: "c.1175_1176del", protein: "p.Gly392fs (FUS)", type: "Frameshift", freq: "0.0003", patho: "Patogénica" },
      { hgvs: "c.859G>A", protein: "p.Gly287Ser (TARDBP)", type: "Missense", freq: "0.0002", patho: "Patogénica" },
    ],
    diagnosis: {
      criterios: [
        { title: "Criterios de El Escorial / Gold Coast", desc: "Combinación de signos de motoneurona superior e inferior con progresión." },
        { title: "Electromiografía", desc: "Denervación activa y crónica en múltiples regiones corporales." },
        { title: "Exclusión", desc: "Descartar mielopatías, neuropatías multifocales y miopatías que simulan ELA." },
        { title: "Estudio genético", desc: "Recomendado en formas familiares o de inicio temprano (C9orf72, SOD1)." },
      ],
      pruebas: [
        "Electromiografía y estudios de conducción",
        "Resonancia magnética cervical/cerebral",
        "Panel NGS de ELA (C9orf72, SOD1, FUS, TARDBP)",
        "Capacidad vital forzada",
        "Escala funcional ALSFRS-R",
      ],
      callout: "Tiempo medio al diagnóstico en la red: 4,1 meses (vs. ~12 meses descrito en la literatura).",
    },
    sourcing: [
      { name: "Panel NGS ELA", spec: "C9orf72, SOD1, FUS, TARDBP · cobertura 200×", cat: "Kits PCR", lab: "GenoTech Iberia", stock: "disponible" },
      { name: "Kit repeat-primed PCR C9orf72", spec: "Detección de expansión GGGGCC", cat: "Kits PCR", lab: "Qiagen Iberia", stock: "bajo" },
      { name: "Master Mix qPCR", spec: "2× · ROX · 500 reacciones", cat: "Reactivos", lab: "Roche Diagnostics", stock: "disponible" },
      { name: "Aguja EMG concéntrica", spec: "26G · desechable · pack 25", cat: "Implementos quirúrgicos", lab: "MedSurg Supplies", stock: "disponible" },
      { name: "Crioviales 2 mL (x500)", spec: "PP · rosca externa · −196 °C", cat: "Materiales", lab: "LabWare BCN", stock: "disponible" },
      { name: "Tubos LCR (polipropileno)", spec: "Bajo binding · 15 mL · pack 50", cat: "Materiales", lab: "LabWare BCN", stock: "pedido" },
    ],
    samples: [
      { biobank: "Biobanc HUVH", city: "Barcelona", type: "ADN · LCR", n: 52, avail: "disponible" },
      { biobank: "Biobanco La Paz", city: "Madrid", type: "Suero · Plasma", n: 39, avail: "disponible" },
      { biobank: "Biobanco IBSAL", city: "Salamanca", type: "Línea celular (iPSC)", n: 24, avail: "bajo" },
      { biobank: "BioBank Navarra", city: "Pamplona", type: "Tejido medular (post-mortem)", n: 15, avail: "pedido" },
    ],
    papers: [
      { title: "Trial of antisense oligonucleotide tofersen for SOD1 ALS", authors: "Miller T. et al.", journal: "New England J. of Medicine", year: 2023, type: "Ensayo clínico" },
      { title: "C9orf72 repeat expansion: from biology to therapy", authors: "Balendra R. et al.", journal: "Nature Reviews Neurology", year: 2024, type: "Revisión" },
      { title: "Plasma neurofilament light as a biomarker in ALS", authors: "Benatar M. et al.", journal: "Annals of Neurology", year: 2024, type: "Cohorte" },
      { title: "iPSC motor neuron models reveal TDP-43 mislocalization", authors: "Fujimori K. et al.", journal: "Cell Stem Cell", year: 2025, type: "Preclínico" },
    ],
  },

  // ===== 6. Síndrome de Marfan ================================================
  {
    slug: "marfan",
    nombre: "Síndrome de Marfan",
    orpha: "558",
    icd10: "Q87.4",
    cromosoma: "15 (15q21.1)",
    prevalencia: "1 / 5.000",
    categoria: "Tejido conectivo",
    resumen:
      "Trastorno autosómico dominante del tejido conectivo por mutaciones en FBN1, con afectación esquelética, ocular y cardiovascular potencialmente grave.",
    gene: {
      gen: "FBN1",
      cromosoma: "15",
      locus: "15q21.1",
      herencia: "Autosómica dominante",
      omim: "154700",
    },
    clinical: [
      { sev: "alta", label: "Dilatación de la raíz aórtica", desc: "Riesgo de aneurisma y disección aórtica; principal causa de mortalidad." },
      { sev: "alta", label: "Luxación del cristalino", desc: "Ectopia lentis (ascendente), hallazgo ocular muy sugestivo." },
      { sev: "media", label: "Hábito marfanoide", desc: "Talla alta, aracnodactilia, dolicostenomelia y envergadura aumentada." },
      { sev: "media", label: "Deformidad torácica / escoliosis", desc: "Pectus excavatum o carinatum y curvaturas del raquis." },
      { sev: "media", label: "Ectasia dural", desc: "Dilatación del saco dural lumbosacro; criterio sistémico de Ghent." },
    ],
    treatments: [
      { name: "Betabloqueantes", phase: "Estándar de cuidado", status: "approved", note: "Reducen la velocidad de dilatación aórtica." },
      { name: "Losartán (ARA-II)", phase: "Aprobado (uso)", status: "approved", note: "Antagonismo de la vía TGF-β; adyuvante a betabloqueo." },
      { name: "Cirugía profiláctica de aorta", phase: "Estándar de cuidado", status: "approved", note: "Reemplazo de raíz aórtica según diámetro y ritmo de dilatación." },
      { name: "Inhibidores de TGF-β", phase: "Fase II", status: "trial", note: "Modulación dirigida de la señalización del tejido conectivo." },
    ],
    variants: [
      { hgvs: "c.4082G>A", protein: "p.Cys1361Tyr", type: "Missense", freq: "0.0007", patho: "Patogénica" },
      { hgvs: "c.3037G>A", protein: "p.Gly1013Arg", type: "Missense", freq: "0.0005", patho: "Patogénica" },
      { hgvs: "c.7754T>C", protein: "p.Ile2585Thr", type: "Missense", freq: "0.0004", patho: "Patogénica" },
      { hgvs: "c.2168_2169del", protein: "p.Gly723fs", type: "Frameshift", freq: "0.0003", patho: "Patogénica" },
      { hgvs: "c.1633C>T", protein: "p.Arg545Cys", type: "Missense", freq: "0.0006", patho: "Prob. patog." },
    ],
    diagnosis: {
      criterios: [
        { title: "Criterios de Ghent revisados", desc: "Combinan afectación aórtica, ectopia lentis, puntuación sistémica y antecedentes familiares." },
        { title: "Score sistémico", desc: "≥ 7 puntos apoya el diagnóstico en ausencia de criterio cardinal." },
        { title: "Confirmación molecular", desc: "Variante patogénica en FBN1 (o TGFBR1/2 para diagnóstico diferencial)." },
        { title: "Diferencial", desc: "Distinguir de Loeys-Dietz, Ehlers-Danlos vascular y MASS." },
      ],
      pruebas: [
        "Ecocardiograma (diámetro de raíz aórtica)",
        "Exploración oftalmológica con lámpara de hendidura",
        "Secuenciación de FBN1 (+ panel aortopatías)",
        "Resonancia/TAC de aorta completa",
        "Radiografía de columna (escoliosis, ectasia dural)",
      ],
      callout: "Tiempo medio al diagnóstico en la red: 3,3 meses; cribado cardiovascular familiar incluido.",
    },
    sourcing: [
      { name: "Panel NGS aortopatías", spec: "FBN1, TGFBR1/2, SMAD3 · cobertura 200×", cat: "Kits PCR", lab: "GenoTech Iberia", stock: "disponible" },
      { name: "Primers FBN1 (set x48)", spec: "Oligos HPLC · 25 nmol · Tm 60 °C", cat: "Reactivos", lab: "BioPrimers SL", stock: "bajo" },
      { name: "Master Mix qPCR", spec: "2× · ROX · 500 reacciones", cat: "Reactivos", lab: "Roche Diagnostics", stock: "disponible" },
      { name: "Kit extracción ADN sangre", spec: "Columna sílice · 200 µL · 250 prep", cat: "Kits PCR", lab: "Qiagen Iberia", stock: "disponible" },
      { name: "Placas 96 pocillos PCR", spec: "Skirted · grado óptico · pack 50", cat: "Materiales", lab: "LabWare BCN", stock: "disponible" },
      { name: "Set biopsia cutánea (punch)", spec: "4 mm · estéril · pack 25", cat: "Implementos quirúrgicos", lab: "MedSurg Supplies", stock: "pedido" },
    ],
    samples: [
      { biobank: "Biobanco La Paz", city: "Madrid", type: "ADN · Fibroblastos", n: 46, avail: "disponible" },
      { biobank: "Biobanco IDIBELL", city: "Barcelona", type: "Suero · ADN", n: 35, avail: "disponible" },
      { biobank: "Biobanc HUVH", city: "Barcelona", type: "Tejido aórtico", n: 19, avail: "bajo" },
      { biobank: "BioBank Navarra", city: "Pamplona", type: "Línea celular", n: 14, avail: "pedido" },
    ],
    papers: [
      { title: "Losartan versus atenolol in Marfan syndrome: long-term aortic outcomes", authors: "Lacro R. et al.", journal: "The Lancet", year: 2024, type: "Ensayo clínico" },
      { title: "Revised Ghent nosology: diagnostic performance in a large cohort", authors: "Loeys B. et al.", journal: "J. Med. Genetics", year: 2023, type: "Cohorte" },
      { title: "TGF-β signalling in FBN1-related aortopathy", authors: "Dietz H. et al.", journal: "Nature Reviews Cardiology", year: 2024, type: "Revisión" },
      { title: "FBN1 genotype-phenotype correlations and aortic risk", authors: "Arnaud P. et al.", journal: "Circulation", year: 2025, type: "Cohorte" },
    ],
  },

  // ===== 7. Síndrome de Down (Trisomía 21) ====================================
  {
    slug: "down",
    nombre: "Síndrome de Down",
    orpha: "870",
    icd10: "Q90",
    cromosoma: "21 (trisomía)",
    prevalencia: "1 / 700 nacimientos",
    categoria: "Cromosómica",
    resumen:
      "Trisomía del cromosoma 21: una copia extra total o parcial del cromosoma 21 que causa discapacidad intelectual y rasgos físicos característicos. Es la cromosomopatía más frecuente.",
    gene: {
      gen: "HSA21 · DSCR",
      cromosoma: "21",
      locus: "21q22.13",
      herencia: "Esporádica (no disyunción)",
      omim: "190685",
    },
    clinical: [
      { sev: "alta", label: "Discapacidad intelectual", desc: "De grado variable (leve a moderado); afecta sobre todo al lenguaje expresivo y al aprendizaje." },
      { sev: "alta", label: "Cardiopatía congénita", desc: "Presente en ~40–50%; el defecto del septo auriculoventricular es el más característico." },
      { sev: "media", label: "Hipotonía neonatal", desc: "Tono muscular disminuido al nacer; condiciona el desarrollo motor y la alimentación." },
      { sev: "media", label: "Rasgos craneofaciales", desc: "Epicanto, puente nasal plano, braquicefalia y protrusión lingual." },
      { sev: "alta", label: "Comorbilidades sistémicas", desc: "Riesgo aumentado de hipotiroidismo, leucemia infantil y enfermedad de Alzheimer precoz." },
    ],
    treatments: [
      { name: "Atención temprana / estimulación", phase: "Estándar de cuidado", status: "approved", note: "Programas multidisciplinares que mejoran el desarrollo cognitivo y motor." },
      { name: "Corrección quirúrgica cardíaca", phase: "Estándar de cuidado", status: "approved", note: "Reparación de los defectos del septo AV, habitualmente en el primer año de vida." },
      { name: "Moduladores cognitivos (GABA-A)", phase: "Fase II", status: "trial", note: "Antagonistas selectivos en estudio para mejorar la función ejecutiva." },
      { name: "Silenciamiento del cromosoma extra (XIST)", phase: "Preclínico", status: "trial", note: "Inactivación del cromosoma 21 supernumerario en líneas celulares." },
    ],
    variants: [
      { hgvs: "47,XX,+21", protein: "Trisomía libre", type: "No disyunción", freq: "0.95", patho: "Causal" },
      { hgvs: "46,XX,t(14;21)", protein: "Translocación", type: "Robertsoniana", freq: "0.030", patho: "Causal" },
      { hgvs: "46/47,+21", protein: "Mosaicismo", type: "Error mitótico", freq: "0.020", patho: "Causal" },
      { hgvs: "46,XX,t(21;21)", protein: "Translocación", type: "Isocromosoma", freq: "0.005", patho: "Causal" },
    ],
    diagnosis: {
      criterios: [
        { title: "Cribado prenatal combinado", desc: "Translucencia nucal ecográfica más bioquímica del primer trimestre estiman el riesgo." },
        { title: "Test prenatal no invasivo (NIPT)", desc: "ADN fetal libre en plasma materno con alta sensibilidad para trisomía 21." },
        { title: "Confirmación citogenética", desc: "Cariotipo (o QF-PCR/FISH) en amniocentesis, biopsia corial o sangre neonatal." },
        { title: "Valoración clínica postnatal", desc: "Rasgos dismórficos e hipotonía orientan el diagnóstico antes de la confirmación." },
      ],
      pruebas: [
        "NIPT (ADN fetal libre, cfDNA)",
        "Cariotipo de linfocitos",
        "QF-PCR / FISH para trisomía 21",
        "Ecocardiograma neonatal",
        "Cribado tiroideo y hematológico",
      ],
      callout: "Tiempo medio a la confirmación en la red: 1,5 meses; el NIPT se ofrece en el 100% de las gestaciones de riesgo.",
    },
    sourcing: [
      { name: "Kit QF-PCR aneuploidías", spec: "Cromosomas 13/18/21/X/Y · 50 muestras", cat: "Kits PCR", lab: "GenoTech Iberia", stock: "disponible" },
      { name: "Sondas FISH cromosoma 21", spec: "Locus 21q22 · marcaje fluorescente", cat: "Reactivos", lab: "Thermo Fisher", stock: "bajo" },
      { name: "Medio de cultivo de linfocitos", spec: "Cariotipo · PHA · 100 mL", cat: "Reactivos", lab: "Roche Diagnostics", stock: "disponible" },
      { name: "Kit extracción ADN fetal (cfDNA)", spec: "Plasma materno · 2 mL · 50 prep", cat: "Kits PCR", lab: "Qiagen Iberia", stock: "disponible" },
      { name: "Portaobjetos citogenética", spec: "Esmerilados · grado óptico · pack 100", cat: "Materiales", lab: "LabWare BCN", stock: "disponible" },
      { name: "Aguja de amniocentesis", spec: "22G · ecoguiada · estéril · individual", cat: "Implementos quirúrgicos", lab: "MedSurg Supplies", stock: "pedido" },
    ],
    samples: [
      { biobank: "Biobanco La Paz", city: "Madrid", type: "ADN · Linfocitos", n: 96, avail: "disponible" },
      { biobank: "Biobanco IDIBELL", city: "Barcelona", type: "Fibroblastos · iPSC", n: 64, avail: "disponible" },
      { biobank: "Biobanco IBSAL", city: "Salamanca", type: "Plasma materno (cfDNA)", n: 52, avail: "bajo" },
      { biobank: "BioBank Navarra", city: "Pamplona", type: "Línea celular", n: 33, avail: "pedido" },
    ],
    papers: [
      { title: "Prenatal cell-free DNA screening for trisomy 21: a performance review", authors: "Gil M. et al.", journal: "Ultrasound Obstet. Gynecol.", year: 2024, type: "Revisión" },
      { title: "Congenital heart disease outcomes in Down syndrome cohorts", authors: "Bull M. et al.", journal: "Pediatrics", year: 2023, type: "Cohorte" },
      { title: "XIST-mediated silencing of trisomy 21 in pluripotent stem cells", authors: "Jiang J. et al.", journal: "Nature", year: 2025, type: "Preclínico" },
      { title: "Alzheimer's disease biomarkers in adults with Down syndrome", authors: "Fortea J. et al.", journal: "The Lancet Neurology", year: 2024, type: "Cohorte" },
    ],
  },
];

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/** Devuelve la enfermedad por slug, o undefined si no existe. */
export function getDisease(slug: string): Disease | undefined {
  return diseases.find((d) => d.slug === slug);
}

/** Listado resumido para el buscador / tarjetas. */
export function listDiseases(): Disease[] {
  return diseases;
}

/** Total de muestras en red para una enfermedad (suma de biobancos). */
export function totalSamples(d: Disease): number {
  return d.samples.reduce((acc, s) => acc + s.n, 0);
}

/**
 * Formatea un entero con separador de miles "." (es-ES), de forma
 * independiente del ICU del entorno (Intl puede no agrupar en builds de Node
 * con ICU reducido).
 */
export function formatNum(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
