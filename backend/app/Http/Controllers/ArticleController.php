<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use Illuminate\Support\Facades\Auth;

class ArticleController extends Controller
{
    public function getArticles(Request $request)
    {
        // Get a list of articles
        $query = Article::query();

        // Check if searchTerm is provided
        if ($request->has('searchTerm') && $request->searchTerm != "") {
            $query->where('title', 'like', '%' . $request->input('searchTerm') . '%');
        }
        if ($request->has('filterDate') && $request->filterDate != "") {
            $filterDate = \Carbon\Carbon::parse($request->input('filterDate'))->addDay()->toDateString();
            $query->whereDate('publishedAt', '=', $filterDate);
        }
        if ($request->has('filterCategory') && $request->filterCategory != "") {
            $query->where('category', $request->filterCategory);
        }
        if ($request->has('filterSource') && $request->filterSource != "") {
            $query->where('sourceName', $request->filterSource);
        }
        $perPage = 6;
        $articles = $query->paginate($perPage);

        return response(['articles' => $articles], 200);
    }
    public function getUserPreferenceArticles(Request $request)
    {
        // Get a list of articles
        $query = Article::query();

        // Check if searchTerm is provided
        if ($request->has('searchTerm') && $request->searchTerm != "") {
            $query->where('title', 'like', '%' . $request->input('searchTerm') . '%');
        }
        if ($request->has('filterDate') && $request->filterDate != "") {
            $filterDate = \Carbon\Carbon::parse($request->input('filterDate'))->addDay()->toDateString();
            $query->whereDate('publishedAt', '=', $filterDate);
        }
        if ($request->has('filterCategory') && $request->filterCategory != "") {
            $query->where('category', $request->filterCategory);
        }
        if ($request->has('filterSource') && $request->filterSource != "") {
            $query->where('sourceName', $request->filterSource);
        }
        // Check if user preference is on
        $user = Auth::user();
        if ($user) {
            $categories = $user->categories()->pluck('name')->toArray();
            $sources = $user->sources()->pluck('name')->toArray();
            $authors = $user->authors()->pluck('name')->toArray();


            if (!empty($categories)) {
                $query->whereIn('category', $categories);
            }
            if (!empty($sources)) {
                $query->whereIn('sourceName', $sources);
            }
            if (!empty($authors)) {
                $query->whereIn('author', $authors);
            }
        }

        $perPage = 6;
        $articles = $query->paginate($perPage);

        return response(['articles' => $articles], 200);
    }
    public function getCategories()
    {
        $categories = Article::distinct('category')->pluck('category')->toArray();

        return response(['categories' => $categories], 200);
    }
    public function getAuthors()
    {
        $authors = Article::distinct('author')->pluck('author')->toArray();

        return response(['authors' => $authors], 200);
    }
    public function getsources()
    {
        $sourceName = Article::distinct('sourceName')->pluck('sourceName')->toArray();

        return response(['sourceName' => $sourceName], 200);
    }
    public function getAllSources()
    {
        try {
            $sources = Article::select('sourceName')->distinct()->pluck('sourceName')->toArray();

            return response()->json(['sources' => $sources]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch sources'], 500);
        }
    }
}
