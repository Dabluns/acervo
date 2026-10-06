import { existsSync, readFileSync } from "fs"
import { join } from "path"
import { unstable_cache } from "next/cache"

export type Category = {
  id: string
  name: string
  icon: string
  type: "cursos" | "utilitarios" | "geral"
}

export type Product = {
  id: string
  name: string
  description: string | null
  type: "curso" | "planilha" | "pdf" | "ebook" | "template" | "ferramenta" | "infoproduto"
  category_id: string
  banner_url: string | null
  file_url: string | null
  created_at: string
}

let cachedBackup: { categories: Category[]; products: Product[] } | null = null

function getBackupData(): { categories: Category[]; products: Product[] } {
  if (cachedBackup) return cachedBackup

  const backupPath = join(process.cwd(), "src", "lib", "acervo-data.json")

  if (existsSync(backupPath)) {
    try {
      const raw = readFileSync(backupPath, "utf-8")
      cachedBackup = JSON.parse(raw)
      return cachedBackup!
    } catch (err) {
      console.error(`[AcervoDB] Failed to parse backup file at ${backupPath}:`, err)
    }
  }

  try {
    const { categories, products } = require("./mock-data")
    return { categories, products: products as unknown as Product[] }
  } catch (err) {
    console.error(`[AcervoDB] Failed to load mock-data.ts:`, err)
    return { categories: [], products: [] }
  }
}

// O catálogo real (17.939 produtos / 52 categorias) vive no arquivo local.
// O projeto Supabase configurado tem tabelas `products`/`categories`, mas com
// dados de teste (14/7 linhas) — não usar como fonte até uma migração real.
//
// getBackupData() lê e faz parse de um JSON de ~7MB — caro o suficiente pra valer
// a pena cachear no Data Cache da Vercel (unstable_cache), já que os dados nunca
// mudam em runtime. Sem isso, a página /acervo (force-dynamic, por causa do
// getCurrentUser() que lê cookies) refazia esse trabalho em toda navegação.
const getCachedCategories = unstable_cache(
  async () => getBackupData().categories,
  ["acervo-categories"],
  { revalidate: false },
)

const getCachedProducts = unstable_cache(
  async () => getBackupData().products,
  ["acervo-products"],
  { revalidate: false },
)

export async function getCategories(): Promise<Category[]> {
  return getCachedCategories()
}

export async function getProducts(): Promise<Product[]> {
  return getCachedProducts()
}

export async function getProductById(id: string): Promise<Product | null> {
  const backup = getBackupData()
  return backup.products.find((p) => p.id === id) ?? null
}
