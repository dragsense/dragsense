<?php

use Illuminate\Support\Facades\Route;
use DragSense\AutoCode\Http\Controllers\AutoCodeController;


Route::get('/', function () {
    return view('welcome');
});


Route::get('{any}', [AutoCodeController::class, 'handlePageRequest']);
