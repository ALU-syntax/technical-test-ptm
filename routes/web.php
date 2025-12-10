<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::group(['prefix' => 'library', 'as' => 'library.'], function () {

        Route::prefix('company')->group(function(){
            Route::get('/', [CompanyController::class, 'index'])->name('company');
            Route::post('/', [CompanyController::class, 'store'])->name('company');
            Route::get('/edit/{id}', [CompanyController::class, 'edit'])->name('company.edit');
            Route::put('/update/{id}', [CompanyController::class, 'update'])->name('company.update');
            Route::delete('/{id}/destroy', [CompanyController::class, 'destroy'])->name('company.destroy');
        });
    });

    Route::group(['prefix' => 'konfigurasi', 'as' => 'konfigurasi/'], function () {

        Route::prefix('menu')->group(function(){
            // Route::get('/', [MenuController::class, 'index'])->name('menu');
            // Route::get('/create', [MenuController::class, 'create'])->name('menu/create');
            // Route::get('/{menu}/edit', [MenuController::class, 'edit'])->name('menu/edit');
            // Route::post('/update{id}', [MenuController::class, 'update'])->name('menu/update');
            // Route::post('/store', [MenuController::class, 'store'])->name('menu/store');
            // Route::put('/sorting', [MenuController::class, 'sort'])->name('menu/sort');
            // Route::post('/{id}/destroy', [MenuController::class, 'destroy'])->name('menu/destroy');
        });

        // Route::prefix('permissions')->group(function(){
        //     Route::get('/', [PermissionController::class, 'index'])->name('permissions');
        //     Route::get('/create', [PermissionController::class, 'create'])->name('permissions/create');
        //     Route::get('/edit/{id}', [PermissionController::class, 'edit'])->name('permissions/edit');
        //     Route::post('/store', [PermissionController::class, 'store'])->name('permissions/store');
        //     Route::post('/update/{id}', [PermissionController::class, 'update'])->name('permissions/update');
        //     Route::delete('/destroy/{id}', [PermissionController::class, 'destroy'])->name('permissions/destroy');
        // });
    });

    Route::group(['prefix' => 'account', 'as' => 'account.'], function(){
        Route::prefix('users')->group(function () {
            Route::get('/', [UserController::class, 'index'])->name('users');
            Route::get('/create', [UserController::class, 'create'])->name('users.create');
            Route::get('/edit/{id}', [UserController::class, 'edit'])->name('users.edit');
            Route::post('/store', [UserController::class, 'store'])->name('users.store');
            Route::post('/update/{id}', [UserController::class, 'update'])->name('users.update');
            Route::post('/destroy/{id}', [UserController::class, 'destroy'])->name('users.destroy');
        });

        Route::prefix('roles')->group(function(){
            Route::get('/', [RoleController::class, 'index'])->name('roles');
            Route::post('/', [RoleController::class, 'store'])->name('roles');
            Route::get('/edit/{id}', [RoleController::class, 'edit'])->name('roles.edit');
            Route::put('/update/{id}', [RoleController::class, 'update'])->name('roles.update');
            Route::delete('/destroy/{id}', [RoleController::class, 'destroy'])->name('roles.destroy');
        });

        // Route::prefix('hak-akses')->group(function(){
        //     Route::get('/', [HakAksesController::class, 'index'])->name('hak-akses');
        //     Route::get('/edit/hak-akses-role/{id}', [HakAksesController::class, 'editAksesRole'])->name('hak-akses/role/edit');
        //     Route::post('/update/role/{id}', [HakAksesController::class, 'updateAksesRole'])->name('hak-akses/role/update');
        //     Route::get('/edit/hak-akses-user/{id}', [HakAksesController::class, 'editAksesUser'])->name('hak-akses/user/edit');
        //     Route::post('/update/user/{id}', [HakAksesController::class, 'updateAksesUser'])->name('hak-akses/user/update');
        // });

    });


});

require __DIR__.'/settings.php';
