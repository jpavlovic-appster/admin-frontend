@extends('emails.main')
@section('content')

<table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="926c033e-3c2c-426c-9211-22eaa0b63e74">
    <tbody>
      <tr>
        <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: left">Congratulations {{ $username }}</div>
        
        <div style="font-family: inherit; text-align: left"><br></div>
        <div style="font-family: inherit; text-align: left"> Welcome and thanks for Joining us</div>
        
        <div style="font-family: inherit; text-align: left"><br></div>
        <div style="font-family: inherit; text-align: left"> <b> Email: </b> {{ $email }} </div>

        <div style="font-family: inherit; text-align: left"><br></div>
        <div style="font-family: inherit; text-align: left"> <b> Password: </b> {{ $password }} </div>

        <div style="font-family: inherit; text-align: left"><br></div>
        <div style="font-family: inherit; text-align: left"> Please click <a href="{{ $link }}" target="_blank"> here </a> to login. </div>

        <div style="font-family: inherit; text-align: left"><br></div>
        <div style="font-family: inherit; text-align: left">Thank you from the <?php echo env('APP_NAME') ; ?> Team </div><div></div></div></td>
      </tr>
    </tbody>
</table>

@endsection
