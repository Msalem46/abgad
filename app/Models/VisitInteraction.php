<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VisitInteraction extends Model
{
    use HasFactory;

    protected $table = 'visit_interactions';
    protected $primaryKey = 'interaction_id';
    public $timestamps = false;

    protected $fillable = [
        'visit_id',
        'page_section',
        'action_type',
        'element_id',
        'interaction_data'
    ];

    protected $casts = [
        'interaction_data' => 'array',
        'interaction_time' => 'datetime'
    ];

    /**
     * Visit this interaction belongs to
     */
    public function visit(): BelongsTo
    {
        return $this->belongsTo(StoreVisit::class, 'visit_id', 'visit_id');
    }
}

