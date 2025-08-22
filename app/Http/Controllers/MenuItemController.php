<?php
namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\MenuItem;
use App\Http\Requests\MenuItemRequest;

class MenuItemController extends BaseController
{
    /**
     * Get menu items for a store
     */
    public function index(Store $store)
    {
        $items = $store->menuItems()
            ->with('category')
            ->orderBy('display_order')
            ->get();

        return $this->successResponse($items);
    }

    /**
     * Create a new menu item
     */
    public function store(MenuItemRequest $request, Store $store)
    {
        $data = $request->validated();
        $data['store_id'] = $store->store_id;

        if (!isset($data['display_order'])) {
            $data['display_order'] = MenuItem::where('store_id', $store->store_id)->max('display_order') + 1;
        }

        $item = MenuItem::create($data);
        $item->load('category');

        return $this->successResponse($item, 'Menu item created successfully!', 201);
    }

    /**
     * Update a menu item
     */
    public function update(MenuItemRequest $request, Store $store, MenuItem $item)
    {
        $item->update($request->validated());
        $item->load('category');

        return $this->successResponse($item, 'Menu item updated successfully!');
    }

    /**
     * Delete a menu item
     */
    public function destroy(Store $store, MenuItem $item)
    {
        $item->delete();
        return $this->successResponse(null, 'Menu item deleted successfully!');
    }

    /**
     * Toggle item availability
     */
    public function toggleAvailability(Store $store, MenuItem $item)
    {
        $item->update(['is_available' => !$item->is_available]);

        $status = $item->is_available ? 'available' : 'unavailable';
        return $this->successResponse($item, "Item marked as $status!");
    }
}
