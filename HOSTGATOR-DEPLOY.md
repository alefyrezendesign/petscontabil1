# Publicação na HostGator

O site é estático e não precisa de Node.js no servidor. O Node/Vite é usado somente para gerar a pasta final de publicação.

## Gerar a versão de produção

```powershell
npm ci
npm run build
```

Publique **o conteúdo de `dist/`**, e não a pasta do projeto inteira.

## Enviar para a hospedagem

1. Abra o Gerenciador de Arquivos do cPanel ou conecte por FTP.
2. Entre em `public_html` para o domínio principal. Em domínio adicional, use a raiz configurada para esse domínio.
3. Faça um backup da versão atualmente publicada.
4. Envie todo o conteúdo gerado dentro de `dist/`, incluindo o arquivo oculto `.htaccess`.
5. Confirme que `index.html`, `assets/`, `fonts/` e `imagens/` estão diretamente na raiz pública.

## Verificação depois da publicação

Substitua o domínio nos comandos abaixo e use o nome real dos arquivos gerados em `dist/assets/`:

```powershell
curl.exe -I --compressed https://seu-dominio.com.br/
curl.exe -I --compressed https://seu-dominio.com.br/assets/index-HASH.css
curl.exe -I --compressed https://seu-dominio.com.br/assets/index-HASH.js
```

O resultado esperado é:

- HTML com `Cache-Control: public, max-age=0, must-revalidate`;
- CSS e JavaScript com hash com `max-age=31536000, immutable`;
- `Content-Encoding: br` ou `gzip` quando o módulo correspondente estiver habilitado na conta;
- protocolo HTTP/2 ou superior no navegador ou em uma ferramenta compatível.

Brotli e HTTP/2 dependem dos módulos habilitados no plano/servidor da HostGator. O `.htaccess` ativa Brotli quando disponível e mantém Gzip como alternativa segura.

