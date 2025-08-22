<?php
namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\StoreLocation;
use App\Http\Requests\StoreLocationRequest;

class StoreLocationController extends BaseController
{
    /**
     * Get all locations for a store
     */
    public function index(Store $store)
    {
        $locations = $store->locations()->get();
        return $this->successResponse($locations);
    }

    /**
     * Store a new location for the store
     */
    public function store(StoreLocationRequest $request, Store $store)
    {
        $data = $request->validated();
        $data['store_id'] = $store->store_id;

        // If this is set as primary, update others
        if ($data['is_primary'] ?? false) {
            $store->locations()->update(['is_primary' => false]);
        }

        $location = StoreLocation::create($data);
        return $this->successResponse($location, 'Location added successfully!', 201);
    }

    /**
     * Update a store location
     */
    public function update(StoreLocationRequest $request, Store $store, StoreLocation $location)
    {
        $data = $request->validated();

        // If this is set as primary, update others
        if ($data['is_primary'] ?? false) {
            $store->locations()->update(['is_primary' => false]);
        }

        $location->update($data);
        return $this->successResponse($location, 'Location updated successfully!');
    }

    /**
     * Delete a store location
     */
    public function destroy(Store $store, StoreLocation $location)
    {
        // Prevent deleting the only location
        if ($store->locations()->count() <= 1) {
            return $this->errorResponse('Cannot delete the only location for this store', 400);
        }

        $location->delete();
        return $this->successResponse(null, 'Location deleted successfully!');
    }
}
