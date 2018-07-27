import frame = require('ui/frame');

export function getStartPage() {
    return 'pages/login/login';
}

export function goToWebAuthPage(){
    frame.topmost().navigate('pages/web-auth/web-auth');
}

export function goToLandingPage(){
    frame.topmost().navigate('pages/landing/landing');
}