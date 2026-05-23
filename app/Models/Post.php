<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    //protected $appends = ['reading_time'];
    protected $guarded = ['id'];
    protected $appends = ['image_url'];
    public function category()
    {
        return  $this->belongsTo(Category::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    // public function getReadingTimeAttribute()
    // {
        
    // }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    public function likes()
    {
        return $this->hasMany(Like::class);
    }
    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return 'https://picsum.photos/800/600'; // Default fallback
        }

        return str_starts_with($this->image, 'http')
            ? $this->image
            : asset('storage/' . $this->image);
    }
   
}
