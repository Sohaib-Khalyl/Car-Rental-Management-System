<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PricingRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'car_id',
        'rule_type',
        'percentage',
    ];

    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }
}
