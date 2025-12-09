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

        $sm = $mm->subMenus()->create(['name' => 'Category', 'url' => $mm->url . '/category', 'category' => $mm->category]);
        $this->attachMenuPermission($sm, null, ['Super Admin']);

        // END LIBRARY

    }
}
