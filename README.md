# 🌿 Easy Life - Tecnologia Sustentável em Manaus

O **Easy Life** é uma plataforma PWA (Progressive Web App) desenvolvida por estudantes de **Sistemas de Informação da Fametro (5° Período)**. Nosso objetivo é incentivar a reciclagem em Manaus através de tecnologia, conectando cidadãos a pontos de coleta e recompensando o descarte correto de resíduos.

---

## 🚀 Funcionalidades

- 📍 **Mapa Inteligente:** Localização em tempo real dos pontos de coleta em Manaus com cálculo de distância (Haversine).
- 🛣️ **Rotas Automáticas:** Integração com OSRM para traçar o melhor caminho até o ponto de descarte.
- 💰 **Sistema de Recompensas:** Ganhe pontos ao reciclar e troque por benefícios em empresas parceiras.
- 📱 **PWA Ready:** Experiência de aplicativo nativo no celular, instalável diretamente pelo navegador.
- 🔒 **Autenticação Segura:** Login e cadastro via Supabase Auth integrado com perfil do usuário.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Animações:** [Framer Motion](https://www.framer.com/motion/)
- **Mapas:** [Leaflet](https://leafletjs.com/) + [React Leaflet](https://react-leaflet.js.org/)
- **Backend & Auth:** [Supabase](https://supabase.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)

---

## 📦 Como rodar o projeto

1. **Clone o repositório:**
   ```bash
   git clone [url-do-seu-repo]
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz com suas chaves do Supabase:
   ```env
   VITE_SUPABASE_URL=seu_url
   VITE_SUPABASE_ANON_KEY=sua_chave_anon
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

---

## 👥 Equipe Fametro
Desenvolvido com ❤️ pelo time de Sistemas de Informação - 5° Período.

---
© 2024 Easy Life - Todos os direitos reservados.
