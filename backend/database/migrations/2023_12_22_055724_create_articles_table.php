<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('sourceId');
            $table->string('sourceName');
            $table->string('author');
            $table->string('title');
            $table->text('description');
            $table->string('url');
            $table->string('urlToImage');
            $table->timestamp('publishedAt');
            $table->text('content');
            $table->string('category')->default('general');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
