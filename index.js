// Get the URL parameters
const urlParams = new URLSearchParams(window.location.search);

// Get the value of the 'myVar' parameter
const feedUrl = urlParams.get('feedUrl');

if (feedUrl) {
    // Parameter exists and has a value

    fetch(feedUrl)
        .then(response => response.json())
        .then(data => {

            // TODO: fall back to title and description if authors is not present
            if (data.authors && data.authors.length == 1) {
                document.title = data.authors[0].name;

                const authorName = document.createElement('h1');
                authorName.innerHTML = data.authors[0].name;
                document.getElementById('bio').appendChild(authorName);

                const authorAvatar = document.createElement('img');
                authorContacts.id = 'authorAvatar'
                authorAvatar.src = data.authors[0].avatar;
                authorAvatar.alt = 'avatar of the author';
                document.getElementById('bio').appendChild(authorAvatar);

                if (data.authors[0].bio) {
                    const authorBio = document.createElement('p');
                    authorBio.innerHTML = data.authors[0].bio;
                    document.getElementById('bio').appendChild(authorBio);
                }

                if (data.authors[0].contacts) {
                    const authorContacts = document.createElement('div');
                    authorContacts.id = 'authorContacts'
                    document.getElementById('bio').appendChild(authorContacts);
                    
                    var contacts_html = '';
                    for (var i = 0; i < data.authors[0].contacts.length; i++) {

                        contacts_html += `
                <p>
                  ${data.authors[0].contacts[i].symbol + " "}
                  <a href="${data.authors[0].contacts[i].url}">${data.authors[0].contacts[i].name}</a>
                </p>
              `;
                    }

                    document.getElementById('authorContacts').innerHTML = contacts_html;

                }

            }

            var items = data.items;
            var posts = '';
            for (var i = 0; i < items.length; i++) {
                var post = '<div class="post">';
                post += '<p class="date_published">' + format_date_published(items[i].date_published) + '</p>';
                post += '<p class="content_text">' + items[i].content_text + '</p>';
                post += '</div>';
                posts += post;
            }

            document.getElementById('posts').innerHTML = posts;

        });

} else {
    // Parameter is missing or has no value, handle this case accordingly
    document.getElementById('main-container').innerHTML = 'feed not provided'
}

function format_date_published(date_published) {
    // Replace all '-' with '/'
    date_published = date_published.replaceAll('-', '/');

    // Replace all 'T' with ' '
    date_published = date_published.replaceAll('T', ' ');

    // Get the index of the last ':'
    last_colon_index = date_published.lastIndexOf(':');

    // If the index is not -1, then drop everything after the last ':'
    if (last_colon_index != -1) {
        date_published = date_published.substring(0, last_colon_index);
    }

    return date_published;
}
