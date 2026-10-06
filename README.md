# Acervo VIP / Acervoaki 🚀

Aplicação standalone do **Acervo VIP**, extraída e desacoplada da dashboard principal para operação independente.

## 📦 O que está incluído

- **Catálogo Completo:** ~18.000 produtos e 52 categorias no arquivo local otimizado (`src/lib/acervo-data.json`).
- **Navegação Inteligente:** Filtros por categorias (Cursos, Utilitários, Geral), busca dinâmica instantânea, abas especiais (Mais Acessados, Recentes, etc.).
- **Endpoint Otimizado:** `/api/catalog` e `/api/acervo/catalog` serializados via JSON puro em alta velocidade.
- **Interface Premium:** Visual dark futurista, suporte a temas (dark/light), cards com preview, badges de plataforma e modais interativos.
- **Standalone:** Acessível diretamente na rota raiz `/` sem depender da autenticação externa ou proxy da dashboard.

## 🛠️ Como executar

```bash
# Instalar dependências
npm install

# Iniciar ambiente de desenvolvimento
npm run dev
```

Acesse em [http://localhost:3000](http://localhost:3000).
