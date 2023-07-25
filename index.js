// Get the URL parameters
const urlParams = new URLSearchParams(window.location.search);

// Get the value of the 'myVar' parameter
const feedUrl = urlParams.get('feedUrl');

if (feedUrl) {
    // Parameter exists and has a value

    fetch(feedUrl)
        .then(response => response.json())
        .then(data => {

            // TODO atomically look for author name or title, avatar or icon, description or bio, without bundling them together
            if (data.authors && data.authors.length == 1) {
                document.title = data.authors[0].name;

                const authorName = document.createElement('h1');
                authorName.innerHTML = data.authors[0].name;
                document.getElementById('profile').appendChild(authorName);

                const authorAvatar = document.createElement('img');
                authorAvatar.id = 'authorAvatar'
                authorAvatar.src = data.authors[0].avatar;
                authorAvatar.alt = 'avatar of the author';
                document.getElementById('profile').appendChild(authorAvatar);

                if (data.authors[0].bio) {
                    const authorBio = document.createElement('p');
                    authorBio.innerHTML = data.authors[0].bio;
                    document.getElementById('profile').appendChild(authorBio);
                }

                if (data.authors[0].contacts) {
                    // adding horizontal separator
                    const hrElement = document.createElement('hr');
                    document.getElementById('profile').appendChild(hrElement);

                    const authorContacts = document.createElement('div');
                    authorContacts.id = 'authorContacts'
                    document.getElementById('profile').appendChild(authorContacts);
                    
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

            } else {
                document.title = data.title;

                const title = document.createElement('h1');
                title.innerHTML = data.title;
                document.getElementById('profile').appendChild(title);

                if (data.icon) {
                    const authorAvatar = document.createElement('img');
                    authorAvatar.id = 'authorAvatar'
                    authorAvatar.src = data.icon;
                    authorAvatar.alt = 'avatar of the author';
                    document.getElementById('profile').appendChild(authorAvatar);
                }

                if (data.description) {
                    const description = document.createElement('p');
                    description.innerHTML = data.description;
                    document.getElementById('profile').appendChild(description);
                }

            }
            
            // adding horizontal separator
            const hrElement = document.createElement('hr');
            document.getElementById('profile').appendChild(hrElement);

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

    // Trim the timestamp to the minute
    date_published = date_published.substring(0, 16);

    return date_published;
}
