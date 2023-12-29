// Function to parse the front matter
function parseFrontMatter(feed) {
    const lines = feed.split('\n');
    let frontMatter = {};
    let isFrontMatter = false;

    for (const line of lines) {
        if (line.startsWith('---')) {
            if (isFrontMatter) {
                break;
            } else {
                isFrontMatter = true;
                continue;
            }
        }

        if (isFrontMatter) {
            const index = line.indexOf(':');
            if (index !== -1) {
                const key = line.substring(0, index).trim();
                const value = line.substring(index + 1).trim();
                frontMatter[key] = value;
            }
        }
    }

    return frontMatter;
}

// Function to convert markdown-style links to HTML anchors
function convertMarkdownLinksToHTML(text) {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    return text.replace(linkRegex, (match, text, url) => `<a href="${url}">${text}</a>`);
}

// Function to parse the feed content
function parseFeedContent(feed) {
    const lines = feed.split('\n');
    let sections = {};
    let currentSection = '';
    let currentContent = [];

    lines.forEach(line => {
        if (line.startsWith('# ')) {
            if (currentSection) {
                sections[currentSection] = currentContent.join('\n').trim();
            }
            currentSection = line.substring(2).trim();
            currentContent = [];
        } else if (currentSection) {
            currentContent.push(line);
        }
    });

    // Add the last section
    if (currentSection) {
        sections[currentSection] = currentContent.join('\n').trim();
    }

    return sections;
}

// Get the 'feedUrl' parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
const feedUrl = urlParams.get('feedUrl');

if (feedUrl) {
    fetch(feedUrl)
        .then(response => response.text())
        .then(feedContent => {
            // Parse the feed
            const frontMatter = parseFrontMatter(feedContent);
            const sections = parseFeedContent(feedContent);

            // Set the page title and author avatar
            document.title = frontMatter.title;

            // Create and add the title element
            const titleElement = document.createElement('h1');
            titleElement.textContent = frontMatter.title;
            document.getElementById('profile').appendChild(titleElement);

            if (frontMatter.home_page_url) {
                const homePageUrl = document.createElement('a');
                homePageUrl.href = frontMatter.home_page_url;
                homePageUrl.innerHTML = "🔗";
                
                titleElement.append(" ");
                titleElement.append(homePageUrl);
            }

            const authorAvatar = document.createElement('img');
            authorAvatar.id = 'authorAvatar';
            authorAvatar.src = frontMatter.avatar;
            authorAvatar.alt = 'avatar of the author';
            document.getElementById('profile').appendChild(authorAvatar);

            // Populate the about section
            if (sections['About']) {
                const aboutElement = document.createElement('div');
                const aboutLines = sections['About'].split('\n');
                aboutLines.forEach(line => {
                    if (line === '---') {
                        const hr = document.createElement('hr');
                        aboutElement.appendChild(hr);
                    } else {
                        const p = document.createElement('p');
                        p.innerHTML = convertMarkdownLinksToHTML(line);
                        aboutElement.appendChild(p);
                    }
                });
                document.getElementById('profile').appendChild(aboutElement);
            }

            // Populate the posts
            if (sections['Feed']) {
                const posts = sections['Feed'].split('\n\n');
                posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.classList.add('post');

                    const [date, content] = post.split('\n', 2);
                    const dateElement = document.createElement('div');
                    dateElement.classList.add('date_published');
                    dateElement.innerHTML = date;
                    postElement.appendChild(dateElement);

                    const contentElement = document.createElement('div');
                    contentElement.classList.add('post_body');
                    contentElement.innerHTML = convertMarkdownLinksToHTML(content);
                    postElement.appendChild(contentElement);

                    document.getElementById('timeline').appendChild(postElement);
                });
            }

        })
        .catch(error => {
            console.error('Error fetching the feed:', error);
            document.getElementById('main-container').innerHTML = 'Error loading feed';
        });
} else {

    // New functionality for when feedUrl is not provided
    const root_title = "⁂ Aster";
    document.title = root_title;

    const mainContainer = document.getElementById('main-container');
    mainContainer.innerHTML = ''; // Clear existing content

    const titleElement = document.createElement('h1');
    titleElement.textContent = root_title;
    titleElement.style.textAlign = "center";
    mainContainer.appendChild(titleElement);

    const instructionElement = document.createElement('p');
    instructionElement.textContent = "Provide a feed URL";
    instructionElement.style.textAlign = "center";
    mainContainer.appendChild(instructionElement);

    // Create a container for the input and button
    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.justifyContent = 'center';
    inputContainer.style.alignItems = 'center';
    inputContainer.style.gap = '10px';

    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.id = 'feedUrlInput';
    inputElement.placeholder = 'Enter feed URL here';
    inputContainer.appendChild(inputElement);

    const buttonElement = document.createElement('button');
    buttonElement.textContent = "⁂";
    buttonElement.onclick = function () {
        const enteredUrl = document.getElementById('feedUrlInput').value;
        if (enteredUrl) {
            window.location.search = `?feedUrl=${encodeURIComponent(enteredUrl)}`;
        }
    };
    inputContainer.appendChild(buttonElement);

    // Append the container to mainContainer
    mainContainer.appendChild(inputContainer);

}
