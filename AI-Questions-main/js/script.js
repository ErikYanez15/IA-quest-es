import { aleatorio, nome } from "./aleatorio.js"
import { perguntas } from "./perguntas.js"

// Elementos do DOM
const caixaPrincipal = document.querySelector(".caixa-principal")
const caixaPerguntas = document.querySelector(".caixa-perguntas")
const caixaAlternativas = document.querySelector(".caixa-alternativas")
const caixaResultado = document.querySelector(".caixa-resultado")
const textoResultado = document.querySelector(".texto-resultado")
const botaoJogarNovamente = document.querySelector(".novamente-btn")
const botaoIniciar = document.querySelector(".iniciar-btn")
const telaInicial = document.querySelector(".tela-inicial")
const progressoContainer = document.querySelector(".progresso-container")
const progressoBarra = document.querySelector(".progresso")
const botaoTema = document.getElementById("tema-btn")

// Variáveis de estado
let atual = 0
let perguntaAtual
let historiaFinal = ""
const totalPerguntas = perguntas.length

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  // Verificar tema salvo
  const temaSalvo = localStorage.getItem("tema")
  if (temaSalvo) {
    document.documentElement.className = temaSalvo
  }

  // Substituir "você" pelo nome aleatório
  substituiNome()
})

// Alternância de tema
botaoTema.addEventListener("click", () => {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark")
    document.documentElement.classList.add("light")
    localStorage.setItem("tema", "light")
  } else {
    document.documentElement.classList.remove("light")
    document.documentElement.classList.add("dark")
    localStorage.setItem("tema", "dark")
  }
})

// Iniciar jogo
botaoIniciar.addEventListener("click", iniciaJogo)

function iniciaJogo() {
  atual = 0
  historiaFinal = ""
  telaInicial.style.display = "none"
  progressoContainer.style.display = "block"
  caixaPerguntas.style.display = "block"
  caixaAlternativas.style.display = "flex"
  caixaResultado.classList.remove("mostrar")
  atualizaProgresso()
  mostraPergunta()
}

function mostraPergunta() {
  if (atual >= perguntas.length) {
    mostraResultado()
    return
  }

  perguntaAtual = perguntas[atual]

  // Animação de transição
  caixaPerguntas.style.opacity = "0"
  caixaAlternativas.style.opacity = "0"

  setTimeout(() => {
    caixaPerguntas.textContent = perguntaAtual.enunciado
    caixaAlternativas.innerHTML = ""
    mostraAlternativas()

    caixaPerguntas.style.opacity = "1"
    caixaAlternativas.style.opacity = "1"
  }, 300)

  atualizaProgresso()
}

function mostraAlternativas() {
  perguntaAtual.alternativas.forEach((alternativa, index) => {
    const botaoAlternativas = document.createElement("button")
    botaoAlternativas.textContent = alternativa.texto
    botaoAlternativas.addEventListener("click", () => respostaSelecionada(alternativa))

    // Adicionar delay para animação em cascata
    setTimeout(() => {
      caixaAlternativas.appendChild(botaoAlternativas)
      botaoAlternativas.style.opacity = "1"
    }, index * 100)
  })
}

function respostaSelecionada(opcaoSelecionada) {
  const afirmacoes = aleatorio(opcaoSelecionada.afirmacao)
  historiaFinal += afirmacoes + " "

  if (opcaoSelecionada.proxima !== undefined) {
    atual = opcaoSelecionada.proxima
  } else {
    mostraResultado()
    return
  }

  mostraPergunta()
}

function mostraResultado() {
  progressoContainer.style.display = "none"
  caixaPerguntas.style.display = "none"
  caixaAlternativas.style.display = "none"

  caixaPerguntas.textContent = `Em 2049, ${nome}`
  textoResultado.textContent = historiaFinal
  caixaResultado.classList.add("mostrar")

  botaoJogarNovamente.addEventListener("click", jogaNovamente)
}

function jogaNovamente() {
  atual = 0
  historiaFinal = ""
  caixaResultado.classList.remove("mostrar")
  progressoContainer.style.display = "block"
  caixaPerguntas.style.display = "block"
  caixaAlternativas.style.display = "flex"
  atualizaProgresso()
  mostraPergunta()
}

function atualizaProgresso() {
  // Calcular progresso baseado na pergunta atual
  const progresso = (atual / (totalPerguntas - 1)) * 100
  progressoBarra.style.width = `${progresso}%`
}

function substituiNome() {
  for (const pergunta of perguntas) {
    pergunta.enunciado = pergunta.enunciado.replace(/você/g, nome)
  }
}
