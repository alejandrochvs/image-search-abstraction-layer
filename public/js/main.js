$.ajax({
    type: 'GET',
    url: 'https://api.imgur.com/3/gallery/search/viral/1?q="kitten"',
    beforeSend: function (request) {
        request.setRequestHeader("Authorization", 'Client-ID 2da5b009d7cd5b7');
    },
    success: function (res) {
        console.log(res);
    }
})
