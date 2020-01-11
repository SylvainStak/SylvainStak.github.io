var firebaseConfig = {
    apiKey: "AIzaSyDXH9SffIOVmOUB86JXe9219Rp4bzCNu_I",
    authDomain: "filtros-y-mapas.firebaseapp.com",
    databaseURL: "https://filtros-y-mapas.firebaseio.com",
    projectId: "filtros-y-mapas",
    storageBucket: "filtros-y-mapas.appspot.com",
    messagingSenderId: "510530021035",
    appId: "1:510530021035:web:09a3da2c54587f340039ee"
};

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        if(firebase.auth().currentUser.displayName != null){
            document.getElementById('actualUser').innerHTML = firebase.auth().currentUser.displayName;
        }else if(firebase.auth().currentUser.email != null){
            document.getElementById('actualUser').innerHTML = firebase.auth().currentUser.email
                                                              .slice(0, firebase.auth().currentUser.email.indexOf('@'));
        }else{
            document.getElementById('actualUser').innerHTML = 'Invitado'; 
        }                   
    }
});

document.getElementById('signout').addEventListener('click', () => {
    firebase.auth().signOut().then(() => window.location = 'index.html').catch(function(error) {});
});