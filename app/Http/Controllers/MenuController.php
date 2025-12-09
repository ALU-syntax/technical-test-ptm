<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Repositories\MenuRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{

    protected string $modelClass;

    protected string $moduleName = "Menu";
    protected string $indexRoute = 'menu.index';
    protected string $storeRoute = 'menu.store';
    protected string $createRoute = 'menu.create';
    protected string $editRoute = 'menu.edit';
    protected string $updateRoute = 'menu.update';
    protected string $destroyRoute = 'menu.destroy';
    protected string $viewSource = 'menu/index';

    public function __construct(private MenuRepository $repository)
    {
        $this->repository = $repository;
        $this->modelClass = Menu::class;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $model = $this->modelClass;
        $query = $model::query();

        if ($request->filled('search')) {
            $search = $request->get('search');
             $query->where(function($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%");
            });
        }

        $perPage = (int) $request->get('per_page', 10);

        $data = $query
            ->orderBy('code', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        $items = $data->map(fn($row) => [
            'id'                 => $row->id,
            'name'               => $row->name,
            'specification'      => $row->specification,
            'tkdn'               => $row->tkdn,
            'price'              => $row->price,
            'itemCode'           => $row->item->code,
            'itemDescription'    => $row->item->name,
            'accountCode'        => $row->accounts[0]->account->code ?? null,
            'accountDescription' => $row->accounts[0]->account->name ?? null,
            'unitName'           => $row->unit->name,

            'updateUrl'     => route($this->editRoute, $row->id),
            'destroyUrl'    => route($this->destroyRoute, $row->id),
        ]);

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
            'filters'   => $request->only(['search', 'status']),
            'indexUrl' => route($this->indexRoute),
            'createUrl' => route($this->createRoute),
        ]);
    }

}
