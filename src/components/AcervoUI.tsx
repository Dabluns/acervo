"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ArrowUpRight,
  BookMarked,
  BookOpen,
  Briefcase,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Cpu,
  DollarSign,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  Flame,
  FolderOpen,
  Globe,
  GraduationCap,
  LayoutGrid,
  Library,
  Link2,
  LogOut,
  Mail,
  Megaphone,
  Monitor,
  Moon,
  MousePointer,
  Package,
  Palette,
  PenLine,
  Search,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Star,
  Sun,
  TrendingUp,
  Trophy,
  Users,
  Video,
  Wrench,
  X,
  Zap,
} from "lucide-react"
import type { Category, Product } from "@/lib/acervo-db"
import { useTheme } from "@/components/ThemeProvider"
import { WarpLogo } from "@/components/WarpLogo"
import { AuraButton } from "@/components/AuraButton"
import { MembersHeader } from "@/components/MembersHeader"
import { ExpiryWarningBanner } from "@/components/ExpiryWarningBanner"

type SidebarGroup = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>
  children: string[]
}

type Accent = {
  pill: string
  pillSoft: string
  text: string
  iconWrap: string
  iconText: string
  border: string
  glow: string
}

type SignalChip = {
  key: string
  label: string
  short: string
  icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>
  tone: string
  toneSoft: string
  toneBorder: string
}

type SmartSection = {
  id: string
  label: string
  description: string
  icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>
  categoryIds?: string[]
  types?: Product["type"][]
  keywords: string[]
  tone: string
  bg: string
  border: string
}

type SmartSectionWithCount = SmartSection & {
  count: number
}

const SIDEBAR_GROUPS: SidebarGroup[] = [
  { id: "g-cursos", label: "Cursos", icon: GraduationCap, children: ["cursos-gerais", "estrangeiros", "pessoal", "mindset", "concursos", "linguagem"] },
  { id: "g-criativo", label: "Criativo", icon: Palette, children: ["design", "designer", "edicao", "edicao-utils", "dublagem-voz", "branding-marca", "tiktok", "social-media"] },
  { id: "g-marketing", label: "Marketing & Vendas", icon: Megaphone, children: ["marketing", "trafego", "copywriting", "vendas-script", "email-marketing", "mkt-afiliados", "afiliados", "landing-pages", "infoprodutos", "leads-contatos"] },
  { id: "g-tech", label: "Tecnologia", icon: Cpu, children: ["automacao", "ia-prompts", "inteligencia-artificial", "programacao", "softwares-apks", "hacking", "eletronica"] },
  { id: "g-negocios", label: "Negocios & Financas", icon: DollarSign, children: ["financas", "crypto", "dolar", "dropshipping", "dropshipping-utils", "marketplaces", "agencias-empresas"] },
  { id: "g-materiais", label: "Materiais", icon: BookMarked, children: ["pdfs", "planilhas", "plr", "contratos", "dicas", "office"] },
  { id: "g-especiais", label: "Especiais", icon: Flame, children: ["hot", "black", "black-rat", "apostas-cassino", "estetica", "jogos-consoles"] },
]

const GROUP_BY_CATEGORY = SIDEBAR_GROUPS.reduce<Record<string, string>>((map, group) => {
  for (const child of group.children) map[child] = group.id
  return map
}, {})

const TYPE_META: Record<
  Product["type"],
  {
    label: string
    icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>
  }
> = {
  curso: { label: "Curso", icon: GraduationCap },
  planilha: { label: "Planilha", icon: FileSpreadsheet },
  pdf: { label: "PDF", icon: FileText },
  ebook: { label: "E-book", icon: BookOpen },
  template: { label: "Template", icon: LayoutGrid },
  ferramenta: { label: "Ferramenta", icon: Wrench },
  infoproduto: { label: "Infoproduto", icon: Package },
}

const ACCENTS: Record<string, Accent> = {
  fuchsia: {
    pill: "bg-warp-400/16",
    pillSoft: "bg-warp-400/10 text-warp-200",
    text: "text-warp-300",
    iconWrap: "bg-warp-400/14",
    iconText: "text-warp-300",
    border: "border-warp-400/30",
    glow: "shadow-[0_0_40px_rgba(119,61,255,0.18)]",
  },
  purple: {
    pill: "bg-warp-400/16",
    pillSoft: "bg-warp-400/10 text-warp-200",
    text: "text-warp-300",
    iconWrap: "bg-warp-400/14",
    iconText: "text-warp-300",
    border: "border-warp-400/30",
    glow: "shadow-[0_0_40px_rgba(76,0,255,0.16)]",
  },
  pink: {
    pill: "bg-pink-400/16",
    pillSoft: "bg-pink-400/10 text-pink-200",
    text: "text-pink-300",
    iconWrap: "bg-pink-400/14",
    iconText: "text-pink-300",
    border: "border-pink-400/30",
    glow: "shadow-[0_0_40px_rgba(236,72,153,0.16)]",
  },
  violet: {
    pill: "bg-violet-400/16",
    pillSoft: "bg-violet-400/10 text-violet-200",
    text: "text-violet-300",
    iconWrap: "bg-violet-400/14",
    iconText: "text-violet-300",
    border: "border-violet-400/30",
    glow: "shadow-[0_0_40px_rgba(167,139,250,0.16)]",
  },
  indigo: {
    pill: "bg-indigo-400/16",
    pillSoft: "bg-indigo-400/10 text-indigo-200",
    text: "text-indigo-300",
    iconWrap: "bg-indigo-400/14",
    iconText: "text-indigo-300",
    border: "border-indigo-400/30",
    glow: "shadow-[0_0_40px_rgba(99,102,241,0.16)]",
  },
  rose: {
    pill: "bg-rose-400/16",
    pillSoft: "bg-rose-400/10 text-rose-200",
    text: "text-rose-300",
    iconWrap: "bg-rose-400/14",
    iconText: "text-rose-300",
    border: "border-rose-400/30",
    glow: "shadow-[0_0_40px_rgba(244,63,94,0.16)]",
  }
}

const COLOR_KEYS = Object.keys(ACCENTS)
const ALL_CATEGORY_ID = "all"
const ALL_SMART_SECTION_ID = "all"
const UNCATEGORIZED_SMART_SECTION_ID = "outros-segmentos"
const INITIAL_VISIBLE = 48

const UNCATEGORIZED_SMART_SECTION: SmartSection = {
  id: UNCATEGORIZED_SMART_SECTION_ID,
  label: "Outros segmentos",
  description: "Itens preservados que nao bateram em palavras-chave especificas.",
  icon: FolderOpen,
  keywords: [],
  tone: "text-slate-200",
  bg: "bg-slate-400/10",
  border: "border-slate-400/24",
}

const MOTION_CARD_THEMES = [
  {
    bg: "from-warp-600 via-warp-600 to-indigo-600",
    panel: "bg-warp-950/24",
    glow: "bg-warp-200/24",
  },
  {
    bg: "from-warp-600 via-violet-600 to-warp-600",
    panel: "bg-warp-950/24",
    glow: "bg-warp-200/24",
  },
  {
    bg: "from-indigo-600 via-warp-600 to-warp-600",
    panel: "bg-indigo-950/24",
    glow: "bg-violet-200/24",
  },
  {
    bg: "from-pink-600 via-rose-600 to-warp-600",
    panel: "bg-pink-950/24",
    glow: "bg-rose-200/24",
  },
  {
    bg: "from-warp-500 via-pink-500 to-warp-500",
    panel: "bg-warp-950/24",
    glow: "bg-pink-200/24",
  },
  {
    bg: "from-violet-500 via-indigo-500 to-warp-500",
    panel: "bg-violet-950/24",
    glow: "bg-indigo-200/24",
  },
]

const SMART_SECTIONS: SmartSection[] = [
  { id: "chatgpt-prompts", label: "ChatGPT & Prompts", description: "Comandos, prompts, agentes e bibliotecas de IA.", icon: Sparkles, categoryIds: ["ia-prompts", "inteligencia-artificial"], keywords: ["chatgpt", "prompt", "prompts", "comandos", "midjourney", "agente", "inteligencia artificial"], tone: "text-warp-200", bg: "bg-warp-400/10", border: "border-warp-400/24" },
  { id: "automacao-bots", label: "Automacao & Bots", description: "Fluxos, bots, ferramentas e produtividade automatizada.", icon: Zap, categoryIds: ["automacao"], keywords: ["automacao", "bot", "robô", "robo", "workflow", "n8n", "zapier", "automatizar"], tone: "text-emerald-200", bg: "bg-emerald-400/10", border: "border-emerald-400/24" },
  { id: "canva-social", label: "Canva & Social", description: "Templates editaveis para posts, stories e criativos.", icon: Palette, categoryIds: ["social-media", "tiktok"], keywords: ["canva", "instagram", "stories", "post", "social media", "feed", "tiktok", "criativo"], tone: "text-warp-200", bg: "bg-warp-400/10", border: "border-warp-400/24" },
  { id: "photoshop-psd", label: "Photoshop & PSD", description: "Arquivos PSD, edicoes, mockups e design profissional.", icon: FileImage, categoryIds: ["design", "designer"], keywords: ["photoshop", "psd", "mockup", "png", "jpg", "imagem", "artes", "editavel"], tone: "text-blue-200", bg: "bg-blue-400/10", border: "border-blue-400/24" },
  { id: "freepik-assets", label: "Freepik & Bancos", description: "Bancos de imagens, vetores, elementos e packs visuais.", icon: Sparkles, categoryIds: ["design"], keywords: ["freepik", "banco de imagem", "vetor", "element", "graphic", "asset", "pack visual"], tone: "text-violet-200", bg: "bg-violet-400/10", border: "border-violet-400/24" },
  { id: "video-edicao", label: "Video & Edicao", description: "Aulas, reels, presets, packs e edicao de videos.", icon: Clapperboard, categoryIds: ["edicao", "edicao-utils", "dublagem-voz"], keywords: ["video", "videos", "reels", "shorts", "youtube", "premiere", "after effects", "capcut", "dublagem", "voz"], tone: "text-orange-200", bg: "bg-orange-400/10", border: "border-orange-400/24" },
  { id: "copy-vendas", label: "Copy & Vendas", description: "Scripts, ofertas, persuasao e materiais comerciais.", icon: PenLine, categoryIds: ["copywriting", "vendas-script"], keywords: ["copy", "copywriting", "vendas", "script", "oferta", "persuasao", "cliente", "negociacao"], tone: "text-amber-200", bg: "bg-amber-400/10", border: "border-amber-400/24" },
  { id: "trafego-ads", label: "Trafego & Ads", description: "Facebook Ads, Google Ads, funis e campanhas.", icon: MousePointer, categoryIds: ["trafego", "marketing"], keywords: ["trafego", "ads", "facebook ads", "google ads", "meta ads", "campanha", "funil", "anuncio"], tone: "text-orange-200", bg: "bg-orange-400/10", border: "border-orange-400/24" },
  { id: "afiliados-info", label: "Afiliados & Infoprodutos", description: "Hotmart, produtor, afiliacao, funis e produtos digitais.", icon: Users, categoryIds: ["mkt-afiliados", "afiliados", "infoprodutos"], keywords: ["afiliado", "afiliados", "hotmart", "kiwify", "monetizze", "infoproduto", "produto digital"], tone: "text-violet-200", bg: "bg-violet-400/10", border: "border-violet-400/24" },
  { id: "leads-email", label: "Leads & Email", description: "Bases, contatos, email marketing e captacao.", icon: Mail, categoryIds: ["leads-contatos", "email-marketing", "landing-pages"], keywords: ["lead", "leads", "contatos", "email", "newsletter", "landing page", "captura"], tone: "text-cyan-200", bg: "bg-cyan-400/10", border: "border-cyan-400/24" },
  { id: "programacao-dev", label: "Programacao & Dev", description: "Codigo, linguagens, desenvolvimento e projetos.", icon: Monitor, categoryIds: ["programacao"], keywords: ["programacao", "codigo", "python", "javascript", "html", "css", "react", "node", "dev"], tone: "text-cyan-200", bg: "bg-cyan-400/10", border: "border-cyan-400/24" },
  { id: "softwares-apks", label: "Softwares & APKs", description: "Apps, ferramentas, utilitarios e pacotes instalaveis.", icon: Wrench, categoryIds: ["softwares-apks"], types: ["ferramenta"], keywords: ["software", "apk", "app", "ferramenta", "plugin", "extensao", "utilitario"], tone: "text-emerald-200", bg: "bg-emerald-400/10", border: "border-emerald-400/24" },
  { id: "hacking-seguranca", label: "Hacking & Seguranca", description: "Hacking, seguranca, tecnicas e laboratorios.", icon: Cpu, categoryIds: ["hacking"], keywords: ["hacking", "seguranca", "pentest", "kali", "hack", "vulnerabilidade"], tone: "text-rose-200", bg: "bg-rose-400/10", border: "border-rose-400/24" },
  { id: "planilhas-excel", label: "Planilhas & Excel", description: "Excel, dashboards, controles e modelos prontos.", icon: FileSpreadsheet, categoryIds: ["planilhas", "office"], types: ["planilha"], keywords: ["planilha", "excel", "dashboard", "controle", "sheet", "csv", "xlsx"], tone: "text-emerald-200", bg: "bg-emerald-400/10", border: "border-emerald-400/24" },
  { id: "pdf-ebooks", label: "PDFs & E-books", description: "Livros, guias, apostilas e documentos digitais.", icon: BookOpen, categoryIds: ["pdfs"], types: ["pdf", "ebook"], keywords: ["pdf", "ebook", "e-book", "livro", "apostila", "guia", "manual"], tone: "text-blue-200", bg: "bg-blue-400/10", border: "border-blue-400/24" },
  { id: "plr-contratos", label: "PLR & Contratos", description: "Pacotes PLR, contratos, modelos e documentos.", icon: FileText, categoryIds: ["plr", "contratos"], keywords: ["plr", "contrato", "modelo", "documento", "termo", "licenca"], tone: "text-slate-200", bg: "bg-slate-400/10", border: "border-slate-400/24" },
  { id: "financas-crypto", label: "Financas & Crypto", description: "Investimentos, dolar, cripto, renda e dinheiro.", icon: DollarSign, categoryIds: ["financas", "crypto", "dolar"], keywords: ["financa", "invest", "crypto", "bitcoin", "dolar", "dinheiro", "renda"], tone: "text-emerald-200", bg: "bg-emerald-400/10", border: "border-emerald-400/24" },
  { id: "ecommerce-dropshipping", label: "E-commerce & Dropshipping", description: "Lojas, marketplace, produtos e operacao online.", icon: ShoppingCart, categoryIds: ["dropshipping", "dropshipping-utils", "marketplaces"], keywords: ["dropshipping", "ecommerce", "e-commerce", "marketplace", "loja", "shopify", "produto"], tone: "text-teal-200", bg: "bg-teal-400/10", border: "border-teal-400/24" },
  { id: "agencias-negocios", label: "Agencias & Negocios", description: "Empresas, agencias, operacao e modelos de negocio.", icon: Briefcase, categoryIds: ["agencias-empresas"], keywords: ["agencia", "empresa", "negocio", "gestao", "operacao", "consultoria"], tone: "text-cyan-200", bg: "bg-cyan-400/10", border: "border-cyan-400/24" },
  { id: "concursos-idiomas", label: "Concursos & Idiomas", description: "Concursos, linguagem, ingles e estudo estruturado.", icon: Trophy, categoryIds: ["concursos", "linguagem", "estrangeiros"], keywords: ["concurso", "idioma", "ingles", "linguagem", "enem", "prova", "estudo"], tone: "text-amber-200", bg: "bg-amber-400/10", border: "border-amber-400/24" },
  { id: "mindset-pessoal", label: "Mindset & Pessoal", description: "Desenvolvimento pessoal, produtividade e mentalidade.", icon: Star, categoryIds: ["pessoal", "mindset"], keywords: ["mindset", "desenvolvimento pessoal", "produtividade", "habito", "mentalidade"], tone: "text-orange-200", bg: "bg-orange-400/10", border: "border-orange-400/24" },
  { id: "dados-bi", label: "Dados & BI", description: "Power BI, dashboards, metricas, analytics e data driven.", icon: TrendingUp, keywords: ["power bi", "dashboard", "analytics", "data", "dados", "metricas", "kpi", "business intelligence"], tone: "text-cyan-200", bg: "bg-cyan-400/10", border: "border-cyan-400/24" },
  { id: "youtube-criadores", label: "YouTube & Criadores", description: "Canais, thumbnails, conteudo, gravacao e crescimento.", icon: Video, keywords: ["youtube", "thumbnail", "criador", "creator", "canal", "gravacao", "conteudo", "views"], tone: "text-rose-200", bg: "bg-rose-400/10", border: "border-rose-400/24" },
  { id: "audio-sfx", label: "Audio & SFX", description: "Musicas, efeitos sonoros, voz, locucao e audio.", icon: Clapperboard, keywords: ["audio", "sfx", "sound", "musica", "trilha", "efeito sonoro", "locucao", "voz"], tone: "text-violet-200", bg: "bg-violet-400/10", border: "border-violet-400/24" },
  { id: "fotografia-imagem", label: "Fotografia & Imagem", description: "Fotos, Lightroom, perfil, imagem e composicao visual.", icon: FileImage, keywords: ["fotografia", "foto", "lightroom", "perfil", "ensaio", "imagem", "camera", "preset"], tone: "text-blue-200", bg: "bg-blue-400/10", border: "border-blue-400/24" },
  { id: "restaurantes-food", label: "Restaurantes & Food", description: "Food, restaurantes, delivery, cardapios e gastronomia.", icon: ShoppingCart, keywords: ["restaurante", "food", "delivery", "cardapio", "gastronomia", "culinaria", "receita", "comida"], tone: "text-orange-200", bg: "bg-orange-400/10", border: "border-orange-400/24" },
  { id: "juridico-imobiliario", label: "Juridico & Imobiliario", description: "Advocacia, contratos, imoveis, corretores e mercado local.", icon: Briefcase, keywords: ["advocacia", "advogado", "juridico", "direito", "imovel", "imoveis", "imobiliario", "corretor"], tone: "text-slate-200", bg: "bg-slate-400/10", border: "border-slate-400/24" },
  { id: "educacao-professores", label: "Educacao & Professores", description: "Aulas, professores, escola, infantil e material didatico.", icon: BookOpen, keywords: ["professor", "professores", "educacao", "escola", "infantil", "crianca", "didatico", "aula"], tone: "text-warp-200", bg: "bg-warp-400/10", border: "border-warp-400/24" },
  { id: "produtividade-gestao", label: "Produtividade & Gestao", description: "Organizacao, processos, gestao, produtividade e operacao.", icon: LayoutGrid, keywords: ["produtividade", "gestao", "organizacao", "processo", "processos", "operacao", "notion", "trello"], tone: "text-emerald-200", bg: "bg-emerald-400/10", border: "border-emerald-400/24" },
  { id: "games-hot", label: "Games, Hot & Especiais", description: "Jogos, apostas, black, hot e colecoes especiais.", icon: Flame, categoryIds: ["jogos-consoles", "apostas-cassino", "black", "black-rat", "hot"], keywords: ["jogo", "games", "cassino", "aposta", "black", "hot", "rat"], tone: "text-rose-200", bg: "bg-rose-400/10", border: "border-rose-400/24" },
  { id: "estetica-saude", label: "Estetica & Nichos", description: "Estetica, beleza, saude e mercados especificos.", icon: Sparkles, categoryIds: ["estetica"], keywords: ["estetica", "beleza", "saude", "skin", "clinica"], tone: "text-pink-200", bg: "bg-pink-400/10", border: "border-pink-400/24" },
  { id: "formacoes-mentorias", label: "Formacoes & Mentorias", description: "Treinamentos, mentorias e jornadas completas.", icon: GraduationCap, categoryIds: ["cursos-gerais"], keywords: ["formacao", "treinamento", "mentoria", "masterclass", "imersao", "workshop"], tone: "text-warp-200", bg: "bg-warp-400/10", border: "border-warp-400/24" },
]

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ")
}

function getMotionCardTheme(categoryName: string, product: Product, signals: SignalChip[], index: number) {
  const key = getProductSearchText(product, categoryName)
  const signalKeys = signals.map((signal) => signal.key).join(" ")

  if (/canva|freepik|figma|psd|photoshop|mockup|design|template|image/.test(`${key} ${signalKeys}`)) return MOTION_CARD_THEMES[2]
  if (/video|youtube|reels|shorts|edicao|premiere|capcut/.test(`${key} ${signalKeys}`)) return MOTION_CARD_THEMES[0]
  if (/planilha|excel|sheet|csv|financa|crypto|dropshipping|ecommerce/.test(`${key} ${signalKeys}`)) return MOTION_CARD_THEMES[4]
  if (/pdf|ebook|livro|apostila|contrato|plr/.test(`${key} ${signalKeys}`)) return MOTION_CARD_THEMES[3]
  if (/software|apk|app|ferramenta|programacao|codigo|hacking|automacao/.test(`${key} ${signalKeys}`)) return MOTION_CARD_THEMES[1]
  if (/marketing|venda|copy|trafego|afiliado|lead|email/.test(`${key} ${signalKeys}`)) return MOTION_CARD_THEMES[0]
  if (/curso|aula|formacao|mentoria/.test(`${key} ${signalKeys}`)) return MOTION_CARD_THEMES[1]
  return MOTION_CARD_THEMES[index % MOTION_CARD_THEMES.length]
}

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

function getProductSearchText(product: Product, categoryName: string) {
  return normalizeSearchText(`${product.name} ${product.description ?? ""} ${product.file_url ?? ""} ${categoryName} ${product.type}`)
}

function productMatchesSmartSection(product: Product, section: SmartSection, categoriesById: Record<string, Category>): boolean {
  if (section.id === UNCATEGORIZED_SMART_SECTION_ID) {
    return !SMART_SECTIONS.some((smartSection) => productMatchesSmartSection(product, smartSection, categoriesById))
  }

  if (section.types?.includes(product.type)) return true

  const categoryName = categoriesById[product.category_id]?.name ?? ""
  const searchText = getProductSearchText(product, categoryName)
  return section.keywords.some((keyword) => searchText.includes(normalizeSearchText(keyword)))
}

function getSmartSectionStatsForProducts(sourceProducts: Product[], categoriesById: Record<string, Category>): SmartSectionWithCount[] {
  const stats = SMART_SECTIONS
    .map((section) => ({
      ...section,
      count: sourceProducts.filter((product) => productMatchesSmartSection(product, section, categoriesById)).length,
    }))
    .filter((section) => section.count > 0)

  const uncategorizedCount = sourceProducts.filter((product) => productMatchesSmartSection(product, UNCATEGORIZED_SMART_SECTION, categoriesById)).length
  if (uncategorizedCount > 0) {
    stats.push({ ...UNCATEGORIZED_SMART_SECTION, count: uncategorizedCount })
  }

  return stats.sort((a, b) => b.count - a.count)
}

function getCategoryColor(name: string): Accent {
  const n = name.toLowerCase()
  if (n.includes("afilia")) return ACCENTS.violet
  if (n.includes("agencia") || n.includes("empresa")) return ACCENTS.fuchsia
  if (n.includes("aposta") || n.includes("cassin") || n.includes("jogo")) return ACCENTS.rose
  if (n.includes("automacao") || n.includes("bot")) return ACCENTS.pink
  if (n.includes("branding") || n.includes("marketing")) return ACCENTS.violet
  if (n.includes("concurso")) return ACCENTS.violet
  if (n.includes("contrat")) return ACCENTS.fuchsia
  if (n.includes("copy")) return ACCENTS.violet
  if (n.includes("crypto") || n.includes("bitcoin")) return ACCENTS.violet
  if (n.includes("curso") || n.includes("course")) return ACCENTS.fuchsia
  if (n.includes("design")) return ACCENTS.rose
  if (n.includes("ecomm") || n.includes("dropship") || n.includes("loja")) return ACCENTS.pink
  if (n.includes("financ") || n.includes("invest")) return ACCENTS.pink
  if (n.includes("planilha")) return ACCENTS.fuchsia
  if (n.includes("trafego") || n.includes("ads")) return ACCENTS.purple
  if (n.includes("email")) return ACCENTS.fuchsia
  if (n.includes("template")) return ACCENTS.violet
  if (n.includes("video") || n.includes("youtube")) return ACCENTS.rose
  if (n.includes("instagram") || n.includes("social")) return ACCENTS.rose
  if (n.includes("ferramenta")) return ACCENTS.pink
  if (n.includes("black")) return ACCENTS.violet
  if (n.includes("estrang") || n.includes("global") || n.includes("internacional")) return ACCENTS.fuchsia
  if (n.includes("infoprod")) return ACCENTS.fuchsia
  if (n.includes("ebook") || n.includes("livro")) return ACCENTS.fuchsia

  let hash = 0
  for (const char of n) hash = (hash * 31 + char.charCodeAt(0)) | 0
  return ACCENTS[COLOR_KEYS[Math.abs(hash) % COLOR_KEYS.length]]
}

function CategoryIcon({
  name,
  className,
  size,
  strokeWidth,
}: {
  name: string
  className?: string
  size?: number
  strokeWidth?: number
}) {
  const iconProps = { className, size, strokeWidth }
  const n = name.toLowerCase()

  if (n.includes("afilia")) return <Users {...iconProps} />
  if (n.includes("agencia") || n.includes("empresa")) return <Briefcase {...iconProps} />
  if (n.includes("aposta") || n.includes("cassin") || n.includes("jogo")) return <Star {...iconProps} />
  if (n.includes("automacao") || n.includes("bot")) return <Zap {...iconProps} />
  if (n.includes("branding") || n.includes("marketing")) return <Megaphone {...iconProps} />
  if (n.includes("concurso")) return <Trophy {...iconProps} />
  if (n.includes("contrat")) return <FileText {...iconProps} />
  if (n.includes("copy")) return <PenLine {...iconProps} />
  if (n.includes("crypto") || n.includes("bitcoin")) return <TrendingUp {...iconProps} />
  if (n.includes("curso") || n.includes("course")) return <GraduationCap {...iconProps} />
  if (n.includes("design")) return <Palette {...iconProps} />
  if (n.includes("ecomm") || n.includes("dropship") || n.includes("loja")) return <ShoppingCart {...iconProps} />
  if (n.includes("financ") || n.includes("invest")) return <DollarSign {...iconProps} />
  if (n.includes("planilha")) return <LayoutGrid {...iconProps} />
  if (n.includes("trafego") || n.includes("ads")) return <MousePointer {...iconProps} />
  if (n.includes("email")) return <Mail {...iconProps} />
  if (n.includes("black")) return <Monitor {...iconProps} />
  if (n.includes("estrang") || n.includes("global") || n.includes("internacional")) return <Globe {...iconProps} />
  if (n.includes("infoprod")) return <Package {...iconProps} />
  if (n.includes("ebook") || n.includes("livro")) return <BookOpen {...iconProps} />
  if (n.includes("video") || n.includes("youtube")) return <Video {...iconProps} />
  if (n.includes("instagram") || n.includes("social")) return <Smartphone {...iconProps} />
  if (n.includes("ferramenta")) return <Wrench {...iconProps} />
  return <FolderOpen {...iconProps} />
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debounced
}

function getSignalChips(product: Product): SignalChip[] {
  const searchBase = `${product.name} ${product.description ?? ""} ${product.file_url ?? ""}`.toLowerCase()
  const chips: SignalChip[] = []

  const addChip = (chip: SignalChip, condition: boolean) => {
    if (condition && !chips.some((item) => item.key === chip.key)) chips.push(chip)
  }

  addChip(
    {
      key: "pdf",
      label: "PDF",
      short: "PDF",
      icon: FileText,
      tone: "text-rose-300",
      toneSoft: "bg-rose-400/12",
      toneBorder: "border-rose-400/20",
    },
    product.type === "pdf" || searchBase.includes(".pdf") || /\bpdf\b/.test(searchBase),
  )

  addChip(
    {
      key: "video",
      label: "Video",
      short: "VIDEO",
      icon: Clapperboard,
      tone: "text-violet-200",
      toneSoft: "bg-violet-400/12",
      toneBorder: "border-violet-400/20",
    },
    /\bvideo\b|\bvideos\b|\.mp4|youtube|vimeo|aula|gravacao/.test(searchBase),
  )

  addChip(
    {
      key: "freepik",
      label: "Freepik",
      short: "FREEPIK",
      icon: Sparkles,
      tone: "text-warp-200",
      toneSoft: "bg-warp-400/12",
      toneBorder: "border-warp-400/20",
    },
    searchBase.includes("freepik"),
  )

  addChip(
    {
      key: "canva",
      label: "Canva",
      short: "CANVA",
      icon: Palette,
      tone: "text-cyan-200",
      toneSoft: "bg-cyan-400/12",
      toneBorder: "border-cyan-400/20",
    },
    searchBase.includes("canva"),
  )

  addChip(
    {
      key: "figma",
      label: "Figma",
      short: "FIGMA",
      icon: LayoutGrid,
      tone: "text-orange-200",
      toneSoft: "bg-orange-400/12",
      toneBorder: "border-orange-400/20",
    },
    searchBase.includes("figma"),
  )

  addChip(
    {
      key: "sheet",
      label: "Planilha",
      short: "SHEET",
      icon: FileSpreadsheet,
      tone: "text-emerald-200",
      toneSoft: "bg-emerald-400/12",
      toneBorder: "border-emerald-400/20",
    },
    product.type === "planilha" || /\.xls|\.xlsx|planilha|sheet|csv/.test(searchBase),
  )

  addChip(
    {
      key: "slides",
      label: "Slides",
      short: "PPT",
      icon: LayoutGrid,
      tone: "text-amber-200",
      toneSoft: "bg-amber-400/12",
      toneBorder: "border-amber-400/20",
    },
    /powerpoint|slides|\.ppt|\.pptx/.test(searchBase),
  )

  addChip(
    {
      key: "pack",
      label: "Pack",
      short: "ZIP",
      icon: FileArchive,
      tone: "text-orange-200",
      toneSoft: "bg-orange-400/12",
      toneBorder: "border-orange-400/20",
    },
    /\.zip|\.rar|bundle|pack/.test(searchBase),
  )

  addChip(
    {
      key: "image",
      label: "Imagem",
      short: "PNG",
      icon: FileImage,
      tone: "text-blue-200",
      toneSoft: "bg-blue-400/12",
      toneBorder: "border-blue-400/20",
    },
    /\.png|\.jpg|\.jpeg|mockup|imagem/.test(searchBase),
  )

  addChip(
    {
      key: "tool",
      label: "Ferramenta",
      short: "APP",
      icon: Link2,
      tone: "text-emerald-200",
      toneSoft: "bg-emerald-400/12",
      toneBorder: "border-emerald-400/20",
    },
    product.type === "ferramenta" || /software|ferramenta|apk|app|saas/.test(searchBase),
  )

  if (chips.length === 0) {
    const fallbackByType: Record<Product["type"], SignalChip> = {
      curso: {
        key: "curso",
        label: "Curso",
        short: "CURSO",
        icon: GraduationCap,
        tone: "text-warp-200",
        toneSoft: "bg-warp-400/12",
        toneBorder: "border-warp-400/20",
      },
      planilha: {
        key: "planilha",
        label: "Planilha",
        short: "SHEET",
        icon: FileSpreadsheet,
        tone: "text-emerald-200",
        toneSoft: "bg-emerald-400/12",
        toneBorder: "border-emerald-400/20",
      },
      pdf: {
        key: "pdf",
        label: "PDF",
        short: "PDF",
        icon: FileText,
        tone: "text-rose-300",
        toneSoft: "bg-rose-400/12",
        toneBorder: "border-rose-400/20",
      },
      ebook: {
        key: "ebook",
        label: "E-book",
        short: "EBOOK",
        icon: BookOpen,
        tone: "text-blue-200",
        toneSoft: "bg-blue-400/12",
        toneBorder: "border-blue-400/20",
      },
      template: {
        key: "template",
        label: "Template",
        short: "TPL",
        icon: LayoutGrid,
        tone: "text-cyan-200",
        toneSoft: "bg-cyan-400/12",
        toneBorder: "border-cyan-400/20",
      },
      ferramenta: {
        key: "ferramenta",
        label: "Ferramenta",
        short: "APP",
        icon: Wrench,
        tone: "text-emerald-200",
        toneSoft: "bg-emerald-400/12",
        toneBorder: "border-emerald-400/20",
      },
      infoproduto: {
        key: "infoproduto",
        label: "Infoproduto",
        short: "INFO",
        icon: Package,
        tone: "text-violet-200",
        toneSoft: "bg-violet-400/12",
        toneBorder: "border-violet-400/20",
      },
    }
    chips.push(fallbackByType[product.type])
  }

  return chips.slice(0, 3)
}

function ProductCard({
  product,
  index,
  accent,
  categoryName,
  onPreview,
}: {
  product: Product
  index: number
  accent: Accent
  categoryName: string
  onPreview: (product: Product) => void
}) {
  const typeMeta = TYPE_META[product.type]
  const TypeIcon = typeMeta.icon
  const signals = getSignalChips(product)
  const motionTheme = getMotionCardTheme(categoryName, product, signals, index)
  const hasBanner = Boolean(product.banner_url)

  return (
    <article
      className={cn(
        "card-fade-in glass-card group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[18px] border border-white/10 p-3",
        "bg-[linear-gradient(180deg,rgba(10,17,33,0.96),rgba(7,10,20,0.92))]",
        "shadow-[0_20px_60px_rgba(2,6,23,0.45)]",
        accent.glow,
      )}
      style={{ animationDelay: `${Math.min(index * 40, 420)}ms` }}
      onClick={() => onPreview(product)}
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/28 to-transparent" />

      <div className={cn("relative aspect-video overflow-hidden rounded-[16px] border border-white/10", hasBanner ? "bg-slate-950" : cn("bg-gradient-to-br", motionTheme.bg))}>
        {product.banner_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.banner_url}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
            loading="lazy"
            decoding="async"
            onError={(event) => {
              ;(event.currentTarget as HTMLImageElement).style.display = "none"
            }}
          />
        )}
        <div className={cn("absolute inset-0", hasBanner ? "bg-[linear-gradient(180deg,rgba(2,6,23,0.06),rgba(2,6,23,0.22)_48%,rgba(2,6,23,0.54))]" : "bg-transparent")} />
        <div className={cn("absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.42)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.42)_1px,transparent_1px)] [background-size:18px_18px]", hasBanner ? "opacity-[0.08]" : "opacity-[0.18]")} />
        <div className="absolute inset-3 rounded-[14px] border border-white/24" />
        <div className="absolute -left-10 top-4 h-24 w-[125%] rotate-[12deg] bg-white/16 blur-[1px]" />
        <div className="absolute -right-12 bottom-8 h-px w-[120%] -rotate-[14deg] bg-white/42" />
        <div className={cn("absolute left-1/2 top-1/2 h-[84%] w-[62%] min-w-60 -translate-x-1/2 -translate-y-1/2 rounded-[20px] border border-white/18 shadow-[0_24px_70px_rgba(2,6,23,0.28)] backdrop-blur-md", hasBanner ? "bg-slate-950/28" : motionTheme.panel)}>
          <div className={cn("absolute inset-x-8 top-7 h-24 rounded-full blur-3xl", motionTheme.glow)} />
          <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="mb-5 flex justify-center">
              <WarpLogo className="h-16 w-16 text-warp-400 drop-shadow-[0_10px_22px_rgba(119,61,255,0.46)]" />
            </div>
            <p className="clamp-1 text-[18px] font-black uppercase tracking-[0.28em] text-white">{signals[0]?.short ?? typeMeta.label}</p>
            <div className="my-2 h-px w-24 bg-white/24" />
            <p className="clamp-1 text-[9px] font-black uppercase tracking-[0.22em] text-white/78">{categoryName}</p>
          </div>
        </div>
        <span className="absolute bottom-4 right-4 rounded-[6px] bg-black/35 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-white shadow-[0_10px_24px_rgba(2,6,23,0.22)] backdrop-blur">
          Editavel
        </span>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <div className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]", accent.border, accent.pillSoft)}>
            <TypeIcon size={12} strokeWidth={2.3} />
            {typeMeta.label}
          </div>
          {signals[0] && (
            <div className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70 backdrop-blur">
              {signals[0].short}
            </div>
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 px-1 pb-0 pt-4">
        <div className="min-w-0">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/38">{categoryName}</p>
          <h3 className="clamp-2 text-[15px] font-bold leading-snug text-white transition-colors duration-200 group-hover:text-warp-200">
            {product.name}
          </h3>
        </div>

        <p className="clamp-1 text-[11px] leading-relaxed text-white/54">
          {product.description || "Conteudo pronto para acessar, baixar ou explorar dentro do seu acervo."}
        </p>

        <div className="platform-badges">
          {signals.map((signal) => {
            const SignalIcon = signal.icon
            return (
              <span
                key={signal.key}
                className={cn(
                  "platform-chip border text-[9px] font-extrabold uppercase tracking-[0.12em]",
                  signal.toneSoft,
                  signal.toneBorder,
                  signal.tone,
                )}
              >
                <span className={cn("platform-logo", signal.toneSoft, signal.toneBorder, signal.tone)}>
                  <SignalIcon size={12} strokeWidth={2.4} />
                </span>
                {signal.label}
              </span>
            )
          })}
        </div>

      </div>
    </article>
  )
}

function SearchResults({
  products,
  query,
  accents,
  categoriesById,
  onPreview,
}: {
  products: Product[]
  query: string
  accents: Record<string, Accent>
  categoriesById: Record<string, Category>
  onPreview: (product: Product) => void
}) {
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return []

    return products.filter((product) => {
      const haystack = `${product.name} ${product.description ?? ""}`.toLowerCase()
      return haystack.includes(normalized)
    })
  }, [products, query])

  if (!query.trim()) {
    return (
      <div className="glass-panel flex flex-col items-center justify-center gap-4 rounded-[32px] border border-white/10 px-8 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/6">
          <Search size={24} strokeWidth={1.6} className="text-white/55" />
        </div>
        <div>
          <p className="text-lg font-semibold text-white">Pesquise no acervo completo</p>
          <p className="mt-2 text-sm text-white/48">{products.length.toLocaleString("pt-BR")} itens prontos para busca</p>
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="glass-panel flex flex-col items-center justify-center gap-3 rounded-[32px] border border-white/10 px-8 py-20 text-center">
        <p className="text-lg font-semibold text-white">Nenhum resultado para &quot;{query}&quot;</p>
        <p className="text-sm text-white/48">Tente outro termo, plataforma ou tipo de arquivo.</p>
      </div>
    )
  }

  const capped = results.slice(0, 60)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <p className="text-sm text-white/62">
          {results.length.toLocaleString("pt-BR")} resultado{results.length !== 1 ? "s" : ""}
          {results.length > 60 ? " mostrando os primeiros 60" : ""}
        </p>
        <div className="inline-flex items-center gap-2 rounded-full border border-warp-400/20 bg-warp-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-warp-200">
          Busca global
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {capped.map((product, index) => {
          const category = categoriesById[product.category_id]
          return (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              accent={accents[product.category_id] ?? ACCENTS.fuchsia}
              categoryName={category?.name ?? "Acervo"}
              onPreview={onPreview}
            />
          )
        })}
      </div>
    </div>
  )
}

function ProductPreviewPanel({
  product,
  category,
  accent,
  onClose,
}: {
  product: Product | null
  category: Category | undefined
  accent: Accent
  onClose: () => void
}) {
  if (!product) return null

  const typeMeta = TYPE_META[product.type]
  const TypeIcon = typeMeta.icon
  const signals = getSignalChips(product)
  // Cursos apontavam pra uma pagina interna (/dashboard/curso/[id]) que nunca foi
  // construida — todo produto, curso ou nao, ja tem o link de acesso real em file_url.
  const href = product.file_url

  return (
    <div className="preview-overlay fixed inset-0 z-50 flex items-end justify-end bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <aside
        className="preview-panel custom-scroll h-[92vh] w-full max-w-[520px] overflow-y-auto border-l border-white/10 bg-[#050913]/96 p-5 shadow-[0_0_80px_rgba(2,6,23,0.55)] md:h-screen md:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex shrink-0 items-center gap-3 pl-3">
            <WarpLogo className="h-8 w-8 text-warp-400" />
            <span className="font-headline text-lg font-bold tracking-widest text-white">WARP</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/66 hover:bg-white/[0.08] hover:text-white"
            aria-label="Fechar preview"
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>

        <div className="relative mb-5 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70">
          <div className="relative aspect-video overflow-hidden">
            {product.banner_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.banner_url} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,rgba(14,24,44,1),rgba(5,9,18,1))]">
                <div className={cn("flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10", accent.iconWrap)}>
                  <CategoryIcon name={category?.name ?? ""} size={34} strokeWidth={1.7} className={accent.iconText} />
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.08),rgba(2,6,23,0.82))]" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
              <div className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em]", accent.border, accent.pillSoft)}>
                <TypeIcon size={14} strokeWidth={2.3} />
                {typeMeta.label}
              </div>
              <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/74 backdrop-blur">
                Preview
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/36">
            {category?.name ?? "Acervo"}
          </p>
          <h2 className="text-2xl font-bold leading-tight text-white">{product.name}</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/54">
            {product.description || "Conteudo pronto para acessar dentro do Acervoaki."}
          </p>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {signals.map((signal) => {
            const SignalIcon = signal.icon
            return (
              <span
                key={signal.key}
                className={cn(
                  "platform-chip border text-[10px] font-extrabold uppercase tracking-[0.12em]",
                  signal.toneSoft,
                  signal.toneBorder,
                  signal.tone,
                )}
              >
                <span className={cn("platform-logo", signal.toneSoft, signal.toneBorder, signal.tone)}>
                  <SignalIcon size={13} strokeWidth={2.4} />
                </span>
                {signal.label}
              </span>
            )
          })}
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/34">Categoria</p>
            <p className="mt-2 truncate text-sm font-bold text-white">{category?.name ?? "Acervo"}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/34">Formato</p>
            <p className="mt-2 truncate text-sm font-bold text-white">{typeMeta.label}</p>
          </div>
        </div>

        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <AuraButton className="w-full text-base font-bold">
              {product.type === "curso" ? "Abrir curso" : "Abrir arquivo"}
              <ArrowUpRight size={17} strokeWidth={2.4} />
            </AuraButton>
          </a>
        ) : (
          <div className="flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-medium text-white/44">
            Link indisponivel
          </div>
        )}
      </aside>
    </div>
  )
}

export default function AcervoUI({
  member,
}: {
  member: { name: string; email: string; expiringSoon: boolean }
}) {
  const { theme, toggle: toggleTheme } = useTheme()
  const [catalog, setCatalog] = useState<{ categories: Category[]; products: Product[] } | null>(null)
  const [catalogError, setCatalogError] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch("/api/acervo/catalog")
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao carregar catalogo")
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setCatalog(data)
      })
      .catch(() => {
        if (!cancelled) setCatalogError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const categories = catalog?.categories ?? []
  const products = catalog?.products ?? []
  const catalogLoading = !catalog && !catalogError
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY_ID)
  const [searchQuery, setSearchQuery] = useState("")
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)
  const [isOpen, setIsOpen] = useState(true)
  const [isInsightPanelOpen, setIsInsightPanelOpen] = useState(true)
  const [activeSmartSection, setActiveSmartSection] = useState(ALL_SMART_SECTION_ID)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const debouncedQuery = useDebounce(searchQuery, 220)
  const isSearching = debouncedQuery.trim().length > 0

  const categoriesById = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.id, category])),
    [categories],
  )

  const accents = useMemo(() => {
    const map: Record<string, Accent> = {}
    for (const category of categories) map[category.id] = getCategoryColor(category.name)
    return map
  }, [categories])

  const countByCategory = useMemo(() => {
    const map: Record<string, number> = {}
    for (const product of products) map[product.category_id] = (map[product.category_id] ?? 0) + 1
    return map
  }, [products])

  const smartSectionsByCategory = useMemo(() => {
    const productsByCategory: Record<string, Product[]> = {}
    for (const product of products) {
      if (!productsByCategory[product.category_id]) productsByCategory[product.category_id] = []
      productsByCategory[product.category_id].push(product)
    }

    const map: Record<string, SmartSectionWithCount[]> = {}
    for (const category of categories) {
      const categoryProducts = productsByCategory[category.id] ?? []
      map[category.id] = getSmartSectionStatsForProducts(categoryProducts, categoriesById)
    }
    return map
  }, [categories, categoriesById, products])

  const isAllCategory = activeCategory === ALL_CATEGORY_ID
  const activeCategoryData = categoriesById[activeCategory]
  const activeAccent = accents[activeCategory] ?? ACCENTS.fuchsia

  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(GROUP_BY_CATEGORY[activeCategory] ? [GROUP_BY_CATEGORY[activeCategory]] : ["g-cursos"]),
  )

  const sidebarGroups = useMemo(() => {
    const mapped = new Set(SIDEBAR_GROUPS.flatMap((group) => group.children))
    const extraCategoryIds = categories
      .map((category) => category.id)
      .filter((id) => !mapped.has(id))

    if (extraCategoryIds.length === 0) return SIDEBAR_GROUPS

    return [
      ...SIDEBAR_GROUPS,
      {
        id: "g-outros",
        label: "Outras categorias",
        icon: Library,
        children: extraCategoryIds,
      },
    ]
  }, [categories])

  const baseProducts = useMemo(
    () => activeCategory === ALL_CATEGORY_ID
      ? products
      : products.filter((product) => product.category_id === activeCategory),
    [products, activeCategory],
  )

  const smartSectionStats = useMemo(() => {
    return getSmartSectionStatsForProducts(baseProducts, categoriesById)
  }, [baseProducts, categoriesById])

  const activeSmartSectionData = smartSectionStats.find((section) => section.id === activeSmartSection)

  const filteredProducts = useMemo(() => {
    if (!activeSmartSectionData) return baseProducts
    return baseProducts.filter((product) => productMatchesSmartSection(product, activeSmartSectionData, categoriesById))
  }, [activeSmartSectionData, baseProducts, categoriesById])

  const visibleProducts = filteredProducts.slice(0, visibleCount)
  const remaining = filteredProducts.length - visibleCount
  const totalGroups = sidebarGroups.reduce((sum, group) => {
    const count = group.children.reduce((groupSum, child) => groupSum + (countByCategory[child] ?? 0), 0)
    return sum + (count > 0 ? 1 : 0)
  }, 0)

  return (
    <div className="acervo-dashboard relative flex flex-col h-dvh overflow-hidden bg-[#020611] text-white">
      <MembersHeader name={member.name} email={member.email} />
      {member.expiringSoon && (
        <div className="px-4 pt-4 sm:px-6">
          <ExpiryWarningBanner />
        </div>
      )}
      {catalogLoading && (
        <div className="absolute inset-0 top-[81px] z-50 flex flex-col items-center justify-center gap-4 bg-[#020611]">
          <WarpLogo className="h-12 w-12 text-warp-400 animate-pulse" />
          <p className="text-sm text-white/50">Carregando catálogo...</p>
        </div>
      )}
      {catalogError && (
        <div className="absolute inset-0 top-[81px] z-50 flex flex-col items-center justify-center gap-3 bg-[#020611] text-center px-4">
          <p className="text-sm text-white/70">Não foi possível carregar o catálogo.</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl border border-warp-500/30 bg-warp-500/10 px-4 py-2 text-sm font-semibold text-warp-200 hover:bg-warp-500/20"
          >
            Tentar novamente
          </button>
        </div>
      )}
      <div className="relative flex flex-1 overflow-hidden">
        <div className="ambient-grid pointer-events-none absolute inset-0 opacity-80" />

      <aside
        className={cn(
          "relative z-40 flex h-full shrink-0 flex-col border-r border-white/8 bg-[#050913]/88 backdrop-blur-2xl transition-all duration-300",
          isOpen ? "w-[310px]" : "w-[92px]",
        )}
      >
        <button
          onClick={() => setIsOpen((value) => !value)}
          className="absolute -right-4 top-10 z-30 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[#0a1221]/95 text-white/70 shadow-[0_12px_30px_rgba(2,6,23,0.45)] backdrop-blur hover:text-white"
          aria-label={isOpen ? "Recolher sidebar" : "Expandir sidebar"}
        >
          {isOpen ? <ChevronLeft size={18} strokeWidth={2.2} /> : <ChevronRight size={18} strokeWidth={2.2} />}
        </button>

        <div className={cn("border-b border-white/8", isOpen ? "px-5 pb-5 pt-6" : "px-3 py-6")}>
          {isOpen ? (
            <div className="flex justify-center">
              <div className="mb-10 flex flex-col items-center justify-center gap-2">
                <WarpLogo className="h-14 w-14 text-warp-400" />
                <span className="font-headline text-2xl font-bold tracking-widest text-white">ACERVO</span>
              </div>
              <p className="hidden">
                Biblioteca premium com visual futurista, navegação intuitiva e destaque inteligente por formato.
              </p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="mb-4">
                <WarpLogo className="h-12 w-12 text-warp-400" />
              </div>
            </div>
          )}
        </div>

        <div className={cn("border-b border-white/8", isOpen ? "px-5 py-4" : "px-3 py-3")}>
          <div className="relative">
            <Search size={15} strokeWidth={2.3} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/36" />
            <input
              type="text"
              placeholder={isOpen ? "Pesquisar cursos, PDFs, Freepik..." : ""}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className={cn(
                "input-base w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 text-sm text-white placeholder:text-white/28 focus:border-warp-400/40 focus:bg-white/[0.06]",
                isOpen ? "pl-11 pr-4" : "pl-11 pr-0",
              )}
            />
          </div>
        </div>

        <nav className="custom-scroll flex-1 overflow-y-auto px-3 py-4">
          {isOpen && (
            <div className="mb-4 grid grid-cols-2 gap-2 px-2">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">Itens</p>
                <p className="mt-2 text-lg font-bold text-white">{products.length.toLocaleString("pt-BR")}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">Areas</p>
                <p className="mt-2 text-lg font-bold text-white">{totalGroups}</p>
              </div>
            </div>
          )}

          <div className="sticky top-0 z-10 -mx-3 mb-3 border-b border-white/8 bg-[#050913]/92 px-5 py-3 backdrop-blur-xl">
            {isOpen && <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/28">Colecoes</p>}
          </div>

          <ul className="space-y-2">
            <li className="relative">
              <button
                onClick={() => {
                  setActiveCategory(ALL_CATEGORY_ID)
                  setSearchQuery("")
                  setActiveSmartSection(ALL_SMART_SECTION_ID)
                  setVisibleCount(INITIAL_VISIBLE)
                }}
                className={cn(
                  "flex w-full items-center rounded-[22px] border text-left transition duration-200",
                  isOpen ? "gap-3 px-3 py-3" : "justify-center px-0 py-3",
                  activeCategory === ALL_CATEGORY_ID && !isSearching
                    ? "border-warp-400/20 bg-warp-400/10 shadow-[0_0_30px_rgba(56,189,248,0.08)]"
                    : "border-white/0 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.05]",
                )}
              >
                <div className={cn("flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[22px] border border-white/8", activeCategory === ALL_CATEGORY_ID && !isSearching ? "bg-warp-400/12 text-warp-300" : "bg-white/[0.04] text-white/62")}>
                  <Library size={22} strokeWidth={2.1} />
                </div>

                {isOpen && (
                  <div className="min-w-0 flex-1">
                    <p className={cn("truncate text-[13px] font-semibold", activeCategory === ALL_CATEGORY_ID && !isSearching ? "text-white" : "text-white/76")}>
                      Biblioteca Geral
                    </p>
                    <p className="mt-1 text-[11px] text-white/36">{products.length.toLocaleString("pt-BR")} itens</p>
                  </div>
                )}
              </button>
            </li>

            {sidebarGroups.map((group) => {
              const groupCategories = group.children
                .map((id) => categoriesById[id])
                .filter(Boolean) as Category[]
              if (groupCategories.length === 0) return null

              const groupCount = groupCategories.reduce((sum, category) => sum + (countByCategory[category.id] ?? 0), 0)
              const isGroupOpen = openGroups.has(group.id)
              const isGroupActive = groupCategories.some((category) => category.id === activeCategory) && !isSearching
              const GroupIcon = group.icon

              return (
                <li key={group.id} className="relative">
                  <button
                    onClick={() => {
                      if (!isOpen) return
                      setOpenGroups((current) => {
                        const next = new Set(current)
                        if (next.has(group.id)) next.delete(group.id)
                        else next.add(group.id)
                        return next
                      })
                    }}
                    className={cn(
                      "flex w-full items-center rounded-[22px] border text-left transition duration-200",
                      isOpen ? "gap-3 px-3 py-3" : "justify-center px-0 py-3",
                      isGroupActive
                        ? "border-warp-400/20 bg-warp-400/10 shadow-[0_0_30px_rgba(56,189,248,0.08)]"
                        : "border-white/0 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.05]",
                    )}
                  >
                    <div className={cn("flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[22px] border border-white/8", isGroupActive ? "bg-warp-400/12 text-warp-300" : "bg-white/[0.04] text-white/62")}>
                      <GroupIcon size={22} strokeWidth={2.1} />
                    </div>

                    {isOpen && (
                      <>
                        <div className="min-w-0 flex-1">
                          <p className={cn("truncate text-[13px] font-semibold", isGroupActive ? "text-white" : "text-white/76")}>{group.label}</p>
                          <p className="mt-1 text-[11px] text-white/36">{groupCount.toLocaleString("pt-BR")} itens</p>
                        </div>
                        <ChevronRight
                          size={16}
                          strokeWidth={2.2}
                          className={cn("shrink-0 text-white/32 transition-transform", isGroupOpen && "rotate-90")}
                        />
                      </>
                    )}
                  </button>

                  {!isOpen && (
                    <div className="pointer-events-none absolute left-full top-1/2 z-40 ml-3 -translate-y-1/2 rounded-xl border border-white/10 bg-[#0c1220] px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-[0_10px_30px_rgba(2,6,23,0.4)] transition group-hover:opacity-100">
                      {group.label}
                    </div>
                  )}

                  {isOpen && (
                    <div className={cn("grid transition-[grid-template-rows] duration-200", isGroupOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                      <div className="overflow-hidden">
                        <ul className="mt-2 space-y-1 pl-4">
                          {groupCategories.map((category) => {
                            const isActive = category.id === activeCategory && !isSearching
                            const categoryAccent = accents[category.id] ?? ACCENTS.fuchsia
                            const count = countByCategory[category.id] ?? 0
                            const categorySections = smartSectionsByCategory[category.id] ?? []
                            return (
                              <li key={category.id}>
                                <button
                                  onClick={() => {
                                    setActiveCategory(category.id)
                                    setSearchQuery("")
                                    setActiveSmartSection(ALL_SMART_SECTION_ID)
                                    setVisibleCount(INITIAL_VISIBLE)
                                    const groupId = GROUP_BY_CATEGORY[category.id] ?? "g-outros"
                                    if (groupId) {
                                      setOpenGroups((current) => {
                                        if (current.has(groupId)) return current
                                        return new Set(current).add(groupId)
                                      })
                                    }
                                  }}
                                  className={cn(
                                    "flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition duration-200",
                                    isActive
                                      ? cn("border-white/10 bg-white/[0.06]", categoryAccent.glow)
                                      : "border-transparent bg-transparent hover:border-white/8 hover:bg-white/[0.03]",
                                  )}
                                >
                                  <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", isActive ? categoryAccent.pill : "bg-white/18")} />
                                  <span className={cn("min-w-0 flex-1 truncate text-[12px]", isActive ? "font-semibold text-white" : "font-medium text-white/62")}>
                                    {category.name}
                                  </span>
                                  <span className="text-[10px] font-semibold text-white/35">{count.toLocaleString("pt-BR")}</span>
                                </button>
                                {isActive && categorySections.length > 0 && (
                                  <ul className="mt-1 space-y-1 border-l border-white/8 pl-3">
                                    {categorySections.map((section) => {
                                      const SectionIcon = section.icon
                                      const isSectionActive = activeSmartSection === section.id

                                      return (
                                        <li key={`${category.id}-${section.id}`}>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setActiveCategory(category.id)
                                              setSearchQuery("")
                                              setActiveSmartSection(isSectionActive ? ALL_SMART_SECTION_ID : section.id)
                                              setVisibleCount(INITIAL_VISIBLE)
                                            }}
                                            className={cn(
                                              "flex w-full items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition duration-200",
                                              isSectionActive
                                                ? cn(section.border, section.bg)
                                                : "border-transparent bg-transparent hover:border-white/8 hover:bg-white/[0.03]",
                                            )}
                                          >
                                            <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border", isSectionActive ? section.border : "border-white/8", isSectionActive ? section.bg : "bg-white/[0.03]")}>
                                              <SectionIcon size={14} strokeWidth={2.2} className={isSectionActive ? section.tone : "text-white/48"} />
                                            </span>
                                            <span className={cn("min-w-0 flex-1 truncate text-[11px]", isSectionActive ? "font-bold text-white" : "font-medium text-white/52")}>
                                              {section.label}
                                            </span>
                                            <span className="text-[10px] font-semibold text-white/32">{section.count.toLocaleString("pt-BR")}</span>
                                          </button>
                                        </li>
                                      )
                                    })}
                                  </ul>
                                )}
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        <div className={cn("border-t border-white/8", isOpen ? "p-4" : "px-2 py-4")}>
          <div className={cn("flex items-center", isOpen ? "justify-between gap-3" : "flex-col gap-3")}>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className={cn(
                  "flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-white/64 transition hover:bg-white/[0.06] hover:text-white",
                  !isOpen && "justify-center px-2.5",
                )}
              >
                <LogOut size={16} strokeWidth={2.2} />
                {isOpen && <span>Sair</span>}
              </button>
            </form>

            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/68 transition hover:bg-white/[0.06] hover:text-white"
              aria-label="Alternar tema"
              title={theme === "light" ? "Modo escuro" : "Modo claro"}
            >
              {theme === "light" ? <Moon size={16} strokeWidth={2.2} /> : <Sun size={16} strokeWidth={2.2} />}
            </button>
          </div>
        </div>
      </aside>

      <main className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="border-b border-white/8 bg-[#040814]/78 px-5 py-4 backdrop-blur-xl md:px-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-start gap-4">
              <div className={cn("flex h-16 w-16 shrink-0 items-center justify-center rounded-[26px] border border-white/10", activeAccent.iconWrap)}>
                {isAllCategory
                  ? <Library size={28} strokeWidth={1.9} className={activeAccent.iconText} />
                  : <CategoryIcon name={activeCategoryData?.name ?? ""} size={28} strokeWidth={1.9} className={activeAccent.iconText} />
                }
              </div>
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/54">
                  <Sparkles size={12} strokeWidth={2.1} className="text-warp-300" />
                  Novo visual Acervoaki
                </div>
                <h1 className="font-[var(--font-display)] text-2xl font-bold leading-tight text-white md:text-[2rem]">
                  {isSearching ? "Resultados da busca" : isAllCategory ? "Biblioteca Geral" : activeCategoryData?.name ?? "Acervo completo"}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/50">
                  {isSearching
                    ? `Buscando em ${products.length.toLocaleString("pt-BR")} itens do seu acervo.`
                    : "Explore uma grade mais rica, com leitura visual de formato, plataforma e categoria sem perder nenhum conteudo ja existente."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 xl:w-[430px]">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/32">Colecao ativa</p>
                <p className="mt-2 text-xl font-bold text-white">
                  {isSearching ? products.length.toLocaleString("pt-BR") : filteredProducts.length.toLocaleString("pt-BR")}
                </p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/32">Categorias</p>
                <p className="mt-2 text-xl font-bold text-white">{categories.length.toLocaleString("pt-BR")}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="custom-scroll flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-[1820px] flex-col gap-6 px-5 py-6 md:px-8">
            {!isSearching && (isInsightPanelOpen ? (
              <section className="glass-panel overflow-hidden rounded-[34px] border border-white/10">
                <div className="flex items-center justify-between gap-4 border-b border-white/8 px-6 py-4 lg:px-8">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/54">
                    <Sparkles size={12} strokeWidth={2.1} className={activeAccent.iconText} />
                    Secoes e formatos
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsInsightPanelOpen(false)}
                    className="inline-flex h-10 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 text-xs font-bold uppercase tracking-[0.14em] text-white/58 transition hover:bg-white/[0.08] hover:text-white"
                    aria-label="Fechar painel de secoes"
                  >
                    <X size={15} strokeWidth={2.3} />
                    Fechar
                  </button>
                </div>
                <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.25fr_0.95fr] lg:px-8">
                  <div className="relative overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(135deg,rgba(30,10,40,0.96),rgba(15,5,20,0.88))] p-6">
                    <div className="absolute -right-16 top-0 h-44 w-44 rounded-full bg-warp-400/16 blur-[90px]" />
                    <div className="relative flex h-full flex-col justify-between gap-5">
                      <div>
                        <div className={cn("mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]", activeAccent.border, activeAccent.pillSoft)}>
                          <Sparkles size={12} strokeWidth={2.1} />
                          Destaque inteligente
                        </div>
                        <h2 className="font-headline text-3xl font-bold leading-tight text-white">
                          Cards com leitura imediata de formato, categoria e contexto.
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/52">
                          Inspiramos a estrutura no MotionAki, mas trouxemos a atmosfera para o universo visual azul do Acervoaki com navegação mais clara e cards mais expressivos.
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/32">Formato</p>
                          <p className="mt-2 text-base font-bold text-white">PDF, video, packs</p>
                        </div>
                        <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/32">Plataforma</p>
                          <p className="mt-2 text-base font-bold text-white">Freepik, Canva e mais</p>
                        </div>
                        <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/32">Foco</p>
                          <p className="mt-2 text-base font-bold text-white">Mais rapido para decidir</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/32">Acervo total</p>
                      <p className="mt-3 text-3xl font-bold text-white">{products.length.toLocaleString("pt-BR")}</p>
                      <p className="mt-2 text-sm text-white/46">Itens ativos distribuidos por varias frentes do digital.</p>
                    </div>
                    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/32">Colecao atual</p>
                      <p className="mt-3 text-3xl font-bold text-white">{filteredProducts.length.toLocaleString("pt-BR")}</p>
                      <p className="mt-2 text-sm text-white/46">Contexto visual reforcado para a categoria selecionada.</p>
                    </div>
                    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/32">Experiencia</p>
                      <p className="mt-3 text-3xl font-bold text-white">Major</p>
                      <p className="mt-2 text-sm text-white/46">Mais futurista, mais premium e sem remover nada do conteudo atual.</p>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <button
                type="button"
                onClick={() => setIsInsightPanelOpen(true)}
                className="glass-panel flex w-full items-center justify-between gap-4 rounded-[26px] border border-white/10 px-5 py-4 text-left transition hover:border-warp-400/25 hover:bg-white/[0.05]"
                aria-label="Expandir painel de secoes"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-[24px] border", activeAccent.border, activeAccent.iconWrap)}>
                    <Sparkles size={24} strokeWidth={2.2} className={activeAccent.iconText} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-white">Secoes, formatos e plataformas</span>
                    <span className="mt-1 block truncate text-xs text-white/44">Painel recolhido. Clique para expandir os icones e metricas.</span>
                  </span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/62">
                  Expandir
                  <ChevronDown size={15} strokeWidth={2.3} />
                </span>
              </button>
            ))}

            {isSearching ? (
              <SearchResults products={products} query={debouncedQuery} accents={accents} categoriesById={categoriesById} onPreview={setSelectedProduct} />
            ) : filteredProducts.length === 0 ? (
              <div className="glass-panel flex flex-col items-center justify-center gap-4 rounded-[34px] border border-white/10 px-8 py-24 text-center">
                <div className={cn("flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10", activeAccent.iconWrap)}>
                  <FolderOpen size={24} strokeWidth={1.7} className={activeAccent.iconText} />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">Nenhum item nesta colecao</p>
                  <p className="mt-2 text-sm text-white/46">Os grupos e o conteudo seguem preservados; esta categoria so nao possui registros no momento.</p>
                </div>
              </div>
            ) : (
              <section className="flex flex-col gap-5">
                {smartSectionStats.length > 0 && (
                  <div className="glass-panel rounded-[30px] border border-white/10 p-4">
                    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/32">Subcategorias da colecao</p>
                        <h3 className="mt-1 text-lg font-bold text-white">Conteudo organizado por nicho, entrega e plataforma</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSmartSection(ALL_SMART_SECTION_ID)
                          setVisibleCount(INITIAL_VISIBLE)
                        }}
                        className={cn(
                          "rounded-2xl border px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] transition",
                          activeSmartSection === ALL_SMART_SECTION_ID
                            ? "border-warp-400/30 bg-warp-400/12 text-warp-100"
                            : "border-white/10 bg-white/[0.03] text-white/52 hover:bg-white/[0.06] hover:text-white",
                        )}
                      >
                        Todos os {baseProducts.length.toLocaleString("pt-BR")}
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {smartSectionStats.map((section) => {
                        const SectionIcon = section.icon
                        const isActive = activeSmartSection === section.id

                        return (
                          <button
                            key={section.id}
                            type="button"
                            onClick={() => {
                              setActiveSmartSection(isActive ? ALL_SMART_SECTION_ID : section.id)
                              setVisibleCount(INITIAL_VISIBLE)
                            }}
                            className={cn(
                              "group relative overflow-hidden rounded-[24px] border p-4 text-left transition duration-200",
                              isActive
                                ? cn(section.border, section.bg, "shadow-[0_0_36px_rgba(56,189,248,0.10)]")
                                : "border-white/8 bg-white/[0.025] hover:border-white/14 hover:bg-white/[0.05]",
                            )}
                          >
                            <div className={cn("absolute -right-8 -top-10 h-24 w-24 rounded-full blur-2xl transition group-hover:scale-125", section.bg)} />
                            <div className="relative flex items-start gap-3">
                              <span className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-[24px] border", section.border, section.bg)}>
                                <SectionIcon size={26} strokeWidth={2.1} className={section.tone} />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="flex items-center justify-between gap-2">
                                  <span className="truncate text-sm font-bold text-white">{section.label}</span>
                                  <span className={cn("rounded-full border px-2 py-1 text-[10px] font-black", section.border, section.tone)}>
                                    {section.count.toLocaleString("pt-BR")}
                                  </span>
                                </span>
                                <span className="mt-2 block text-xs leading-relaxed text-white/44">{section.description}</span>
                              </span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/32">
                      {activeSmartSectionData ? activeSmartSectionData.label : isAllCategory ? "Todos os conteudos" : "Biblioteca da categoria"}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-white">
                      {activeSmartSectionData
                        ? `${activeSmartSectionData.label} em ${isAllCategory ? "Biblioteca Geral" : activeCategoryData?.name ?? "Acervo"}`
                        : isAllCategory ? "Biblioteca Geral" : activeCategoryData?.name ?? "Acervo"}
                    </h2>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/54">
                    <span className={cn("h-2.5 w-2.5 rounded-full", activeAccent.pill)} />
                    {filteredProducts.length.toLocaleString("pt-BR")} itens nesta visao
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {visibleProducts.map((product, index) => {
                    const productCategory = categoriesById[product.category_id]
                    const productAccent = isAllCategory ? accents[product.category_id] ?? ACCENTS.fuchsia : activeAccent

                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        index={index}
                        accent={productAccent}
                        categoryName={productCategory?.name ?? activeCategoryData?.name ?? "Acervo"}
                        onPreview={setSelectedProduct}
                      />
                    )
                  })}
                </div>

                {remaining > 0 && (
                  <button
                    onClick={() => setVisibleCount((current) => current + 24)}
                    className="btn-outline-glow flex w-full items-center justify-center gap-2 rounded-[24px] border border-white/10 px-4 py-4 text-sm font-semibold text-white/70 hover:text-white"
                  >
                    <ChevronDown size={16} strokeWidth={2.2} />
                    Ver mais {remaining.toLocaleString("pt-BR")} itens
                  </button>
                )}
              </section>
            )}
          </div>
        </div>
      </main>
      </div>

      <ProductPreviewPanel
        product={selectedProduct}
        category={selectedProduct ? categoriesById[selectedProduct.category_id] : undefined}
        accent={selectedProduct ? accents[selectedProduct.category_id] ?? ACCENTS.fuchsia : ACCENTS.fuchsia}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}
