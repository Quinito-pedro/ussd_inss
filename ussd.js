// ussd.js

let currentNumber = '';
let currentMenu = 'main';
let menuHistory = [];

// Dados mock (simulação)
const mockUser = {
  nome: 'João António Silva',
  inscricao: '123456789',
  nascimento: '01/01/1980',
  estado: 'Activo',
  ultimaContribuicao: 'Maio/2025',
  totalMesesDeclarados: 60,
  totalMesesPagos: 55,
  mesesDivida: 5,
  valorContribuicao: '2.500,00 MT',
  requerimentos: [
    {
      id: '2025001',
      tipo: 'Pensão de Velhice',
      estado: 'Em análise',
      data: '15/05/2025',
    },
  ],
  contatos: {
    sede: 'Av. 24 de Julho, no 3549, 6º andar, Maputo',
    telefones: ['+258 867455868', '+258 84 4909293'],
    email: 'inss@inss.gov.mz',
    horario: 'Segunda a Sexta: 07:30 - 15:30',
    portal: 'www.inss.gov.mz',
  },
};

// Atualizar horário
function updateTime() {
  const now = new Date();
  const time =
    now.getHours().toString().padStart(2, '0') +
    ':' +
    now.getMinutes().toString().padStart(2, '0');
  document.getElementById('current-time').textContent = time;
}
updateTime();
setInterval(updateTime, 60000);

// Adicionar dígito no discador
function addDigit(digit) {
  currentNumber += digit;
  document.getElementById('number-input').value = currentNumber;
}

// Limpar número no discador
function clearNumber() {
  currentNumber = '';
  document.getElementById('number-input').value = '';
}

// Mostrar loading
function showLoading(text = 'Conectando ao INSS...') {
  document.getElementById('ussd-content').innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>${text}</p>
    </div>
  `;
}

// Abrir tela USSD e mostrar menu principal
function openUssdScreen() {
  document.getElementById('dialer-screen').style.display = 'none';
  document.getElementById('ussd-screen').classList.add('active');
  showMainMenu();
}

// Voltar para discador
function closeUssdScreen() {
  document.getElementById('ussd-screen').classList.remove('active');
  document.getElementById('dialer-screen').style.display = 'flex';
  clearNumber();
  currentMenu = 'main';
  menuHistory = [];
}

// Fazer chamada
function makeCall() {
  if (currentNumber === '*122#') {
    showLoading();
    setTimeout(() => {
      openUssdScreen();
    }, 1500);
  } else if (currentNumber.trim() === '') {
    alert('Digite um número primeiro');
  } else {
    alert('Código USSD inválido. Use *122# para acessar o INSS');
    clearNumber();
  }
}

// Voltar no menu
function goBack() {
  if (menuHistory.length > 0) {
    const previousMenu = menuHistory.pop();
    navigateToMenu(previousMenu);
  } else {
    showMainMenu();
  }
}

// Navegação
function navigateToMenu(menu) {
  switch (menu) {
    case 'main':
      showMainMenu();
      break;
    case 'painel':
      showPainelBeneficiario();
      break;
    case 'extracto':
      showExtracto();
      break;
    case 'dados':
      showDadosCadastrais();
      break;
    case 'requerimentos':
      showRequerimentos();
      break;
    case 'maternidade':
      showMaternidade();
      break;
    case 'maisinfo':
      showMaisInformacoes();
      break;
    default:
      showMainMenu();
      break;
  }
}

// Selecionar opção do menu principal
function selectOption(option) {
  menuHistory.push(currentMenu);
  switch (option) {
    case '1':
      currentMenu = 'painel';
      showPainelBeneficiario();
      break;
    case '2':
      currentMenu = 'extracto';
      showExtracto();
      break;
    case '3':
      currentMenu = 'dados';
      showDadosCadastrais();
      break;
    case '4':
      currentMenu = 'requerimentos';
      showRequerimentos();
      break;
    case '5':
      currentMenu = 'maternidade';
      showMaternidade();
      break;
    case '6':
      currentMenu = 'maisinfo';
      showMaisInformacoes();
      break;
    case '0':
      endSession();
      break;
    default:
      alert('Opção inválida');
      menuHistory.pop();
      break;
  }
}

// Menu principal
function showMainMenu() {
  currentMenu = 'main';
  menuHistory = [];
  document.getElementById('ussd-content').innerHTML = `
    <h2>INSS Moçambique</h2>
    <p><strong>Selecione uma opção:</strong></p>
    <ul>
      <li onclick="selectOption('1')">1. Painel do Beneficiário</li>
      <li onclick="selectOption('2')">2. Extrato do Beneficiário</li>
      <li onclick="selectOption('3')">3. Dados Cadastrais</li>
      <li onclick="selectOption('4')">4. Requerimentos</li>
      <li onclick="selectOption('5')">5. Maternidade</li>
      <li onclick="selectOption('6')">6. Mais Informações</li>
      <li onclick="selectOption('0')" style="border-left-color: #f44336;">0. Sair</li>
    </ul>
    <div class="ussd-actions">
      <button class="ussd-button secondary" onclick="endSession()">Cancelar</button>
    </div>
  `;
}

// Mostrar dados do painel beneficiário
function showPainelBeneficiario() {
  document.getElementById('ussd-content').innerHTML = `
    <h2>Painel do Beneficiário</h2>
    <p><strong>Nome:</strong> ${mockUser.nome}</p>
    <p><strong>No Inscrição:</strong> ${mockUser.inscricao}</p>
    <p><strong>Estado:</strong> ${mockUser.estado}</p>
    <p><strong>Última Contribuição:</strong> ${mockUser.ultimaContribuicao}</p>
    <div class="ussd-actions">
      <button class="ussd-button" onclick="goBack()">Voltar</button>
      <button class="ussd-button secondary" onclick="endSession()">Sair</button>
    </div>
  `;
}

// Mostrar extrato de contribuições
function showExtracto() {
  document.getElementById('ussd-content').innerHTML = `
    <h2>Extrato do Beneficiário</h2>
    <p><strong>Total de Meses Declarados:</strong> ${mockUser.totalMesesDeclarados}</p>
    <p><strong>Total de Meses Pagos:</strong> ${mockUser.totalMesesPagos}</p>
    <p><strong>Meses em Dívida:</strong> ${mockUser.mesesDivida}</p>
    <p><strong>Última Contribuição:</strong> ${mockUser.ultimaContribuicao}</p>
    <p><strong>Valor:</strong> ${mockUser.valorContribuicao}</p>
    <div class="ussd-actions">
      <button class="ussd-button" onclick="goBack()">Voltar</button>
      <button class="ussd-button secondary" onclick="endSession()">Sair</button>
    </div>
  `;
}

// Mostrar dados cadastrais
function showDadosCadastrais() {
  document.getElementById('ussd-content').innerHTML = `
    <h2>Dados Cadastrais</h2>
    <p><strong>Nome Completo:</strong> ${mockUser.nome}</p>
    <p><strong>No Inscrição:</strong> ${mockUser.inscricao}</p>
    <p><strong>Data de Nascimento:</strong> ${mockUser.nascimento}</p>
    <p><strong>Estado:</strong> ${mockUser.estado}</p>
    <div class="ussd-actions">
      <button class="ussd-button" onclick="goBack()">Voltar</button>
      <button class="ussd-button secondary" onclick="endSession()">Sair</button>
    </div>
  `;
}

// Mostrar requerimentos
function showRequerimentos() {
  let requerimentosHTML = '';
  mockUser.requerimentos.forEach((req) => {
    requerimentosHTML += `
      <div style="background: rgba(76, 175, 80, 0.1); padding: 10px; margin: 10px 0; border-radius: 5px; border-left: 2px solid #4caf50;">
        <p><strong>Requerimento #${req.id}</strong></p>
        <p>Tipo: ${req.tipo}</p>
        <p>Estado: ${req.estado}</p>
        <p>Data: ${req.data}</p>
      </div>
    `;
  });

  document.getElementById('ussd-content').innerHTML = `
    <h2>Verificar Requerimentos</h2>
    <p><strong>Estado dos seus requerimentos:</strong></p>
    ${requerimentosHTML}
    <p>Para mais detalhes, contacte a delegação ou acesse o portal online.</p>
    <div class="ussd-actions">
      <button class="ussd-button" onclick="goBack()">Voltar</button>
      <button class="ussd-button secondary" onclick="endSession()">Sair</button>
    </div>
  `;
}

// Mostrar informações maternidade
function showMaternidade() {
  document.getElementById('ussd-content').innerHTML = `
    <h2>Maternidade</h2>
    <p><strong>Benefícios relacionados à maternidade:</strong></p>
    <ul style="margin: 10px 0;">
      <li>Licença maternidade remunerada</li>
      <li>Auxílio pré-natal</li>
      <li>Assistência médica e hospitalar</li>
    </ul>
    <p>Para solicitar, dirija-se à delegação mais próxima com os documentos necessários.</p>
    <div class="ussd-actions">
      <button class="ussd-button" onclick="goBack()">Voltar</button>
      <button class="ussd-button secondary" onclick="endSession()">Sair</button>
    </div>
  `;
}

// Mostrar submenu "Mais Informações"
function showMaisInformacoes() {
  document.getElementById('ussd-content').innerHTML = `
    <h2>Mais Informações</h2>
    <ul>
      <li onclick="showContacts()">Contactos INSS</li>
      <li onclick="showSobre()">Sobre o INSS</li>
      <li onclick="showAjuda()">Ajuda</li>
      <li onclick="goBack()" style="border-left-color: #f44336;">Voltar</li>
    </ul>
  `;
}

// Mostrar contatos
function showContacts() {
  document.getElementById('ussd-content').innerHTML = `
    <h2>Contactos INSS</h2>
    <p><strong>Sede Nacional:</strong></p>
    <p>${mockUser.contatos.sede}</p>
    <p>${mockUser.contatos.telefones.join('<br>')}</p>
    <p>${mockUser.contatos.email}</p>
    <p><strong>Horário de Atendimento:</strong></p>
    <p>${mockUser.contatos.horario}</p>
    <p><strong>Portal Online:</strong> ${mockUser.contatos.portal}</p>
    <div class="ussd-actions">
      <button class="ussd-button" onclick="showMaisInformacoes()">Voltar</button>
      <button class="ussd-button secondary" onclick="endSession()">Sair</button>
    </div>
  `;
}

// Mostrar sobre o INSS
function showSobre() {
  document.getElementById('ussd-content').innerHTML = `
    <h2>Sobre o INSS</h2>
    <p>O Instituto Nacional de Segurança Social (INSS) é uma instituição pública destinada a assegurar benefícios sociais aos cidadãos moçambicanos, incluindo aposentadorias, pensões, e auxílios diversos.</p>
    <div class="ussd-actions">
      <button class="ussd-button" onclick="showMaisInformacoes()">Voltar</button>
      <button class="ussd-button secondary" onclick="endSession()">Sair</button>
    </div>
  `;
}

// Mostrar ajuda
function showAjuda() {
  document.getElementById('ussd-content').innerHTML = `
    <h2>Ajuda</h2>
    <p>Para navegar, selecione o número correspondente à opção desejada.</p>
    <p>Use o botão 'Voltar' para retornar ao menu anterior.</p>
    <p>Para encerrar a sessão, selecione a opção 'Sair' ou 'Cancelar'.</p>
    <div class="ussd-actions">
      <button class="ussd-button" onclick="showMaisInformacoes()">Voltar</button>
      <button class="ussd-button secondary" onclick="endSession()">Sair</button>
    </div>
  `;
}

// Encerrar sessão
function endSession() {
  document.getElementById('ussd-content').innerHTML = `
    <div class="loading">
      <p style="font-size: 16px; color: #4caf50;">Sessão encerrada</p>
      <p>Obrigado por usar os serviços INSS</p>
    </div>
  `;
  setTimeout(() => {
    closeUssdScreen();
  }, 2000);
}

// Navegação via teclado
document.addEventListener('keydown', function (event) {
  if (document.getElementById('dialer-screen').style.display !== 'none') {
    if (event.key >= '0' && event.key <= '9') {
      addDigit(event.key);
    } else if (event.key === '*') {
      addDigit('*');
    } else if (event.key === '#') {
      addDigit('#');
    } else if (event.key === 'Enter') {
      makeCall();
    } else if (event.key === 'Backspace') {
      currentNumber = currentNumber.slice(0, -1);
      document.getElementById('number-input').value = currentNumber;
    }
  } else if (
    document.getElementById('ussd-screen').classList.contains('active')
  ) {
    if (event.key >= '0' && event.key <= '9') {
      selectOption(event.key);
    }
  }
});
