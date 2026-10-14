import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

// ==============================================================================
// SCRIPT DE LIMPEZA E PREPARAÇÃO PARA DUMP / MIGRAÇÃO (BELEZURA NEWS)
// ==============================================================================
// Este script executa a higienização do banco de dados antes da exportação:
// 1. Mantém o(s) usuário(s) ADMIN intacto(s) e sua senha criptografada.
// 2. Reatribui matérias de redatores de teste ao ADMIN para evitar quebra de FK (onDelete: Restrict).
// 3. Deleta todos os usuários de teste / não-administradores.
// 4. Deleta todos os leads e inscritos falsos da newsletter.
// 5. Deleta todos os logs de audiência da tabela post_views.
// 6. Reseta o contador de views de todos os posts de volta para 0.
// 7. Preserva 100% dos posts, categorias, tags e configurações do site.
// ==============================================================================

async function cleanDatabase() {
  console.log("\n==============================================================");
  console.log("🧹 [DBA FAXINA] Iniciando limpeza pré-migração do Belezura News");
  console.log("==============================================================\n");

  try {
    // --------------------------------------------------------------------------
    // ETAPA 1: LOCALIZAR O USUÁRIO ADMIN PRINCIPAL
    // --------------------------------------------------------------------------
    console.log("🔍 [1/5] Verificando integridade das contas de Administrador...");
    
    // Procura prioritariamente por admin@belezuranews.com.br ou qualquer role ADMIN
    const primaryAdmin =
      (await prisma.user.findUnique({
        where: { email: "admin@belezuranews.com.br" },
      })) ||
      (await prisma.user.findFirst({
        where: { role: Role.ADMIN },
        orderBy: { createdAt: "asc" },
      }));

    if (!primaryAdmin) {
      throw new Error(
        "❌ ERRO CRÍTICO: Nenhum usuário com role ADMIN foi encontrado no banco de dados.\n" +
          "A operação foi abortada imediatamente para evitar perda de acesso à aplicação."
      );
    }

    console.log(
      `   ✓ Admin preservado: ${primaryAdmin.name} (${primaryAdmin.email}) [ID: ${primaryAdmin.id}]`
    );

    // --------------------------------------------------------------------------
    // ETAPA 2: REATRIBUIÇÃO DE AUTORIA E DELEÇÃO DE USUÁRIOS DE TESTE
    // --------------------------------------------------------------------------
    console.log("\n👥 [2/5] Higienizando tabela de usuários (mantendo apenas administradores)...");

    // Identifica se há posts associados a usuários não-admin
    const postsWithNonAdminAuthors = await prisma.post.count({
      where: {
        author: {
          role: { not: Role.ADMIN },
        },
      },
    });

    if (postsWithNonAdminAuthors > 0) {
      console.log(
        `   ↳ Reatribuindo ${postsWithNonAdminAuthors} matéria(s) de teste para o Admin (${primaryAdmin.email}) para respeitar FK (onDelete: Restrict)...`
      );
      await prisma.post.updateMany({
        where: {
          author: {
            role: { not: Role.ADMIN },
          },
        },
        data: {
          authorId: primaryAdmin.id,
        },
      });
      console.log("   ✓ Autoria das matérias reatribuída com sucesso.");
    }

    // Deleta todos os usuários que não são ADMIN
    const deletedUsersResult = await prisma.user.deleteMany({
      where: {
        role: { not: Role.ADMIN },
      },
    });
    console.log(
      `   ✓ ${deletedUsersResult.count} usuário(s) de teste/redatores removido(s) com sucesso.`
    );

    // --------------------------------------------------------------------------
    // ETAPA 3: LIMPEZA DOS INSCRITOS DA NEWSLETTER
    // --------------------------------------------------------------------------
    console.log("\n📬 [3/5] Limpando tabela de inscritos na Newsletter (newsletter_subscribers)...");
    
    const deletedNewsletterResult = await prisma.newsletterSubscriber.deleteMany({});
    console.log(
      `   ✓ ${deletedNewsletterResult.count} inscrito(s) de teste removido(s).`
    );

    // --------------------------------------------------------------------------
    // ETAPA 4: RESET DOS LOGS DE AUDIÊNCIA E CONTADORES DE VIEWS
    // --------------------------------------------------------------------------
    console.log("\n📊 [4/5] Resetando métricas do Dashboard e visualizações infladas...");
    
    // Deleta os registros individuais da tabela de logs post_views
    const deletedViewsResult = await prisma.postView.deleteMany({});
    console.log(
      `   ✓ ${deletedViewsResult.count} log(s) de visualizações removido(s) da tabela 'post_views'.`
    );

    // Reseta o contador numérico de views de todos os posts para 0
    const resetPostsResult = await prisma.post.updateMany({
      data: {
        views: 0,
      },
    });
    console.log(
      `   ✓ Contador 'views' resetado para 0 em ${resetPostsResult.count} matéria(s).`
    );

    // --------------------------------------------------------------------------
    // ETAPA 5: AUDITORIA FINAL DE PRESERVAÇÃO DE CONTEÚDO
    // --------------------------------------------------------------------------
    console.log("\n🛡️  [5/5] Auditando integridade do conteúdo preservado...");
    
    const remainingPosts = await prisma.post.count();
    const remainingCategories = await prisma.category.count();
    const remainingTags = await prisma.tag.count();
    const remainingAdmins = await prisma.user.count({
      where: { role: Role.ADMIN },
    });

    console.log("\n==============================================================");
    console.log("🎉 RELATÓRIO FINAL: BANCO DE DADOS PRONTO PARA O DUMP");
    console.log("==============================================================");
    console.log(` • Usuários Admin Mantidos:      ${remainingAdmins}`);
    console.log(` • Usuários de Teste Deletados:  ${deletedUsersResult.count}`);
    console.log(` • Leads de Newsletter Limpos:   ${deletedNewsletterResult.count}`);
    console.log(` • Logs de Post Views Limpos:    ${deletedViewsResult.count}`);
    console.log(` • Matérias Preservadas:         ${remainingPosts} (com views zeradas)`);
    console.log(` • Categorias Preservadas:       ${remainingCategories}`);
    console.log(` • Tags Preservadas:             ${remainingTags}`);
    console.log("==============================================================");
    console.log("✅ Banco higienizado com sucesso! Pode gerar o dump SQL com segurança.\n");
  } catch (error) {
    console.error("\n❌ Falha durante a execução da limpeza:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase();
