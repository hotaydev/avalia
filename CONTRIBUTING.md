# Contribuindo com o Avalia

Obrigado pelo seu interesse! :heart: Nós adoraríamos que você contribuísse com o Avalia e ajudasse a torná-lo ainda melhor do que é hoje!

Como um colaborador, aqui está uma visão geral de coisas para aprender e maneiras de se envolver:

- [Código de Conduta](#código-de-conduta)
- [Como posso ajudar?](#como-posso-ajudar)
  - [Contribuições de Código](#contribuições-de-código)
- [Pergunta ou Problema?](#tem-uma-pergunta-ou-um-problema)
- [Problemas e Bugs](#encontrou-um-bug)
- [Solicitações de Recursos](#faltando-um-recurso)
- [Reportar um Problema](#abrindo-uma-issue)
- [Enviar uma Pull Request](#enviar-uma-pull-request-pr)

## Código de Conduta

Ajude-nos a manter o Avalia aberto e inclusivo.
Por favor, leia e siga nosso [Código de Conduta][https://github.com/hotaydev/avalia/blob/main/.github/CODE_OF_CONDUCT.md].

## Como posso ajudar?

Existem muitas maneiras de ajudar. Aqui estão algumas formas de contribuir sem codificar:

- Você pode ajudar os outros em nossa [Página de Discussões no Github][https://github.com/hotaydev/avalia/discussions/categories/q-a].
- Você pode [contribuir para a documentação oficial](https://github.com/hotaydev/avalia/tree/main/docs).
- Você pode confirmar bugs na [aba de issues][https://github.com/hotaydev/avalia/issues] e mencionar os passos para reproduzi-los. Isso ajuda a equipe principal a receber mais relatórios para que possamos corrigir os bugs de maior prioridade.

Para maneiras de ajudar com código, leia a próxima seção.

### Contribuições de Código

Para os colaboradores que querem ajudar com código, temos uma lista de [bons primeiros problemas](https://github.com/hotaydev/avalia/labels/good%20first%20issue) para ajudá-lo a começar.
Esses são problemas amigáveis para iniciantes e não requerem conhecimento avançado da base de código. Nós incentivamos novos colaboradores a começar com esses problemas e, gradualmente, passar para tarefas mais desafiadoras.

## Tem uma Pergunta ou um Problema?

Por favor, não abra issues para perguntas gerais de suporte, pois queremos manter a seção de issues do GitHub para relatórios de bugs e solicitações de recursos.
Em vez disso, recomendamos usar nossa aba de [Discussões no Github][https://github.com/hotaydev/avalia/discussions/categories/q-a] para fazer perguntas relacionadas ao suporte.

Esses canais são um lugar muito melhor para fazer perguntas porque:

- Há mais pessoas dispostas a ajudar lá
- Perguntas e respostas ficam disponíveis para visualização pública, então sua pergunta/resposta pode ajudar outra pessoa
- O sistema de votação dos canais garante que as melhores respostas sejam visíveis de forma proeminente.

Para economizar seu tempo e o nosso, sistematicamente fecharemos todos os problemas que sejam pedidos de suporte geral e redirecionaremos as pessoas para o fórum.

Se você quiser conversar sobre seu problema em tempo real, pode entrar em contato com o [@TaylorHo][https://github.com/TaylorHo].

## Encontrou um Bug?

Se você encontrar um bug, pode nos ajudar [abrindo uma issue](#abrindo-uma-issue) no nosso [Repositório no GitHub][https://github.com/hotaydev/avalia].
Ainda melhor, você pode [enviar uma Pull Request](#enviar-um-pull-request-pr) com uma correção.

## Faltando um Recurso?

Você pode _solicitar_ um novo recurso [enviando uma issue](#abrindo-uma-issue) aqui mesmo no GitHub.
Se você gostaria de _implementar_ um novo recurso, por favor, abra uma issue e descreva sua proposta para que possa ser discutida.
É sempre benéfico se envolver em discussões sobre um recurso antes de começar seu desenvolvimento. Essa abordagem proativa ajuda a identificar se o recurso pode ser controverso ou não ter utilidade generalizada.

## Abrindo uma issue

Antes de abrir uma Issue, por favor, pesquise no [aba de issues][https://github.com/hotaydev/avalia/issues]. Um problema para sua situação pode já existir, e a discussão pode informá-lo sobre soluções alternativas prontamente disponíveis.

Para enviar um problema, [preencha a issue usando um modelo][https://github.com/hotaydev/avalia/issues/new]. Por favor, registre apenas uma issue por vez e não enumere vários bugs na mesma issue.

## Enviar uma Pull Request (PR)

Sua PR deve ser aberta **da sua branch, do seu fork, diretamente para a branch principal**. Gerenciamos as versões publicando um release e uma tag aqui, no GitHub.

Antes de trabalhar em seu pull request, por favor, verifique o seguinte:

1. Pesquise no [GitHub][https://github.com/hotaydev/avalia/pulls] por PRs relacionados que possam afetar sua submissão.

2. Certifique-se de que há uma issue que descreva o problema que você está corrigindo ou o comportamento e o design do recurso que você gostaria de adicionar.

3. Por favor, assine nosso [Contrato de Licença de Contribuidor (CLA)](#sign-the-cla). Não podemos aceitar código sem um CLA assinado.

Depois de fazer isso, você está pronto para trabalhar na sua PR! Para criar uma PR, faça um fork deste repositório e trabalhe nele. Depois que você incluir algum código no seu fork, você poderá abrir uma PR para o repositório do Avalia.

Para mais informações, você pode seguir este [guia do GitHub](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork).
Para mais guias de PR do github, veja [estes guias](https://docs.github.com/en/pull-requests).

### Diretrizes para PR

Ao enviar um Pull Request (PR) ou ao esperar por uma revisão subsequente, siga estas diretrizes:

1. A PR deve estar pronta para revisão. Se o trabalho estiver pendente ou em desenvolvimento, considere deixar as alterações no seu fork, aguardando para abrir a PR, ou então abra uma [PR de rascunho](https://github.blog/2019-02-14-introducing-draft-pull-requests/).

2. A PR passa nos testes e verificações de lint (utilizamos o [Biome](https://biomejs.dev/)).

3. A PR não tem conflitos de merge.

4. Os commits e os títulos da Pull Request devem usar os prefixos/tipos de [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary). A mensagem do commit e o título do PR devem ter o mesmo formato, por exemplo, `<prefix>: descrição ...`. Os prefixos mais usados são:
   - `fix` ou `bugfix` - Correções de bugs.
   - `feat` ou `feature` - Novos recursos.
   - `chore` - Alterações diversas que não são feat ou fix. Normalmente evitamos usar esta categoria.
   - `enhance` - Melhorias em recursos existentes.
   - `test` - Alterações apenas em testes.
   - `ci` - Alterações no sistema ou fluxo de CI/CD.
   - `build` - Alterações no sistema de build.
   - `docs` - Alterações na documentação. A documentação fica na pasta `/docs`
   - `style` - Alterações nos estilos e padrões de código, ou estilos visuais do projeto.
   - `refactor` - Relacionado a algum refatoramento de código, visando melhorias de legibilidade ou simplicidade.
   - `perf` ou `performance` - Específico para o desempenho do código ou da aplicação.

> Se seu PR introduzir uma mudança significativa, adicione um `!` ao final do commit, por exemplo, `<prefix>!: descrição ...`

5.  Agradecemos se o PR tiver "permitir edições de mantenedores" habilitado. Isso nos ajuda a apoiar sua contribuição.

### Links Adicionais para PR

- Para rodar o avalia localmente, basta clonar este repositório, executar um `npm install`, e rodar um `npm run dev` para rodar o projeto. Lembre de preencher o arquivo de variáveis de ambiente, `.env.local`.
  - Para rodar a documentação, acesse a pasta `/docs` e rode um `nom run dev` lá.

### Assine o CLA

Por favor, assine nosso Contrato de Licença de Contribuidor (CLA) antes de enviar pull requests. Para que qualquer alteração de código seja aceita, o CLA deve ser assinado. Prometemos que é um processo rápido!

Nós temos um CLA apenas para poder usar as contribuições da comunidade de forma comercial, visando licenciar o avalia para empresas e grandes equipes. Dessa forma, podemos apoiar financeiramente o desenvolvimento do projeto.

[Você pode ver e assinar nosso CLA aqui][https://cla-assistant.io/hotaydev/avalia].

Se você tiver mais de uma conta no GitHub ou vários endereços de e-mail associados a uma única conta do GitHub, deve assinar o CLA usando o endereço de e-mail principal da conta do GitHub usada para autorar commits e enviar pull requests.

Os seguintes documentos podem ajudá-lo a resolver problemas com contas do GitHub e vários endereços de e-mail:

- <https://help.github.com/articles/setting-your-commit-email-address-in-git/>
- <https://stackoverflow.com/questions/37245303/what-does-usera-committed-with-userb-13-days-ago-on-github-mean>
- <https://help.github.com/articles/about-commit-email-addresses/>
- <https://help.github.com/articles/blocking-command-line-pushes-that-expose-your-personal-email-address/>

## Obrigado

Suas contribuições para o código aberto, grandes ou pequenas, tornam possíveis projetos incríveis como este. Obrigado por dedicar seu tempo para contribuir.
