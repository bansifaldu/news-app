<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Laravel\Passport\Client;
use Illuminate\Support\Facades\DB;
use App\Models\UserSource;
use App\Models\UserCategory;
use App\Models\UserAuthor;

class AuthController extends Controller
{
    public function register(Request $request)
    {

        // Validate user input
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], 422);
        }

        // Create a new user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);
       
        $token = $user->createToken('news_app_token')->accessToken;

        return response(['token' => $token], 200);
    }

    public function login(Request $request)
    {
        // Validate user input
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], 422);
        }

        // Attempt to log in the user
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
           
            $user = Auth::user();
            $client = Client::where('password_client', 1)->first();
            // Generate token for the user using Passport
            if ($user) {
                // Generate token for the user using Passport
                $user = User::find($user->id);
                $token = $user->createToken('news_app_token')->accessToken;

                return response(['token' => $token], 200);
            }
        } else {
            return response(['errors' => ['Invalid credentials']], 401);
        }
    }
    public function logout(Request $request)
    {
        Auth::logout();


        return response()->json(['message' => 'Successfully logged out']);
    }
    public function update(Request $request)
    {
        $user = auth()->user();

         $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $user->update($request->only(['name', 'email']));

        // Update user sources
        $this->updateUserSources($user, $request->input('sources', []));
        $this->updateUserCategories($user, $request->input('categories', []));
        $this->updateUserAuthors($user, $request->input('authors', []));

        return response()->json(['message' => 'User updated successfully']);
    }
    private function updateUserSources(User $user, array $sourceNames)
    {
        UserSource::where('user_id', $user->id)->delete();

        foreach ($sourceNames as $sourceName) {
            UserSource::create([
                'user_id' => $user->id,
                'name' => $sourceName,
            ]);
        }
    }
    private function updateUserCategories(User $user, array $categories)
    {
        UserCategory::where('user_id', $user->id)->delete();

        foreach ($categories as $categorie) {
            UserCategory::create([
                'user_id' => $user->id,
                'name' => $categorie,
            ]);
        }
    }
    private function updateUserAuthors(User $user, array $authors)
    {
        UserAuthor::where('user_id', $user->id)->delete();

        foreach ($authors as $author) {
            UserAuthor::create([
                'user_id' => $user->id,
                'name' => $author,
            ]);
        }
    }
}
