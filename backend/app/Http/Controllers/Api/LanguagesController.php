<?php

namespace App\Http\Controllers\Api;

use Auth;
use App\Http\Controllers\Controller;
use App\Models\Languages;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Validator;
class LanguagesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $record = Languages::orderBy('id', 'DESC');
        if (!empty($request->search) ){
          $record->where('name', 'ILIKE', '%' . $request->search . '%')
          ->orWhere('code', 'ILIKE', '%'.$request->search.'%');
      }
      $record =  $record->paginate($request->size ?? 10);

        return returnResponse(true,"Record get Successfully",$record);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $messages = [
            'name.required' => 'VALIDATION_MSGS.NAME.REQUIRED',
            'code.required' => 'VALIDATION_MSGS.LANGUAGE_CODE.REQUIRED',
            'code.unique' => 'VALIDATION_MSGS.LANGUAGE_CODE.UNIQUE',
        ];

        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'code' => 'required|unique:languages',
        ], $messages);

        if($validator->fails()){
            return returnResponse(false, '', $validator->errors() ,400);
        }
        if (@$request->file('jsonFile')) {
          $fileName = $request->file('jsonFile')->extension();
          $fileName = $request->code . "." . $fileName;
          $destinationPath = 'i18n';
          $request->file('jsonFile')->move(public_path($destinationPath), $fileName);

        }
        $s3Path='';
         if (@$request->file('userJsonFile')) {
        $extension = $request->file('userJsonFile')->extension();
        $fileNamePath = "languages/" . $request->code . "." . $extension;
        $s3Path = Storage::disk('s3')->put($fileNamePath, $request->file('userJsonFile'), 'public');
      }
      $s3Path1='';
         if (@$request->file('userBackendJsonFile')) {
        $extension = $request->file('userBackendJsonFile')->extension();
        $fileNamePath = "languages/backend/" . $request->code . "." . $extension;
        $s3Path1 = Storage::disk('s3')->put($fileNamePath, $request->file('userBackendJsonFile'), 'public');
      }
      $insertData = [
        'name'  => $request->name,
        'code'=> $request->code,
        'user_json'=> env('AWS_URL') . $s3Path,
        'user_backend_json'=> env('AWS_URL') . $s3Path1,

    ];

        $createdValues = Languages::create($insertData);
        if($createdValues)
        {
            return returnResponse(true,'insert successfully.',$insertData,200,true);
        }
        else{
            return returnResponse(false,'insert unsuccessfully.',[],403,true);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Languages  $languages
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        if($id==''){
            return returnResponse(true,"Record get Successfully",Languages::all());
        }else{
            return returnResponse(true,"Record get Successfully",Languages::find($id)->toArray(),200,true);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Languages  $languages
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        // $languages=$languages->where('id',$request->id)->first();
        // $languagesArray=$languages->toArray();
        // if(!count($languagesArray)){
        //     return returnResponse(false,'record Not found',[],404,true);
        // }else{

        //     $input = $request->all();
        //     $messages = [];
        //     $validatorArray=[];
        //     $postData=[];


        //     if(@$input['name']!=$languagesArray['name']){
        //         $validatorArray['name']='required';
        //         $messages['name.required']='VALIDATION_MSGS.NAME.REQUIRED';

        //         $postData['name'] = @$input['name'];
        //     }
        //     if(@$input['code']!=$languagesArray['code']) {
        //         $validatorArray['code'] = 'required|unique:languages';

        //         $messages['code.required']='VALIDATION_MSGS.CODE.REQUIRED';
        //         $messages['code.unique']='VALIDATION_MSGS.CODE.UNIQUE';

        //         $postData['code'] = @$input['code'];
        //     }
        //     if(count($validatorArray)) {
        //         $validator = Validator::make($request->all(), $validatorArray, $messages);

        //         if ($validator->fails()) {
        //             return returnResponse(false, '', $validator->errors() ,400);
        //         }
        //     }else {

        //         if(count($postData)) {
        //             Languages::where(['id' => $request->id])->update($postData);
        //         }

        //         return returnResponse(true, 'Update successfully.', Languages::find($request->id), 200, true);
        //     }
        // }

        if (@$request->file('jsonFile')) {
          $fileName = $request->file('jsonFile')->getClientOriginalName();
          $pp=public_path('i18n/'.$fileName);
        if (File::exists($pp)) {
          unlink($pp);
      }
          $destinationPath = 'i18n';
          $request->file('jsonFile')->move(public_path($destinationPath), $fileName);
          return returnResponse(true,'updated successfully.',[],200,true);
        }
        if (@$request->file('userJsonFile')) {
          $extension = $request->file('userJsonFile')->extension();
          $fileNamePath = "languages/" . $request->code . "." . $extension;
          $s3Path = Storage::disk('s3')->put($fileNamePath, $request->file('userJsonFile'), 'public');
          Languages::where("id", $request->id)->update(["user_json" => env('AWS_URL') . $s3Path]);
          return returnResponse(true,'updated successfully.',[],200,true);
        }

        if (@$request->file('userBackendJsonFile')) {
          $extension = $request->file('userBackendJsonFile')->extension();
          $fileNamePath = "languages/backend" . $request->code . "." . $extension;
          $s3Path = Storage::disk('s3')->put($fileNamePath, $request->file('userBackendJsonFile'), 'public');
          Languages::where("id", $request->id)->update(["user_backend_json" => env('AWS_URL') . $s3Path]);
          return returnResponse(true,'updated successfully.',[],200,true);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Languages  $languages
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $languages=Languages::where('id',$id)->first();
        $languagesArray=$languages->toArray();
        if(!count($languagesArray)){
            return returnResponse(false,'record Not found',[],404,true);
        }else{

            Languages::where(['id'=>$id])->delete();
            return returnResponse(true,'deleted successfully.',[],200,true);
        }
    }

    public function downloadJson($id){
      $language=Languages::where('id',$id)->first();
      if($language){

        return returnResponse(true,"Record get Successfully",$language);
      }
      else
      return returnResponse(false,'record Not found',[],404,true);
    }
}
