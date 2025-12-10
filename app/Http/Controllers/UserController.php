<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    protected string $moduleName = "User";
    protected string $modelClass;
    protected string $routePrefix;
    protected string $indexRoute = 'account.users';
    protected string $storeRoute = 'account.users.store';
    protected string $updateRoute = 'account.users.update';
    protected string $destroyRoute = 'account.users.destroy';
    protected string $viewSource = 'users/index';

    public function __construct()
    {
        $this->modelClass = User::class;
    }

    public function index(Request $request)
    {
        $model = $this->modelClass;
        $query = $model::query()->with(['role', 'company'])->where('email', '!=', "superadmin@gmail.com");

        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where('name', 'like', "%{$search}%");
            $query->orWhere('email', 'like', "%{$search}%");
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
                'email'      => $row->email,
                'role_name'  => $row->roles[0]->name ?? 'N/A',
                'role_id'    => $row->roles[0]->id ?? 'N/A',
                'company_id' => $row->company_id ?? null,
                'company_name' => $row->company ? $row->company->name : '-' ,
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
            'createUrl' => route($this->indexRoute),
            'roles' => Role::where('name', '<>', 'Super Admin')
               ->orderBy('name')
               ->get(['id', 'name', 'has_company']),
            'companys' => Company::select(['id', 'name'])->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'email'       => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password'    => ['required', 'string', 'min:8', 'confirmed'],
            'role_id'     => 'required',
            'company_id' => ['nullable'],
        ]);

        $data['password'] = bcrypt($data['password']);

        $model = $this->modelClass;

        $role = Role::findById($data['role_id']);
        $item = $model::create($data);
        $item->assignRole($role->name);

        return back()->with(['success' => $this->moduleName . ' telah dibuat.']);
    }

    public function update(Request $request, $id){
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'email'       => ['sometimes', 'required', 'string', 'email', 'max:255', "unique:users,email,{$id}"],
            'password'    => ['nullable', 'string', 'min:8', 'confirmed'],
            'role_id'     => 'required',
            'company_id' => ['nullable'],
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
