import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  buckets: {
    images: { access: 'public_read' }, // Cria o bucket "images" com leitura pública para exibir as imagens na tag <img>
  },
});