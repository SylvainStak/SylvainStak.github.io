//Renderiza captcha
window.onload = function() {
  render();
};

//Popover codigo de verificacion erroneo
$('body').on('click', function (e) {
  if ($(e.target).data('toggle') !== 'popover'
      && $(e.target).parents('.popover.in').length === 0) { 
      $('[data-toggle="popover"]').popover('hide');
  }
});

let prefix;

//Genera el captcha para login con movil
function render(){
  window.recaptchaVerifier=new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    'size': 'normal'
  });
  recaptchaVerifier.render();
}

//Obtiene el numero del telefono y verifica el captcha
//para mandar un SMS con el codigo de verificacion
function phoneAuth(){
  let number = `${prefix}${$('#phoneNumber').val()}`;
  
  firebase.auth().signInWithPhoneNumber(number, window.recaptchaVerifier)
  .then(confirmationResult => {
    window.confirmationResult = confirmationResult;
    coderesult = confirmationResult;
    document.getElementById('mensaje').innerHTML = 'Se le ha enviado un código de verificación al número de teléfono marcado. Introduzcalo en la caja de texto a continuación:';
    document.getElementById('confirmarCodigo').disabled = false;
  })
  .catch(error => {
    console.log('Ha habido algun error al enviar el codigo de verificacion al numero marcado');
  });
}

//Verifica el codigo enviado previamente al usuario
function codeVerify(){
  let code = $('#verificationCode').val();

  coderesult.confirm(code)
  .then(result => {
    
  }).catch(err => {
    console.log('codigo incorrecto');
    $('#verificationCode').popover("toggle");
  });
}

//Configuracion Firebase
var firebaseConfig = {
  apiKey: 'AIzaSyDXH9SffIOVmOUB86JXe9219Rp4bzCNu_I',
  authDomain: 'filtros-y-mapas.firebaseapp.com',
  databaseURL: 'https://filtros-y-mapas.firebaseio.com',
  projectId: 'filtros-y-mapas',
  storageBucket: 'filtros-y-mapas.appspot.com',
  messagingSenderId: '510530021035',
  appId: '1:510530021035:web:09a3da2c54587f340039ee'
};

firebase.initializeApp(firebaseConfig);

//Login Providers
var googleProvider = new firebase.auth.GoogleAuthProvider();
var twitterProvider = new firebase.auth.TwitterAuthProvider();
var githubProvider = new firebase.auth.GithubAuthProvider();

document.getElementById('googleLogin').addEventListener('click', () => {
  firebase.auth().signInWithPopup(googleProvider).then(result => {}).catch(err => console.log(err));
});

document.getElementById('twitterLogin').addEventListener('click', () => {
  firebase.auth().signInWithPopup(twitterProvider).then(result => {}).catch(err => console.log(err));
});

document.getElementById('githubLogin').addEventListener('click', () => {
  firebase.auth().signInWithPopup(githubProvider).then(result => {}).catch(err => console.log(err));
});

document.getElementById('phone').addEventListener('click', () => {
  $('#myModal2').modal('show');
});

document.getElementById('enviarSMS').addEventListener('click', () => phoneAuth());
document.getElementById('confirmarCodigo').addEventListener('click', () => codeVerify());

document.getElementById('login').addEventListener('click',  () => {
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;

  firebase.auth().signInWithEmailAndPassword(email, password).catch(err => {
    $('#errorLogin').removeClass('invisible');
  });
});

$('#signup').click(() => {
  $('#myModal').modal('show');
});

$('#newUser').click(() => {
  let email = $('#newEmail').val();
  let pass = $('#newPassword').val();

  firebase.auth().createUserWithEmailAndPassword(email, pass)
  .catch(err => {
    console.log(err);
  });

  $('#myModal').modal('hide');
});

document.getElementById('password').addEventListener('keyup', (e) => {
  $('#errorLogin').addClass('invisible');

  if(e.keyCode === 13){
    e.preventDefault();
    document.getElementById('login').click();
  }
});

document.getElementById('email').addEventListener('keyup', () => {
  $('#errorLogin').addClass('invisible');
});

document.getElementById('newPassword').addEventListener('keyup', () => checkNewUser());
document.getElementById('newEmail').addEventListener('keyup', () => checkNewUser());

function checkNewUser(){
  let actualPass = $('#newPassword').val();
  let actualEmail = $('#newEmail').val();

  let regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  let regexEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

  let passReqLetra = document.getElementById('passReq3');
  let passReqNum = document.getElementById('passReq2');
  let passReqLong = document.getElementById('passReq1');

  let check = '<i class="fas fa-check-circle text-success"></i>';
  let unCheck = '<i class="fas fa-times-circle text-danger"></i>';

  if(/[a-z]/i.test(actualPass)) passReqLetra.innerHTML = check;
  else passReqLetra.innerHTML = unCheck;  

  if(/[1-9]/.test(actualPass)) passReqNum.innerHTML = check;
  else passReqNum.innerHTML = unCheck;
  
  if(actualPass.length < 8) passReqLong.innerHTML = unCheck;
  else passReqLong.innerHTML = check; 

  if(regexPassword.test(actualPass) && 
     regexEmail.test(actualEmail)) document.getElementById('newUser').disabled = false;
  else document.getElementById('newUser').disabled = true;
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    window.location = 'mapa.html';
  }
});

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
.then(() => {})
.catch(err => console.log(err));