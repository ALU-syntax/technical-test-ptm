<?php

namespace App\Http\Controllers;

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
        $query = $model::query()->with('role')->where('email', '!=', "superadmin@gmail.com");

        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where('name', 'ilike', "%{$search}%");
            $query->orWhere('email', 'ilike', "%{$search}%");
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
            'roles' => Role::where('name', '<>', 'Superadmin')
               ->orderBy('name')
               ->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'email'       => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password'    => ['required', 'string', 'min:8', 'confirmed'],
            'role_id'     => 'required',
            'organization_id' => ['nullable','exists:organizations,id'],
        ]);

        $data['password'] = bcrypt($data['password']);

        $model = $this->modelClass;

        $role = Role::findById($data['role_id']);
        $item = $model::create($data);
        $item->assignRole($role->name);
        // if (!empty($data['organization_id'])) {
        //    UserOrganization::create([
        //         'user_id'         => $item->id,
        //         'organization_id' => $data['organization_id'],
        //     ]);
        // }

        return back()->with(['success' => $this->moduleName . ' telah dibuat.']);
    }
}
