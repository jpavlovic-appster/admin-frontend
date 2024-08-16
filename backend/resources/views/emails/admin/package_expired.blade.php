@extends('emails.main')
@section('content')

<table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="926c033e-3c2c-426c-9211-22eaa0b63e74">
    <tbody>
      <tr>
        <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: left">Hello ,</div>
             
        <div style="font-family: inherit; text-align: left"><br></div>
        <div style="font-family: inherit; text-align: left">Your Tenant's Following packages are expired Please renew </div>
        <br>
        @foreach ($packages as $package)
        <div style="font-family: inherit; text-align: left"> <b> {{ $package['name'] }} </b> </div>
        @endforeach
        <div style="font-family: inherit; text-align: left"><br></div>
        <div style="font-family: inherit; text-align: left"> Thanks </div>
      </tr>
    </tbody>
</table>

@endsection
