<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyController extends Controller
{
    protected string $moduleName = "Company";
    protected string $modelClass;
    protected string $routePrefix;
    protected string $storeRoute = 'library.company';
    protected string $updateRoute = 'library.company.update';
    protected string $destroyRoute = 'library.company.destroy';
    protected string $viewSource = 'company/index';
    public function __construct()
    {
        $this->modelClass = Company::class;
    }
    public function index(Request $request)
    {
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
                'address'    => $row->address,
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
        ]);

        $model = $this->modelClass;
        $model::create($validated);

        return back()->with('success', "{$this->moduleName} telah dibuat.");
    }

    public function update(Request $request, $id){
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
        ]);

        $model = $this->modelClass;
        $item = $model::findOrFail($id);
        $item->update($validated);

        return back()->with('success', "{$this->moduleName} telah diperbarui.");
    }

    public function destroy($id){
        $model = $this->modelClass;
        $item = $model::findOrFail($id);
        $item->delete();

        return back()->with('success', "{$this->moduleName} telah dihapus.");
    }
}
