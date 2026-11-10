// teste.mjs
import http from 'http';

try {
  // Importa o arquivo JavaScript que o esbuild gerou na pasta api
  const module = await import('./api/index.js');
  const handler = module.default;

  if (!handler) {
    console.error("❌ ERRO: O arquivo foi gerado, mas não está exportando o 'default'!");
    process.exit(1);
  }

  // Cria um servidor HTTP local na sua máquina para rodar o build
  const server = http.createServer((req, res) => {
    handler(req, res);
  });

  server.listen(3000, () => {
    console.log("✅ SUCESSO! A API compilada está online localmente em http://localhost:3000");
    console.log("Abra o Postman ou Insomnia e faça uma requisição para testar as rotas.");
  });

} catch (error) {
  console.error("❌ ERRO CRÍTICO AO EXECUTAR A API COMPILADA:");
  console.error(error);
  process.exit(1);
}
