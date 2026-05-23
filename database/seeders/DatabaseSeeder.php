<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // 1. Create 10 Normal Users
        User::factory(10)->create(['role' => 'user']);

        // 2. Create 1 Specific Admin User
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
            'password' => bcrypt('password'), // Ensure you know the login!
        ]);

        // 3. Create Categories and store them in a variable
        $categoryNames = ['Sports', 'Technology', 'Politics', 'Health', 'Travel', 'Entertainment'];
        $categories = collect($categoryNames)->map(function ($name) {
            return Category::create([
                'name' => $name,
                'slug' => Str::slug($name),
            ]);
        });

        // 4. Create 20 Realistic News Posts
        $newsTitles = [
            'Global Markets Brace for Economic Shift',
            'New AI Breakthrough Redefines Healthcare Tech',
            'Championship Finals: A Night to Remember',
            'Hidden Gems: Why This Coastal Town is 2026’s Top Travel Destination',
            'The Future of Remote Work: Trends to Watch',
            'Political Landscape Shifts After Recent Election Results',
            'Breakthrough Study Reveals New Benefits of Mediterranean Diet',
            'SpaceX Successfully Launches Next-Gen Satellite Array',
            'Award-Winning Director Announces Surprising Career Pivot',
            'How Sustainable Architecture is Changing Urban Living',
        ];

        foreach ($newsTitles as $index => $title) {
            // Assign to a random category from our collection
            $category = $categories->random();

            Post::create([
                'user_id' => $admin->id,
                'category_id' => $category->id,
                'title' => $title,
                'slug' => Str::slug($title) . '-' . Str::random(5),
                'image' => "https://picsum.photos/seed/news-" . ($index + 1) . "/1200/800",
                'content' => fake()->paragraphs(5, true), // Generates 5 realistic paragraphs
                'views' => fake()->numberBetween(500, 10000),
                'created_at' => fake()->dateTimeBetween('-1 month', 'now'),
            ]);
        }

        // Add 10 more completely random posts using Faker for volume
        for ($i = 0; $i < 10; $i++) {
            $title = fake()->sentence(8);
            Post::create([
                'user_id' => $admin->id,
                'category_id' => $categories->random()->id,
                'title' => $title,
                'slug' => Str::slug($title),
                'image' => "https://picsum.photos/seed/random-" . $i . "/1200/800",
                'content' => fake()->paragraphs(3, true),
                'views' => fake()->numberBetween(10, 500),
                'created_at' => now(),
            ]);
        }
    }
}
