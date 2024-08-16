<!-- <!DOCTYPE html>
<html>

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body> -->
@php
    $tenant_data = Config::get('mail.tenant_data');
@endphp
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- The above 3 meta tags must come first in the head; any other head content must come after these tags -->
  <title></title>

</head>
<style type="text/css">
  @media (max-width: 767px) {
    a.btn {
      padding-left: 0 !important;
    }
  }

  .mail-id a {
    color: #fff;
  }

  .ii a[href] {
    color: #fff;
  }
</style>

<body>
  <table style="display: table; margin: 0 auto; width: 100%; background-color: #fff;">
    <tr>
      <td style="background: #ebebeb;">
        <!-- <div style="background-color: #4cb1c3;">
          <a href="#" style="background: #4cb1c3;display: inline-block; width: 100%; text-align: left;">
            <img src="{{ $tenant_data['logo'] }}" alt="logo" border="0" style="padding: 10px; width: 150px; margin: 0 auto;text-align: center;">
          </a>
        </div> -->
        <div style="padding: 20px">
        <!--   <div style="color: #000; font-size: 18px;">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </div> -->
