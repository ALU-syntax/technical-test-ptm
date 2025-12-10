<?php

namespace App\Http\Controllers;

use App\Models\CategoryKebutuhan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryKebutuhanController extends Controller
{
    protected string $moduleName = "Category Kebutuhan";
    protected string $modelClass;
    protected string $routePrefix;
    protected string $storeRoute = 'library.category-kebutuhan';
    protected string $updateRoute = 'library.category-kebutuhan.update';
    protected string $destroyRoute = 'library.category-kebutuhan.destroy';
    protected string $viewSource = 'category-kebutuhan/index';
    public function __construct()
    {
        $this->modelClass = CategoryKebutuhan::class;
    }
    public function index(Request $request){
        $model = $this->modelClass;
        $query = $model::query();

        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where('name', 'like', "%{$search}%");
        }

        $perPage = (int) $request->get('per_page', 10);

        $data = $query
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        $items = $data->map(function ($row) {
            return [
                'id'         => $row->id,
                'name'       => $row->name,
                'updateUrl'  => route($this->updateRoute, $row->id),
                'destroyUrl' => route($this->destroyRoute, $row->id),
            ];
        });

        return Inertia::render($this->viewSource, [
            'items'     => [
                'data'         => $items,
                'current_page' => $data->currentPage(),
                'last_page'    => $data->lastPage(),
                'per_page'     => $data->perPage(),
                'total'        => $data->total(),
                'from'         => $data->firstItem(),
                'to'           => $data->lastItem(),
                'links'        => $data->links(),
            ],
            'filters'   => $request->only(['search','status']),
            'createUrl' => route($this->storeRoute)
        ]);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
        ]);

        $model = $this->modelClass;
        $model::create($validated);

        return back()->with('success', "{$this->moduleName} telah dibuat.");
    }

    public function update(Request $request, $id){
        $data = $request->validate([
            'name'        => ['sometimes', 'required', 'string', 'max:255'],
        ]);

        $model = $this->modelClass;
        $item  = $model::findOrFail($id);

        $item->update($data);

        return back()->with(['success' => $this->moduleName . ' telah diperbarui.']);
    }

    public function destroy($id)
    {
        $model = $this->modelClass;
        $item  = $model::findOrFail($id);

        $item->delete();

        return back()->with(['success' => $this->moduleName . ' telah dihapus.']);
    }
}
