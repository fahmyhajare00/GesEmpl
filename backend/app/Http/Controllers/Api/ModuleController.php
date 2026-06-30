<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Module;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    public function index()
    {
        return response()->json(Module::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom'          => 'required|string',
            'filiere_id'   => 'required|exists:filieres,id',
            'coefficient'  => 'nullable|integer',
            'code'         => 'nullable|string|unique:modules,code',
            'description'  => 'nullable|string',
            'duree_heures' => 'nullable|integer',
        ]);
        $module = Module::create($validated);
        return response()->json($module, 201);
    }

    public function show(Module $module)
    {
        return response()->json($module);
    }

    public function update(Request $request, Module $module)
    {
        $validated = $request->validate([
            'nom'          => 'sometimes|string',
            'filiere_id'   => 'sometimes|exists:filieres,id',
            'coefficient'  => 'nullable|integer',
            'code'         => 'nullable|string|unique:modules,code,' . $module->id,
            'description'  => 'nullable|string',
            'duree_heures' => 'nullable|integer',
        ]);
        $module->update($validated);
        return response()->json($module);
    }

    public function destroy(Module $module)
    {
        $module->delete();
        return response()->json(['message' => 'Module supprimé.']);
    }
}
