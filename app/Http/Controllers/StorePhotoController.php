<?php
namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\StorePhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StorePhotoController extends BaseController
{
    /**
     * Get store photos (gallery view)
     */
    public function index(Store $store)
    {
        $photos = $store->activePhotos()
            ->orderBy('is_featured', 'desc')
            ->orderBy('display_order')
            ->get();

        return $this->successResponse($photos);
    }

    /**
     * Upload new photos
     */
    public function store(Request $request, Store $store)
    {
        $request->validate([
            'photos' => 'required|array|max:10',
            'photos.*' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max
            'photo_type' => 'required|in:exterior,interior,product,menu,other',
            'is_featured.*' => 'boolean'
        ]);

        $uploadedPhotos = [];

        foreach ($request->file('photos') as $index => $file) {
            $filename = time() . '_' . $index . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('store-photos/' . $store->store_id, $filename, 'public');

            $photo = StorePhoto::create([
                'store_id' => $store->store_id,
                'file_name' => $filename,
                'file_path' => $path,
                'file_size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'photo_type' => $request->photo_type,
                'title' => $request->input("titles.$index"),
                'description' => $request->input("descriptions.$index"),
                'alt_text' => $request->input("alt_texts.$index"),
                'is_featured' => $request->input("is_featured.$index", false),
                'display_order' => StorePhoto::where('store_id', $store->store_id)->max('display_order') + 1,
                'uploaded_by' => auth()->id()
            ]);

            $uploadedPhotos[] = $photo;
        }

        return $this->successResponse($uploadedPhotos, 'Photos uploaded successfully!', 201);
    }

    /**
     * Update photo details
     */
    public function update(Request $request, Store $store, StorePhoto $photo)
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'alt_text' => 'nullable|string|max:255',
            'is_featured' => 'boolean',
            'display_order' => 'integer|min:0'
        ]);

        $photo->update($request->only([
            'title', 'description', 'alt_text', 'is_featured', 'display_order'
        ]));

        return $this->successResponse($photo, 'Photo updated successfully!');
    }

    /**
     * Delete a photo
     */
    public function destroy(Store $store, StorePhoto $photo)
    {
        // Delete file from storage
        if (Storage::disk('public')->exists($photo->file_path)) {
            Storage::disk('public')->delete($photo->file_path);
        }

        $photo->delete();
        return $this->successResponse(null, 'Photo deleted successfully!');
    }

    /**
     * Reorder photos
     */
    public function reorder(Request $request, Store $store)
    {
        $request->validate([
            'photos' => 'required|array',
            'photos.*.id' => 'required|exists:store_photos,photo_id',
            'photos.*.display_order' => 'required|integer|min:0'
        ]);

        foreach ($request->photos as $photoData) {
            StorePhoto::where('photo_id', $photoData['id'])
                ->where('store_id', $store->store_id)
                ->update(['display_order' => $photoData['display_order']]);
        }

        return $this->successResponse(null, 'Photos reordered successfully!');
    }
}
