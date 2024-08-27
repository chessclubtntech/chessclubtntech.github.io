// Login Form Submission
$('#loginForm').submit(function(event) {
  event.preventDefault();
  const formData = $(this).serialize();
  $.ajax({
    url: '/.netlify/functions/loginUser',
    type: 'POST',
    data: JSON.stringify(formData),
    contentType: 'application/json',
    success: function(data) {
      $('#loginMessage').text(JSON.parse(data).message);
      $('#loginForm')[0].reset();
    },
    error: function(error) {
      $('#loginMessage').text(JSON.parse(error.responseText).message);
    }
  });
});
