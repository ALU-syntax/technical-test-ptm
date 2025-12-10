<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;
use App\Traits\HasMenuPermission;
use Illuminate\Support\Facades\Cache;

class MenuSeeder extends Seeder
{
    use HasMenuPermission;
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Cache::forget('menus');
        /**
         * @var Menu $mm
         */

        // LIBRARY
        $mm = Menu::firstOrCreate(['url' => 'library'], ['name' => 'Library', 'category' => 'LIBRARY', 'icon' => 'fa-book']);
        $this->attachMenuPermission($mm, null, ['Super Admin']);

        $sm = $mm->subMenus()->create(['name' => 'Company', 'url' => $mm->url . '/company', 'category' => $mm->category]);
        $this->attachMenuPermission($sm, null, ['Super Admin']);

        $sm = $mm->subMenus()->create(['name' => 'Category Kebutuhan', 'url' => $mm->url . '/category-kebutuhan', 'category' => $mm->category]);
        $this->attachMenuPermission($sm, null, ['Super Admin']);

        $sm = $mm->subMenus()->create(['name' => 'Kebutuhan', 'url' => $mm->url . '/kebutuhan', 'category' => $mm->category]);
        $this->attachMenuPermission($sm, null, ['Super Admin']);

        // END LIBRARY

        // ACCOUNT
        $mm = Menu::firstOrCreate(['url' => 'account'], ['name' => 'Account', 'category' => 'ACCOUNT', 'icon' => 'fa-user-tie']);
        $this->attachMenuPermission($mm, null, ['Super Admin']);

        $sm = $mm->subMenus()->create(['name' => 'Users', 'url' => $mm->url . '/users', 'category' => $mm->category]);
        $this->attachMenuPermission($sm, null, ['Super Admin']);

        $sm = $mm->subMenus()->create(['name' => 'Role', 'url' => $mm->url . '/roles', 'category' => $mm->category]);
        $this->attachMenuPermission($sm, null, ['Super Admin']);

        $sm = $mm->subMenus()->create(['name' => 'Hak Akses', 'url' => $mm->url . '/hak-akses', 'category' => $mm->category]);
        $this->attachMenuPermission($sm, null, ['Super Admin']);

        // END ACCOUNT

        //  KONFIGURASI
        $mm = Menu::firstOrCreate(['url' => 'konfigurasi'], ['name' => 'Konfigurasi', 'category' => 'KONFIGURASI', 'icon' => 'fa-cogs']);
        $this->attachMenuPermission($mm, ['read '], ['Super Admin']);

        $sm = $mm->subMenus()->create(['name' => 'Menu', 'url' => $mm->url . '/menu', 'category' => $mm->category]);
        $this->attachMenuPermission($sm, ['create ', 'read ', 'update ', 'delete ', 'sort '], ['Super Admin']);

        $sm = $mm->subMenus()->create(['name' => 'Permission', 'url' => $mm->url . '/permissions', 'category' => $mm->category]);
        $this->attachMenuPermission($sm, null, ['Super Admin']);

        // END KONFIGURASI

    }
}
