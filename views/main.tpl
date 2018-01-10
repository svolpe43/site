<!DOCTYPE html>
<html>
  <head>
    <link rel="shortcut icon" type="image/ico" href="favicon.png" />

    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

    <link href="/banner.css" rel="stylesheet"/>
    <link href="/footer.css" rel="stylesheet"/>

    % include(page + '.tpl', section='head')

  </head>
  <body>
	% include('banner.tpl')
  <div id="wrapper">
      % include(page + '.tpl', section='content')
	</div>
  % include('footer.tpl')
  </body>
</html>
