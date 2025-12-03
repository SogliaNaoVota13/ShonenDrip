let token = sessionStorage.getItem('token')

if (!token) {
    location.href = '../index.html'
}

