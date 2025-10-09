  const botaoChat = document.getElementById('botao-chat');
  const chatContainer = document.getElementById('chat-container');
  const fecharChat = document.getElementById('fechar-chat');
  const chatBox = document.getElementById('chat-box');
  const userInput = document.getElementById('user-input');
  const enviarBtn = document.getElementById('enviar-btn');
  const whatsappBtn = document.getElementById('whatsapp-btn');

  const dicionario = [
    "orçamento", "preço", "horário", "funciona",
    "produtos", "letra", "caixa", "totem", "acrílico", "contato"
  ];

  function removerAcentos(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function similaridade(str1, str2) {
    str1 = removerAcentos(str1.toLowerCase());
    str2 = removerAcentos(str2.toLowerCase());
    const len = Math.max(str1.length, str2.length);
    let iguais = 0;
    for (let i = 0; i < Math.min(str1.length, str2.length); i++) {
      if (str1[i] === str2[i]) iguais++;
    }
    return iguais / len;
  }

  function corrigirPalavra(palavra) {
    let melhor = palavra;
    let maiorScore = 0;
    dicionario.forEach(dic => {
      const score = similaridade(palavra, dic);
      if (score > maiorScore) {
        maiorScore = score;
        melhor = dic;
      }
    });
    return (maiorScore >= 0.6) ? melhor : palavra;
  }

  function normalizarMensagem(mensagem) {
    return mensagem.split(" ").map(p => corrigirPalavra(p)).join(" ");
  }

  botaoChat.addEventListener('click', () => {
    chatContainer.style.display = 'flex';
    botaoChat.style.display = 'none';
    userInput.focus();

  const mensagem = document.getElementById('chat-message');
  mensagem.style.opacity = "0";
  mensagem.style.transform = "translateY(20px)";

    setTimeout(() => {
      mostrarMensagem("Olá! Selecione uma das opções ou digite sua dúvida:", 'bot');
      mostrarOpcoes([
        "Quero um orçamento",
        "Qual horário de atendimento?",
        "Quais produtos vocês têm?",
        "Contato"
      ]);
    }, 100);
  });

  fecharChat.addEventListener('click', () => {
    chatContainer.style.display = 'none';
    botaoChat.style.display = 'flex';
    chatBox.innerHTML = '';
    whatsappBtn.style.display = 'none';
  });

  function mostrarMensagem(texto, remetente) {
    const div = document.createElement('div');
    div.classList.add('message', remetente);
    div.innerHTML = `<div class="text">${texto}</div>`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function gerarResposta(mensagem) {
    mensagem = normalizarMensagem(mensagem.toLowerCase());
    whatsappBtn.style.display = 'none';

    if(mensagem.includes("orçamento") || mensagem.includes("preço")) {
      whatsappBtn.style.display = 'block';
      whatsappBtn.href = "https://wa.me/5511950840228?text=Olá,%20gostaria%20de%20um%20orçamento%20dos%20produtos.";
      return "Para orçamento, clique no botão abaixo para falar diretamente com nosso time no WhatsApp!";
    }
    if(mensagem.includes("horário") || mensagem.includes("funciona")) {
      return "Nosso horário de atendimento é de segunda a sexta, das 8h às 18h.";
    }
    if(mensagem.includes("produtos")) {
      return "Temos Letra Caixa Inox, PVC e Acrílico. Quer saber o preço ou disponibilidade?";
    }
    if(mensagem.includes("totem")) {
      return "Os totens disponíveis são Totem de Fachada e Mini Totem Iluminado.";
    }
    if(mensagem.includes("acrílico")) {
      return "Letra Acrílica colorida e iluminada, ideal para ambientes internos.";
    }
    if(mensagem.includes("contato")) {
      whatsappBtn.style.display = 'block';
      whatsappBtn.href = "https://wa.me/5511950840228?text=Olá,%20gostaria%20de%20mais%20informações%20sobre%20contato.";
      return "Você pode falar conosco pelo WhatsApp clicando no botão abaixo.";
    }
    return "Desculpe, não entendi sua pergunta. Pode tentar reformular?";
  }

  function mostrarOpcoes(opcoes) {
    const div = document.createElement('div');
    div.classList.add('options');

    opcoes.forEach(op => {
      const btn = document.createElement('button');
      btn.classList.add('option-btn');
      btn.textContent = op;
      btn.onclick = () => {
        mostrarMensagem(op, 'user');
        const respostaBot = gerarResposta(op);
        setTimeout(() => mostrarMensagem(respostaBot, 'bot'), 600);
        div.remove();
      };
      div.appendChild(btn);
    });

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function enviarMensagem() {
    const textoUsuario = userInput.value.trim();
    if(!textoUsuario) return;
    mostrarMensagem(textoUsuario, 'user');
    const respostaBot = gerarResposta(textoUsuario);
    setTimeout(() => mostrarMensagem(respostaBot, 'bot'), 600);
    userInput.value = '';
    userInput.focus();
  }

  enviarBtn.addEventListener('click', enviarMensagem);
  userInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') enviarMensagem();
  });

  // 🔹 Bolha "Posso te ajudar?" acima do botão
  window.addEventListener('load', () => {
    const mensagem = document.getElementById('chat-message');
    setTimeout(() => {
      mensagem.style.opacity = "1";
      mensagem.style.transform = "translateY(0)";
    }, 1000);

    setTimeout(() => {
      mensagem.style.opacity = "0";
      mensagem.style.transform = "translateY(20px)";
    }, 10000);
  });