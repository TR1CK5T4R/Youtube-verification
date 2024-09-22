document.addEventListener("DOMContentLoaded", function () {
    const content = document.querySelector("#content");
    const homeLink = document.querySelector("#homeLink");
    const privateLink = document.querySelector("#privateLink");


    function showHomePage() {
        content.innerHTML = `
        <h1>Welcome to the Home Page</h1>
        <p>This is the public home page. You can navigate to the private page if you are subscribed.</p>`;
    }

    function showPrivatePage() {
        content.innerHTML = `
        <h1>Unauthorized Access</h1>
        <p>Please first sign in to access this page</p>`;
    }


    homeLink.addEventListener("click", function (e) {
        e.preventDefault();
        showHomePage();
    });

    privateLink.addEventListener("click", function (e) {
        showPrivatePage();
    });


});


let googleClient;

// Load the Google Identity Services library.
function loadClient() {
    googleClient = google.accounts.oauth2.initTokenClient({
        client_id: '216896125625-4bcvapmoc9suk7ls1tm5ognkcvmbnp9g.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/youtube.readonly',
        callback: (response) => {
            handleAuthResponse(response);
        }
    });
}

// Function to handle the authorization response
function handleAuthResponse(response) {
    if (response.access_token) {
        checkSubscription(response.access_token);
    } else {
        console.error('Authorization failed');
    }
}

// Function to handle user sign-in
function handleAuthClick() {
    googleClient.requestAccessToken();
}

// Function to check if the user is subscribed to BYTE's channel
async function checkSubscription(accessToken) {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&access_token=${accessToken}`);
        const data = await response.json();

        const byteChannelId = 'UCgIzTPYitha6idOdrr7M8sQ';
        const subscriptions = data.items || [];

        const isSubscribed = subscriptions.some(sub => sub.snippet.resourceId.channelId === byteChannelId);

        if (isSubscribed) {

            privateLink.addEventListener("click", function (e) {
                content.innerHTML = `
                  <h1>Welcome to the Private Page</h1>
                  <p>You have access to this page because you are subscribed.</p>`;
            });
        }


        else {
            privateLink.addEventListener("click", function (e) {
                content.innerHTML = `
                <h1>Unauthorized Access</h1>
                <p>You are not subscribed to BYTE's YouTube channel. Please subscribe to the YouTube channel.</p>`;
            })
        }
    }

    catch (error) {
        console.error('Error checking subscription status:', error);
    }

}
// Call this function on DOM load to initialize the Google Identity Services client
document.addEventListener('DOMContentLoaded', loadClient);
