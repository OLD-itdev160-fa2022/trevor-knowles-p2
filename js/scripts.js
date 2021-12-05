var logins = [
    {user:'admin',pass:'secretpass'},
    {user:'test',pass:'testing123'},
    {user:'enduser',pass:'Passw0rd'}
];
var bookings = [];
var curruser = '';

function get(element) {
    return document.getElementById(element);
}

function openLoginModal(){
    var modal = get('modal-login');
    modal.classList.remove('invisible');
    closeRegisterModal();
}
function openRegisterModal(){
    var modal = get('modal-signup');
    modal.classList.remove('invisible');
    closeLoginModal();
}
function closeLoginModal(){
    var modal = get('modal-login');
    modal.classList.add('invisible');
}
function closeRegisterModal(){
    var modal = get('modal-signup');
    modal.classList.add('invisible'); 
}
function login(){
    var user = get('user-login');
    var pass = get('pass-login');
    var passed = false;
    var exists = false;
    for(var i = 0; i < logins.length; i++) {
        if((user.value==logins[i].user) && (pass.value==logins[i].pass)) {
            passed = true;
            exists = true;
            curruser = user.value
            break;
        } else if (user.value==logins[i].user) {
            exists = true;
            alert('Incorrect password');
        }
    }
    if(!exists){
        alert('Please register, no account found');
    }
    if(passed){
        var loginBtn = get('login-btn');
        var signupBtn = get('signup-btn');
        var logoutBtn = get('logout-btn');
        
        loginBtn.classList.add('invisible');
        signupBtn.classList.add('invisible');
        logoutBtn.classList.remove('invisible');
        
        var welcomeMsg = get('welcome-msg');
        welcomeMsg.innerHTML = "Welcome "+curruser;
        gotoBooking();
    }
    user.value = ''
    pass.value = ''
    closeLoginModal();
}
function signup(){
    var user = get('user-signup');
    var pass = get('pass-signup');
    if((user.value==="")||(pass.value==="")){
        alert('Username and Password cannot be empty');
    } else {
        var found = false;
        for(var i = 0; i < logins.length; i++) {
            if(logins[i].user===user.value){
                found = true;
                alert(user.value+" already exists");
            }
        }
        if(!found){
            logins.push({
                user:user.value,
                pass:pass.value
            });
            alert(user.value+" has been added");
        }
    }
    closeRegisterModal();
}
function logout(){
    curruser = '';
    
    var reserveroom = get('reserve-room');
    reserveroom.classList.add('invisible');
    var itinerary = get('itinerary');
    itinerary.classList.add('invisible');

    var loginBtn = get('login-btn');
    var signupBtn = get('signup-btn');
    var logoutBtn = get('logout-btn');
    var reserveBtn = get('reserve-btn');
        
    loginBtn.classList.remove('invisible');
    signupBtn.classList.remove('invisible');
    logoutBtn.classList.add('invisible'); 
    reserveBtn.disabled = true;
}
function reserve(){
    var checkin = get('checkin');
    var checkout = get('checkout');

    var ind = new Date(Date.parse(checkin.value));
    var outd = new Date(Date.parse(checkout.value));
    var conf = Math.floor(100000000 + Math.random() * 900000000);

    bookings.push({
        user: curruser,
        indate: ind,
        outdate: outd,
        conf: conf
    });
    gotoItinerary();
}
function gotoItinerary(){
    var reservationMsg = get('reservation-msg');
    var confirmationMsg = get('confirmation-msg');
    var reservations = []
    for(var i = 0; i < bookings.length; i++){
        if(bookings[i].user===curruser){
            reservations.push(bookings[i]);
        }
    }
    if(reservations.length > 0){
        reservationMsg.innerHTML = 'Hi '+curruser+', here are your bookings';
        var str = '';
        for(var i = 0; i < reservations.length; i++){
            str += "<h4>Confirmation Number: "+reservations[i].conf+"</h4>";
            str += "<h4>Check-In time: "+reservations[i].indate.toISOString().split("T")[0]+" @ 3:00pm</h4>";
            str += "<h4>Check-Out time: "+reservations[i].outdate.toISOString().split("T")[0]+" @ 1:00pm</h4>";
        }
        confirmationMsg.innerHTML = str;
    } else {
        reservationMsg.innerHTML = 'Sorry '+curruser+', you have no bookings';
        confirmationMsg.innerHTML = '';
    }
    
    var booking = get('reserve-room');
    booking.classList.add('invisible');
    var itinerary = get('itinerary');
    itinerary.classList.remove('invisible');
}
function gotoBooking(){
    var checkin = get('checkin');
    var currd = new Date()
    checkin.min = currd.toISOString().split("T")[0];
    checkin.value = currd.toISOString().split("T")[0];
    currd.setDate(currd.getDate()+1);
    var checkout = get('checkout');
    checkout.min = currd.toISOString().split("T")[0];
    checkout.value = currd.toISOString().split("T")[0];
    
    var booking = get('reserve-room');
    booking.classList.remove('invisible');
    var itinerary = get('itinerary');
    itinerary.classList.add('invisible');
}
function updatePrice(){
    var checkin = get('checkin');
    var checkout = get('checkout');
    var ind = new Date(Date.parse(checkin.value));
    var outd = new Date(Date.parse(checkout.value));
    
    var priceMsg = get('price-msg');
    var days = ((outd.getTime() - ind.getTime()) / (1000*3600*24));
    priceMsg.innerHTML = "Price: $"+(100*days);
    enableBooking();
}
function enableBooking(){
    var reserveBtn = get('reserve-btn');
    reserveBtn.removeAttribute("disabled");
}
function updateCheckin(){
    var checkin = get('checkin');
    var checkout = get('checkout');

    var ind = new Date(Date.parse(checkin.value));
    ind.setDate(ind.getDate()+1);
    if(checkout.disabled){
        checkout.removeAttribute("disabled");
        checkout.value = ind.toISOString().split("T")[0];
    } else {
        var outd = new Date(Date.parse(checkout.value));
        if(outd <= ind){
            checkout.value = ind.toISOString().split("T")[0];
        }
    }
    checkout.min = ind.toISOString().split("T")[0];
    updatePrice();
}
function updateCheckout(){
    var checkin = get('checkin');
    var checkout = get('checkout');

    var d = new Date(Date.parse(checkout.value));
    d.setDate(d.getDate()-1)
    
    checkin.max = d.toISOString().split("T")[0];
    updatePrice();
}

//Wire up event handlers
window.addEventListener('load', function(){
    var loginBtn = get('login-btn');
    var cancelBtn = get('cancel-btn');
    var signinBtn = get('signin-btn');
    var signupBtn = get('signup-btn');
    var cancel2Btn = get('cancel2-btn');
    var registerBtn = get('register-btn');
    var logoutBtn = get('logout-btn');
    var reserveBtn = get('reserve-btn');
    var checkBtn = get('check-btn');
    var returnBtn = get('return-btn');

    var checkin = get('checkin');
    var checkout = get('checkout');

    loginBtn.addEventListener('click',openLoginModal);
    signupBtn.addEventListener('click',openRegisterModal);
    cancelBtn.addEventListener('click',closeLoginModal);
    signinBtn.addEventListener('click',login);
    registerBtn.addEventListener('click',signup);
    cancel2Btn.addEventListener('click',closeRegisterModal);
    logoutBtn.addEventListener('click',logout);
    reserveBtn.addEventListener('click',reserve);
    checkBtn.addEventListener('click',gotoItinerary);
    returnBtn.addEventListener('click',gotoBooking);

    checkin.addEventListener('change',updateCheckin);
    checkout.addEventListener('change',updateCheckout);
});