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
            } else {
                const brElement = document.createElement('p');
                brElement.innerHTML = "<br>";
                document.getElementById('profile').appendChild(brElement);
            }

            if (data.contacts) {
                // adding horizontal separator
                const hrElement = document.createElement('hr');
                document.getElementById('profile').appendChild(hrElement);

                const authorContacts = document.createElement('div');
                authorContacts.id = 'authorContacts'
                document.getElementById('profile').appendChild(authorContacts);

                for (var i = 0; i < data.contacts.length; i++) {
                    const contact = document.createElement('p');

                    contact.append(data.contacts[i].symbol + " ")

                    const contactLink = document.createElement('a');
                    contactLink.href = data.contacts[i].url;
                    contactLink.innerHTML = data.contacts[i].name;

                    contact.append(contactLink);
                    document.getElementById('authorContacts').append(contact);
                }
            }

            // adding horizontal separator
            const hrElement = document.createElement('hr');
            document.getElementById('profile').appendChild(hrElement);

            for (var i = 0; i < data.items.length; i++) {
                const post = document.createElement('div');
                post.classList.add('post');

                const datePublished = document.createElement('div');
                datePublished.classList.add('date_published');
                datePublished.innerHTML = format_date_published(data.items[i].date_published)

                post.appendChild(datePublished);

                if (data.items[i].title) {
                    const postTitle = document.createElement('h2');
                    postTitle.classList.add('post_title');
                    postTitle.innerHTML = data.items[i].title

                    post.appendChild(postTitle);
                }

                const postBody = document.createElement('div');
                postBody.classList.add('post_body');
                postBody.innerHTML = data.items[i].content_html;

                post.appendChild(postBody);

                document.getElementById('timeline').appendChild(post);

            }

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
