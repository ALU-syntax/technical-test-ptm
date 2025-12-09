<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    protected string $moduleName = "Role";
    protected string $modelClass;
    protected string $routePrefix;
    protected string $storeRoute = 'account.roles';
    protected string $updateRoute = 'account.roles.update';
    protected string $destroyRoute = 'account.roles.destroy';
    protected string $viewSource = 'roles/index';
    public function __construct()
    {
        $this->modelClass = Role::class;
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
                'status'     => $row->status,
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
            'roles' => Role::where('name', '<>', 'Super Admin')
               ->orderBy('name')
               ->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'status'       => ['required'],
        ]);

        $data['guard_name'] = 'web';
        $model = $this->modelClass;
        $model::create($data);

        return back()->with(['success' => $this->moduleName . ' telah dibuat.']);
    }

    public function update(Request $request, $id)
    {
       $data = $request->validate([
            'name'        => ['sometimes', 'required', 'string', 'max:255'],
            'status'      => ['sometimes', 'required'],
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
