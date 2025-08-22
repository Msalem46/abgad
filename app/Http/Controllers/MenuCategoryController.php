<?php
namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\MenuCategory;
use Illuminate\Http\Request;

class MenuCategoryController extends BaseController
{
    /**
     * Get menu categories for a store
     */
    public function index(Store $store)
    {
        $categories = $store->menuCategories()
            ->withCount('availableMenuItems')
            ->orderBy('display_order')
            ->get();

        return $this->successResponse($categories);
    }

    /**
     * Create a new menu category
     */
    public function store(Request $request, Store $store)
    {
        $request->validate([
            'category_name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'display_order' => 'integer|min:0'
        ]);

        $category = MenuCategory::create([
            'store_id' => $store->store_id,
            'category_name' => $request->category_name,
            'description' => $request->description,
            'display_order' => $request->display_order ??
                (MenuCategory::where('store_id', $store->store_id)->max('display_order') + 1)
        ]);

        return $this->successResponse($category, 'Category created successfully!', 201);
    }

    /**
     * Update a menu category
     */
    public function update(Request $request, Store $store, MenuCategory $category)
    {
        $request->validate([
            'category_name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'display_order' => 'integer|min:0',
            'is_active' => 'boolean'
        ]);

        $category->update($request->only([
            'category_name', 'description', 'display_order', 'is_active'
        ]));

        return $this->successResponse($category, 'Category updated successfully!');
    }

    /**
     * Delete a menu category
     */
    public function destroy(Store $store, MenuCategory $category)
    {
        // Check if category has menu items
        if ($category->menuItems()->count() > 0) {
            return $this->errorResponse(
                'Cannot delete category that contains menu items. Please move or delete the items first.',
                400
            );
        }

        $category->delete();
        return $this->successResponse(null, 'Category deleted successfully!');
    }
}
