<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kebutuhan extends Model
{
    /** @use HasFactory<\Database\Factories\KebutuhanFactory> */
    use HasFactory, SoftDeletes;

    protected $guarded = ['id'];

    public function category(){
        return $this->belongsTo(CategoryKebutuhan::class, 'category_kebutuhan', 'id');
    }
}
