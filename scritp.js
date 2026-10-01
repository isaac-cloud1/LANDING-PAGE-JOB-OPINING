// 1. Pegamos os elementos do HTML que vamos usar, pelo id
const form = document.getElementById("form-vaga");
const tabela = document.getElementById("tabela-vagas");
const contador = document.getElementById("contador");

// 2. Lista de vagas (um array de objetos). Fica salva no navegador com localStorage
const CHAVE = "vagas-estagio";
let vagas = carregar();

function carregar() {
  try {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo) return JSON.parse(salvo);
  } catch (erro) {
    // se o navegador bloquear o armazenamento, seguimos sem salvar
  }
  // vagas de exemplo para a tabela não começar vazia
  return [
    { empresa: "Tech Norte", cargo: "Estágio em Desenvolvimento Web", area: "Tecnologia", modalidade: "Híbrido", bolsa: "1200", contato: "rh@technorte.com" },
    { empresa: "Loja Central", cargo: "Estágio em Marketing", area: "Marketing", modalidade: "Presencial", bolsa: "", contato: "vagas@lojacentral.com" }
  ];
}

function salvar() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(vagas));
  } catch (erro) {}
}

// 3. Desenha a tabela: apaga tudo e cria uma linha (<tr>) para cada vaga
function mostrar() {
  tabela.replaceChildren();

  if (vagas.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 7;
    td.className = "vazio";
    td.textContent = "Nenhuma vaga cadastrada ainda.";
    tr.append(td);
    tabela.append(tr);
  }

  vagas.forEach((vaga, posicao) => {
    const tr = document.createElement("tr");

    const bolsa = vaga.bolsa
      ? Number(vaga.bolsa).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      : "A combinar";

    [vaga.empresa, vaga.cargo, vaga.area, vaga.modalidade, bolsa, vaga.contato].forEach(texto => {
      const td = document.createElement("td");
      td.textContent = texto; // textContent trata o texto como texto puro (mais seguro que innerHTML)
      tr.append(td);
    });

    // botão para remover a vaga
    const tdAcao = document.createElement("td");
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "remover";
    botao.textContent = "Remover";
    botao.addEventListener("click", () => {
      vagas.splice(posicao, 1); // tira 1 item daquela posição
      salvar();
      mostrar();
    });
    tdAcao.append(botao);
    tr.append(tdAcao);

    tabela.append(tr);
  });

  contador.textContent = `(${vagas.length})`;
}

// 4. Quando o formulário é enviado: lê os campos, guarda a vaga e atualiza a tabela
form.addEventListener("submit", evento => {
  evento.preventDefault(); // impede a página de recarregar

  const dados = Object.fromEntries(new FormData(form)); // vira { empresa: "...", cargo: "...", ... }
  vagas.unshift(dados); // unshift coloca a nova vaga no topo da lista
  salvar();
  mostrar();
  form.reset(); // limpa o formulário

  document.getElementById("vagas").scrollIntoView(); // leva o usuário até a tabela
});

// 5. Mostra a tabela assim que a página abre
mostrar();
