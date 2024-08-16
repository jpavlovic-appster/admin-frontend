<?php

// Subscribers Admin Routes
require_once "subscriber/subscriber-system/subscriberRoutes.php";

// Admins Routes
require_once "subscriber/admins/adminRoutes.php";

// Crash game
require_once "subscriber/crash-game/crashgameRoutes.php";

Route::get('/bet-reports', 'Reports\BetReportController@'.'getBetReports');
