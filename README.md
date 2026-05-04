# GlowCatalog - Catalogo de Maquiagem

MVP de catalogo de produtos para uma revendedora de maquiagem. O projeto permite que clientes visualizem produtos, estoque disponivel e chamem a fornecedora pelo WhatsApp. A revendedora pode adicionar produtos, remover itens, ajustar estoque rapidamente e importar/exportar CSV para uso com Excel.

## Funcionalidades

- Catalogo publico com busca por nome, marca, categoria e descricao.
- Filtro por categoria e por produtos disponiveis.
- Botao de contato via WhatsApp por produto.
- Painel administrativo para cadastrar produtos.
- Controle rapido de estoque com botoes de aumentar/diminuir quantidade.
- Remocao de produtos.
- Exportacao CSV compatível com Excel.
- Importacao CSV para atualizar o catalogo.
- Persistencia local via `localStorage` para prototipo.

## Como rodar localmente

Este projeto nao precisa instalar dependencias. Use um servidor local para que o arquivo JSON seja carregado corretamente.

Com Python:

```bash
python -m http.server 5500
```

Depois acesse:

- Catalogo: `http://localhost:5500/index.html`
- Painel: `http://localhost:5500/admin.html`

## Estrutura

```text
.
├── admin.html
├── index.html
├── assets/
│   └── styles.css
├── data/
│   └── products.json
└── scripts/
    ├── admin.js
    ├── catalog.js
    └── store.js
```

## Observacoes importantes

Esta versao e um MVP de demonstracao. O painel administrativo salva dados no navegador atual usando `localStorage`. Para uso real pela cliente em varios dispositivos, o proximo passo ideal e conectar o catalogo a uma fonte de dados online, como Google Sheets, Supabase, Firebase ou um backend proprio.

## Estrategia para GitHub e portfolio

Se a ideia e mostrar o projeto para empresas sem expor todo o codigo, uma boa estrategia e:

- Manter o repositorio principal privado.
- Criar um repositorio publico apenas com README, screenshots, descricao tecnica e link do demo.
- Publicar uma versao demonstrativa sem dados reais da cliente.
- Usar commits organizados no repositorio privado para demonstrar processo em entrevistas, se necessario.

## Proximos passos sugeridos

- Trocar o telefone do WhatsApp em `scripts/store.js`.
- Substituir os produtos de exemplo pelos produtos reais da cliente.
- Adicionar autenticação e banco de dados para producao.
- Criar screenshots para o portfolio.
