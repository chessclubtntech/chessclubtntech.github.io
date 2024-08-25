// index.js

$(document).ready(function() {
  // Load users on page load
  loadUsers();

  // Add User
  $('#addUserForm').submit(function(event) {
    event.preventDefault();
    const formData = $(this).serialize();
    $.post('/api/user/add', formData, function(data) {
      alert('User added successfully');
      loadUsers();
      $('#addUserForm')[0].reset();
    });
  });

  // Login User
  $('#loginForm').submit(function(event) {
    event.preventDefault();
    const formData = $(this).serialize();
    console.log(formData); // Log form data
    $.post('/login', formData, function(data) {
      // Redirect to main page upon successful login
      window.location.href = 'main.html';
    }).fail(function() {
      // Display login error message
      $('#loginMessage').text('Login failed. Please check your credentials and try again.');
    });
  });

  // Load Users
  function loadUsers() {
    $.get('/api/user/all', function(users) {
      $('#userList').empty();
      users.forEach(function(user) {
        $('#userList').append(`<li>${user.username} - Rating: ${user.rating} <button class="deleteUser" data-id="${user._id}">Delete</button></li>`);
      });
    });
  }

  // Delete User
  $(document).on('click', '.deleteUser', function() {
    const userId = $(this).data('id');
    $.ajax({
      url: `/api/user/${userId}`,
      type: 'DELETE',
      success: function(result) {
        alert(result.message);
        loadUsers();
      }
    });
  });
});
