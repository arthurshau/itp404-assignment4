let template = $('#search-template').html()
let renderPosts = Handlebars.compile(template)

// let postTemplate = $('#post-template').html()
// let renderPost = Handlebars.compile(postTemplate)

let searchList

$('#search-button').on('click', ()=> {
	let search = $('#input').val()
  doTheSearch(search) 	
  addSearch(search)
})

$.ajax( {
  type: 'GET',
  url: 'http://localhost:3000/api/searches'
}).then((response) => {
  searchList = response
  render()
})

function render() {
  let searchHTML = renderPosts ({
    searches: searchList
  })
  $('div#searches').html(searchHTML)
}

function doTheSearch(username) {
  $('#repos').empty()
  fetchRepos(username).then((result) => {
    const myRepos = []
    result.slice(0,10).forEach(child => {
      const repo = {}
      repo.title = child.name
      myRepos.push(repo)
    })
    const template = $('#repos-template').html()
    const renderPosts = Handlebars.compile(template)
    $('#repos').html(renderPosts({repos: myRepos}))
  }, () => {
    $('#repos').html('<h2>Oops! Something went wrong! 🔥</h2>')
  })
}

function fetchRepos(username) {
  return new Promise((resolve, reject) => {
    $.getJSON('https://api.github.com/users/' + username + '/repos', null, function (result) {
      resolve(result)
    }).fail((error) => {
      reject(new Error(error))
    })
  })
}

function addSearch(search) {
  $.ajax({
    type: 'post',
    url: 'http://localhost:3000/api/searches',
    data: {
      term: search,
      createdAt: new Date()
    }
  }).then((response) => {
    searchList.unshift(response)
    render()   
  })
}