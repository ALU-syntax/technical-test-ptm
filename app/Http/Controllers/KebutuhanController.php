<?php

namespace App\Http\Controllers;

use App\Models\CategoryKebutuhan;
use App\Models\Kebutuhan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KebutuhanController extends Controller
{
    protected string $moduleName = "Kebutuhan";
    protected string $modelClass;
    protected string $routePrefix;
    protected string $storeRoute = 'library.kebutuhan';
    protected string $updateRoute = 'library.kebutuhan.update';
    protected string $destroyRoute = 'library.kebutuhan.destroy';
    protected string $viewSource = 'kebutuhan/index';
    public function __construct()
    {
        $this->modelClass = Kebutuhan::class;
    }

    public function index(Request $request){
        $model = $this->modelClass;
        $query = $model::query()->with(['category']);

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
                'category_kebutuhan'   => $row->category->id,
                'category_kebutuhan_name' => $row->category->name,
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
            'createUrl' => route($this->storeRoute),
            'listCategoryKebutuhan' => CategoryKebutuhan::orderBy('name', 'asc')->get(['id', 'name'])
        ]);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'category_kebutuhan'    => ['required', 'gt:0'],
        ], [
            'category_kebutuhan' => 'Pilih Category nya terlebih dahulu'
        ]);

        $model = $this->modelClass;
        $model::create($validated);

        return back()->with('success', "{$this->moduleName} telah dibuat.");
    }

    public function update(Request $request, $id){
        $data = $request->validate([
            'name'        => ['sometimes', 'required', 'string', 'max:255'],
            'category_kebutuhan' => ['required', 'gt:0'],
        ],[
            'category_kebutuhan' => 'Pilih Category nya terlebih dahulu'
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
