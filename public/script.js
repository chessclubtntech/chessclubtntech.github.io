// Function to fetch random users from the server
function fetchRandomUsers() {
    // Make an AJAX request to fetch random users from the server
    $.ajax({
        url: '/api/random-users',
        method: 'GET',
        success: function(data) {
            // Update the UI with the fetched users
            $('#user1').text(data.user1.username + ' - Rating: ' + data.user1.rating);
            $('#user1').data('userid', data.user1._id); // Set the data-userid attribute
            $('#user2').text(data.user2.username + ' - Rating: ' + data.user2.rating);
        },
        error: function(err) {
            console.error('Error fetching random users:', err);
        }
    });
}

// Function to update user game data in MongoDB
function updateUserGameData(userId, outcome) {
    $.ajax({
        url: '/api/update-user-game-data',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ userId: userId, outcome: outcome }),
        success: function(data) {
            console.log('User game data updated successfully:', data);
        },
        error: function(err) {
            console.error('Error updating user game data:', err);
        }
    });
}
// Function to handle the submission of game results
function submitResult(user1Selection, user2Selection) {
    // Calculate outcome based on user selections
    var user1Outcome = 0;
    var user2Outcome = 0;
    if (user1Selection === 'Win' && user2Selection === 'Lose') {
        user1Outcome = 1;
        user2Outcome = 0;
    } else if (user1Selection === 'Lose' && user2Selection === 'Win') {
        user1Outcome = 0;
        user2Outcome = 1;
    } else if (user1Selection === 'Draw' && user2Selection === 'Draw') {
        user1Outcome = 0.5;
        user2Outcome = 0.5;
    }

    // AJAX call to update user game data for user 1
    updateUserGameData($('#user1').data('userid'), user1Outcome);

    // AJAX call to update user game data for user 2
    updateUserGameData($('#user2').data('userid'), user2Outcome);
}

$(document).ready(function() {
    // Fetch random users when the page loads
    fetchRandomUsers();

    // Variables to track button selections
    var user1Selection = '';
    var user2Selection = '';

    // Event listener for the win, draw, and lose buttons of user 1
    $('.buttons1 button').click(function() {
        user1Selection = $(this).text();
        checkSubmitVisibility();
    });

    // Event listener for the win, draw, and lose buttons of user 2
    $('.buttons2 button').click(function() {
        user2Selection = $(this).text();
        checkSubmitVisibility();
    });

    // Function to check if the submit button should be visible
    function checkSubmitVisibility() {
        if (user1Selection !== '' && user2Selection !== '') {
            $('#submitResult').show();
        }
    }

    // Event listener for the submit button
    $('#submitResult').click(function() {
        // Call a function to handle the submission
        submitResult(user1Selection, user2Selection);
    });
});
