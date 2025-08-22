<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Store;
use App\Models\Role;
use App\Models\StoreLocation;
use App\Models\StorePhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class PublicStoreRegistrationController extends BaseController
{
    /**
     * Handle public store registration
     */
    public function register(Request $request)
    {
        // Validate the request
        $request->validate([
            // Owner information
            'owner_first_name' => 'required|string|max:255',
            'owner_last_name' => 'required|string|max:255',
            'owner_email' => 'required|email|unique:users,email',
            'owner_phone' => 'required|string|max:20',
            'password' => ['required', 'confirmed', Password::min(8)],
            
            // Store information
            'trading_name' => 'required|string|max:255',
            'national_id' => 'required|string|max:50|unique:stores,national_id',
            'trading_license_number' => 'required|string|max:100|unique:stores,trading_license_number',
            'commercial_registration_number' => 'nullable|string|max:100',
            'tax_number' => 'nullable|string|max:50',
            'municipality_license' => 'nullable|string|max:100',
            'health_permit' => 'nullable|string|max:100',
            'fire_safety_certificate' => 'nullable|string|max:100',
            'description' => 'required|string',
            'category' => 'required|string|max:100',
            'subcategory' => 'nullable|string|max:100',
            'established_date' => 'nullable|date',
            'website' => 'nullable|url|max:255',
            'social_media' => 'nullable|json',
            'operating_hours' => 'nullable|json',
            'location' => 'required|json',
            
            // Images
            'external_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
            'internal_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
        ]);

        DB::beginTransaction();
        
        try {
            // Create user account
            $user = User::create([
                'username' => $this->generateUsername($request->owner_first_name, $request->owner_last_name),
                'email' => $request->owner_email,
                'password' => Hash::make($request->password),
                'first_name' => $request->owner_first_name,
                'last_name' => $request->owner_last_name,
                'phone' => $request->owner_phone,
                'is_active' => true,
                'email_verified' => false,
            ]);

            // Assign store_owner role
            $storeOwnerRole = Role::where('role_name', 'store_owner')->first();
            if ($storeOwnerRole) {
                $user->roles()->attach($storeOwnerRole->role_id, [
                    'assigned_at' => now(),
                    'assigned_by' => null // Self-registration
                ]);
            }

            // Create store
            $storeData = [
                'owner_id' => $user->user_id,
                'trading_name' => $request->trading_name,
                'national_id' => $request->national_id,
                'trading_license_number' => $request->trading_license_number,
                'commercial_registration_number' => $request->commercial_registration_number,
                'tax_number' => $request->tax_number,
                'municipality_license' => $request->municipality_license,
                'health_permit' => $request->health_permit,
                'fire_safety_certificate' => $request->fire_safety_certificate,
                'description' => $request->description,
                'category' => $request->category,
                'subcategory' => $request->subcategory,
                'established_date' => $request->established_date,
                'website' => $request->website,
                'social_media' => json_decode($request->social_media ?? '{}', true),
                'operating_hours' => json_decode($request->operating_hours ?? '{}', true),
                'is_active' => true,
                'is_verified' => false, // Requires admin approval
            ];

            $store = Store::create($storeData);

            // Create store location
            $locationData = json_decode($request->location, true);
            if ($locationData) {
                StoreLocation::create([
                    'store_id' => $store->store_id,
                    'street_address' => $locationData['street_address'] ?? '',
                    'building_number' => $locationData['building_number'] ?? '',
                    'floor_number' => $locationData['floor_number'] ?? '',
                    'apartment_unit' => $locationData['apartment_unit'] ?? '',
                    'neighborhood' => $locationData['neighborhood'] ?? '',
                    'city' => $locationData['city'] ?? 'Amman',
                    'governorate' => $locationData['governorate'] ?? 'Amman',
                    'postal_code' => $locationData['postal_code'] ?? '',
                    'latitude' => $locationData['latitude'] ?? 31.9454,
                    'longitude' => $locationData['longitude'] ?? 35.9284,
                    'landmarks' => $locationData['landmarks'] ?? '',
                    'parking_availability' => $locationData['parking_availability'] ?? false,
                    'public_transport_access' => $locationData['public_transport_access'] ?? '',
                    'is_primary' => true,
                ]);
            }

            // Handle image uploads
            $this->handleImageUploads($store, $request->file('external_images') ?? [], 'exterior', $user->user_id);
            $this->handleImageUploads($store, $request->file('internal_images') ?? [], 'interior', $user->user_id);

            DB::commit();

            // Log the registration
            \Log::info('Public store registration', [
                'user_id' => $user->user_id,
                'store_id' => $store->store_id,
                'email' => $user->email,
                'store_name' => $store->trading_name
            ]);

            return $this->successResponse([
                'user_id' => $user->user_id,
                'store_id' => $store->store_id,
                'message' => 'Registration successful! Your store will be reviewed by our team.'
            ], 'Store registration submitted successfully!', 201);

        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('Public store registration failed', [
                'error' => $e->getMessage(),
                'email' => $request->owner_email,
                'store_name' => $request->trading_name
            ]);
            
            return $this->errorResponse('Registration failed. Please try again.', 500);
        }
    }

    /**
     * Generate a unique username
     */
    private function generateUsername($firstName, $lastName)
    {
        $baseUsername = strtolower($firstName . '.' . $lastName);
        $baseUsername = preg_replace('/[^a-z0-9.]/', '', $baseUsername);
        
        $username = $baseUsername;
        $counter = 1;
        
        while (User::where('username', $username)->exists()) {
            $username = $baseUsername . $counter;
            $counter++;
        }
        
        return $username;
    }

    /**
     * Handle image uploads for a store
     */
    private function handleImageUploads(Store $store, array $images, string $type, int $uploaderId)
    {
        foreach ($images as $index => $image) {
            if ($image && $image->isValid()) {
                // Generate unique filename
                $filename = Str::random(40) . '.' . $image->getClientOriginalExtension();
                
                // Store the file
                $path = $image->storeAs('stores/' . $store->store_id . '/' . $type, $filename, 'public');
                
                // Create photo record
                StorePhoto::create([
                    'store_id' => $store->store_id,
                    'file_name' => $filename,
                    'file_path' => $path,
                    'file_size' => $image->getSize(),
                    'mime_type' => $image->getMimeType(),
                    'photo_type' => $type,
                    'title' => $image->getClientOriginalName(),
                    'alt_text' => "{$type} photo of {$store->trading_name}",
                    'is_featured' => $index === 0, // First image is featured
                    'display_order' => $index,
                    'is_active' => true,
                    'uploaded_by' => $uploaderId,
                    'uploaded_at' => now(),
                ]);
            }
        }
    }
}