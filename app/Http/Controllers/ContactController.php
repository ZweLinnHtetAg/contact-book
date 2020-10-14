<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\ContactStoreRequest;
use App\Models\Contact;

class ContactController extends Controller
{
   
    public function index()
    {
        return Contact::when(request('search'),function($query){
            $query->where('name','like','%'.request('search').'%');
            $query->orWhere('phone','like','%'.request('search').'%');
        })->orderBy('id','DESC')->paginate(10);
    }

    public function create()
    {
        
    }

    public function store(ContactStoreRequest $request)
    {
        return Contact::create($request->all());
    }

    public function show(Contact $contact)
    {
        return $contact;
    }

    public function edit($id)
    {
        //
    }


    public function update(Request $request,Contact $contact)
    {
         $contact->update($request->all());
         return $contact;
    }

    public function destroy($id)
    {
        $contact = Contact::find($id);
        $contact->delete();

        return $contact;
    }
}
