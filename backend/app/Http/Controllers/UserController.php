<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function getUser(Request $request)
    {
        // Get the authenticated user
        $user = Auth::user();
        $sources = $user->sources()->pluck('name')->toArray();

        $categories = $user->categories()->pluck('name')->toArray();
        $authors = $user->authors()->pluck('name')->toArray();

        return response(['user' => $user, 'sources' => $sources, 'categories' => $categories, 'authors' => $authors], 200);
    }
}
