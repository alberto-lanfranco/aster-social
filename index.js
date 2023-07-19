// const feedUrl = 'https://gist.githubusercontent.com/alberto-lanfranco/310aa248f0bdc6c5d8fd428675f000f8/raw/feed.json';

// Get the URL parameters
const urlParams = new URLSearchParams(window.location.search);

// Get the value of the 'myVar' parameter
const feedUrl = urlParams.get('feedUrl');

if (feedUrl) {
    // Parameter exists and has a value

    fetch(feedUrl)
        .then(response => response.json())
        .then(data => {

            document.title = data.title;

            document.getElementById('title').innerHTML = data.title;
            document.getElementById('avatar').src = data.authors[0].avatar;
            document.getElementById('quote-author').innerHTML = '— ' + data.quote.author;
            document.getElementById('quote-content').innerHTML = data.quote.content;

            var contacts = data.contacts;
            var contacts_html = '';
            for (var i = 0; i < contacts.length; i++) {
                contacts_html += `
        <p>
          ${contacts[i].symbol + " "}
          <a href="${contacts[i].url}">${contacts[i].name}</a>
        </p>
      `;
            }

            document.getElementById('contacts').innerHTML = contacts_html;

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
    document.getElementById('description').innerHTML = 'feed not provided'
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
