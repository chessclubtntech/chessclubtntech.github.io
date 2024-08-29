const PASSWORD = process.env.TOURNAMENT_PASSWORD;

exports.handler = async function(event, context) {
  const { code } = JSON.parse(event.body);

  if (code === PASSWORD) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({ success: false, message: 'Incorrect password' })
    };
  }
};
