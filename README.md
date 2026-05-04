# Catálogo de Vendas - Mary Kay

Projeto desenvolvido para uma cliente real com o objetivo de apresentar produtos Mary Kay de forma organizada, simples e visualmente atrativa, funcionando como um catálogo digital com montagem de pedido.

## Sobre o Projeto

Este projeto atende uma necessidade prática de uma revendedora: facilitar a escolha de produtos por clientes que usam principalmente celular e nem sempre têm facilidade com tecnologia.

A cliente final pode navegar pelo catálogo, adicionar produtos ao carrinho, acompanhar o valor total em tempo real e finalizar o pedido pelo WhatsApp com uma mensagem pronta.

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript
- Git e GitHub
- LocalStorage para persistência no protótipo

## Funcionalidades

- Exibição de produtos em formato de catálogo digital
- Busca por produto, categoria, marca ou descrição
- Filtro por categorias
- Carrinho de compras simples e intuitivo
- Valor total sempre visível na tela
- Finalização do pedido via WhatsApp
- Layout responsivo com foco em dispositivos móveis
- Painel da revendedora protegido por senha
- Cadastro, remoção e edição de estoque de produtos
- Importação e exportação CSV para apoio com planilhas

## Objetivo

Aplicar conhecimentos de desenvolvimento web em um projeto real, com foco em experiência do usuário, organização das informações, responsividade e solução de uma necessidade prática de uma cliente.

## Demonstração

Adicione aqui prints do site depois.

## Acesse o Projeto

Quando o GitHub Pages estiver ativado, o projeto poderá ser acessado por:

https://dahavid17.github.io/catalogo-marykay

## Repositório

https://github.com/Dahavid17/catalogo-marykay

## Como Rodar Localmente

Este projeto não precisa instalar dependências. Basta usar um servidor local para carregar o arquivo JSON corretamente.

```bash
python -m http.server 5500
```

Depois acesse:

```text
http://localhost:5500/index.html
```

Painel da revendedora:

```text
http://localhost:5500/admin.html
```

Senha de demonstração:

```text
marykay2026
```

## Estrutura do Projeto

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

## Observações

Esta é uma versão de protótipo/MVP. Os dados são salvos no navegador usando `localStorage`. Para uso em produção, o ideal é evoluir para autenticação real e banco de dados online.

## Desenvolvedor

Davi Antonio Santos  
GitHub: https://github.com/Dahavid17
