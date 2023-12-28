<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// routes/api.php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ArticleController;

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// User routes (example)
Route::middleware('auth:api')->group(function () {
    Route::get('/user', [UserController::class, 'getUser']);
    // Add other user-related routes as needed
});

// Article routes (example)
Route::middleware('auth:api')->group(function () {
    Route::get('/user', [UserController::class, 'getUser']);
    Route::get('/articles', [ArticleController::class, 'getArticles']);
    Route::get('/user-preference-articles', [ArticleController::class, 'getUserPreferenceArticles']);
    Route::post('/articles/search', 'ArticleController@search');
    Route::get('/categories', [ArticleController::class, 'getCategories']);
    Route::get('/authors', [ArticleController::class, 'getAuthors']);

    Route::get('/sources', [ArticleController::class, 'getsources']);
    Route::put('/user', [AuthController::class, 'update']);
    Route::get('/all-sources', [ArticleController::class, 'getAllSources']);
    Route::get('/user/preferences', [UserController::class, 'getUser']);
});
