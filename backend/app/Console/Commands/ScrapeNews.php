<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use GuzzleHttp\Client;
use App\Models\Article;
use Carbon\Carbon;

class ScrapeNews extends Command
{
    protected $signature = 'app:scrape-news';
    protected $description = 'Scrape news from NewsAPI';

    public function handle()
    {
        $this->info('Fetching news from NewsAPI...');

        $news_apiKey = env('NEWS_API_KEY');
        $newyoyk_news_apiKey = env('NEWYORK_NEWS_API_KEY');
        $sources = ['newsapi' => $news_apiKey, 'newyorktimes' => $newyoyk_news_apiKey, 'guardian' => 'test'];
        // $sources = ['newsapi' => $news_apiKey];

        foreach ($sources as $key => $val) {
            $news = $this->fetchNews($key, $val);
            if ($key == 'newsapi') {

                $this->storeNews($news);
            } else if ($key == 'newyorktimes') {
                $this->storeNewyorktimesNews($news);
            } else if ($key == 'guardian') {
                $this->storeGuardianNews($news);
            }
        }

        $this->info('News scraping completed!');
    }
    private function fetchNews($source, $apiKey)
    {
        $client = new Client();
        $url = $this->getSourceUrl($source);
        $response = $client->get("{$url}{$apiKey}");

        return json_decode($response->getBody(), true);
    }


    private function storeNews($news)
    {
        foreach ($news['articles'] as $key => $articleData) {

            $publishedAt = Carbon::parse($articleData['publishedAt'])->toDateTimeString();

            // Check if an article with the same attributes already exists
            $existingArticle = Article::where([
                'sourceId' => $articleData['source']['id'] ?? "",
                'title' => $articleData['title'] ?? "",
                'publishedAt' => $publishedAt,
            ])->first();

            if (!$existingArticle) {
                // Create a new article only if it doesn't already exist
                Article::create([
                    'sourceId' => $articleData['source']['id'] ?? "",
                    'sourceName' => $articleData['source']['name'] ?? "",
                    'author' => $articleData['author'] ?? "",
                    'title' => $articleData['title'] ?? "",
                    'description' => $articleData['description'] ?? "",
                    'url' => $articleData['url'] ?? "",
                    'urlToImage' => $articleData['urlToImage'] ?? "",
                    'publishedAt' => $publishedAt,
                    'category' => $articleData['category'] ?? "general",
                    'content' => $articleData['content'] ?? "",
                ]);
            }
        }
    }
    private function storeNewyorktimesNews($news)
    {
        foreach ($news['results'] as $key => $articleData) {

            $publishedAt = Carbon::parse($articleData['published_date'])->toDateTimeString();

            // Check if an article with the same attributes already exists
            $existingArticle = Article::where([
                'sourceId' => $articleData['slug_name'] ?? "",
                'title' => $articleData['title'] ?? "",
                'publishedAt' => $publishedAt,
            ])->first();

            if (!$existingArticle) {
                // Create a new article only if it doesn't already exist
                Article::create([
                    'sourceId' => $articleData['slug_name'] ?? "",
                    'sourceName' => $articleData['source'] ?? "",
                    'author' => $articleData['byline'] ?? "",
                    'title' => $articleData['title'] ?? "",
                    'description' => $articleData['abstract'] ?? "",
                    'url' => $articleData['url'] ?? "",
                    'urlToImage' => $articleData['multimedia'][0]['url'] ?? "",
                    'publishedAt' => $publishedAt,
                    'category' => $articleData['item_type'] ?? "general",
                    'content' => $articleData['abstract'] ?? "",
                ]);
            }
        }
    }
    private function storeGuardianNews($news)
    {

        foreach ($news['response']['results'] as $key => $articleData) {
            // echo "<pre>"; print_r($articleData);exit;

            $publishedAt = Carbon::parse($articleData['webPublicationDate'])->toDateTimeString();

            // Check if an article with the same attributes already exists
            $existingArticle = Article::where([
                'sourceId' => $articleData['id'] ?? "",
                'title' => $articleData['webTitle'] ?? "",
                'publishedAt' => $publishedAt,
            ])->first();

            if (!$existingArticle) {
                // Create a new article only if it doesn't already exist
                Article::create([
                    'sourceId' => $articleData['id'] ?? "",
                    'sourceName' => $articleData['sectionName'] ?? "",
                    'author' => $articleData['fields']['byline'] ?? "",
                    'title' => $articleData['webTitle'] ?? "",
                    'description' => $articleData['fields']['trailText'] ?? "",
                    'url' => $articleData['webUrl'] ?? "",
                    'urlToImage' => $articleData['fields']['thumbnail'] ?? "",
                    'publishedAt' => $publishedAt,
                    'category' => $articleData['Lifestyle'] ?? "general",
                    'content' => $articleData['fields']['standfirst'] ?? "",
                ]);
            }
        }
    }
    private function getSourceUrl($source)
    {

        switch ($source) {
            case 'newsapi':
                return 'https://newsapi.org/v2/everything?q=bitcoin&apiKey=';
            case 'newyorktimes':
                return 'https://api.nytimes.com/svc/news/v3/content/nyt/world.json?api-key=';
            case 'guardian':
                return 'https://content.guardianapis.com/search?q=sausages&order-by=relevance&show-fields=all&api-key=';
            default:
                return '';
        }
    }
}
