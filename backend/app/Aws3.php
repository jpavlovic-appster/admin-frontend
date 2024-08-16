<?php

namespace App;

use Aws\S3\S3Client;
use Aws\Exception\AwsException;
use Aws\S3\ObjectUploader;
use Aws\S3\MultipartUploader;
use Aws\Exception\MultipartUploadException;

class Aws3 {

	private $s3;
	public $staticBucket;
    public $liveBucket;
	private $archiveBucket;
	public $secretArray;
    public $editorBucket;

    /**
     * Aws3 constructor.
     */
	function __construct(){

	    $this->secretArray=[
            'region' => env('AWS_DEFAULT_REGION', ''),
            'version' => 'latest',
            'credentials' => array(
                'key'	 =>env('AWS_ACCESS_KEY_ID', ''),
                'secret' => env('AWS_SECRET_ACCESS_KEY', ''),
            ),
        ];
		$this->s3 = new S3Client($this->secretArray);

		$this->staticBucket = env('AWS_BUCKET', '');
	}

    /**'
     * @return S3Client
     */
    public function getS3Object(){

	    $n=new self();
	    return $n->s3;
    }
	//bucket object operations

    /**
     * @return array
     */
	public function getBucketAllObjectList(){
		$result = array();
		$objects = $this->s3->listObjects([
			'Bucket' => $this->staticBucket
		]);

		if(isset($objects['Contents']) && !empty($objects['Contents'])){
			foreach ($objects['Contents']  as $object) {
				$result[] =  $object['Key'];
			}
		}
		return $result;
	}

    /**
     * @param $PathName
     * @return array|null|string|string[]
     */
	public function getBucketObjectList($PathName){
		try {
			$keyArray = $this->s3->listObjects([
				'Bucket' => $this->staticBucket,
				'Prefix' => $PathName.'/',
		    ]);
		} catch (AwsException $e) {
			 $err = $e->getAwsErrorCode();
			 $err = preg_replace('/(?<!\ )[A-Z]/', ' $0', $err);
			 return $err;
		}

		if(!empty($keyArray['Contents'])){
			$keyArray = $keyArray['Contents'];
			$keys = array_column($keyArray,'Key');
			$imgArr = array();
			foreach($keys as $key){
				$imgArr[] = basename($key);
			}
			return $imgArr;
		} else {
			return array();
		}
	}

    /**
    * @param $PathName
    * @return array|null|string|string[]
    */
	public function uploadFiles($pathName,$fileData){
		set_time_limit(0);
		ini_set('memory_limit', '-1');

		if(empty($fileData)){
			return false;
			die;
		}
        $tmpArray=[];
		foreach($fileData as $k=>$v){
			$name = $v['name'];
			$size = $v['size'];
			$tmp = $v['tmp_name'];
			$ext = pathinfo($name, PATHINFO_EXTENSION);
			$key = gen_uuid()."____$name.".$ext;
            $uploader = new MultipartUploader($this->s3, $tmp, [
                'bucket' => $this->staticBucket,
                'key' 	 => $pathName.'/'.$key,
//			'ACL'    => 'public-read'
                'ACL'    => 'private'
            ]);
            try {
                $result = $uploader->upload();
                $tmpArray[$key]= $result['ObjectURL'];
            } catch (MultipartUploadException $e) {
                //return false;
            }
		}
		// Use multipart upload

        return $tmpArray;

	}

    /**
     * @param $filePath
     * @param $tmpPath
     * @param string $mime_type
     * @return bool|mixed
     */
	public function uploadFile($filePath,$tmpPath, $mime_type = ''){
		set_time_limit(0);
		ini_set('memory_limit', '-1');

		if(empty($filePath)){
			return false;
			die;
		}

		// Use multipart upload
		$uploader = new MultipartUploader($this->s3, $tmpPath, [
			'bucket' => $this->staticBucket,
			'key' 	 => $filePath,
//			'ACL'    => 'public-read'
			'ACL'    => 'private',
            'before_initiate' => function(\Aws\Command $command) use ($mime_type)
            {
                $command['ContentType'] = $mime_type;
            }
		]);

        try {
            $result = $uploader->upload();
			return $result['Key'];
		} catch (MultipartUploadException $e) {
			return false;
		}
	}

	//entire buckets operations

	public function getBucketList(){
		$result = array();
		$buckets = $this->s3->listBuckets();
		foreach ($buckets['Buckets'] as $bucket){
			$result[] = $bucket['Name'];
		}
		return $result;
	}

	public function addBucket($bucketName){
		try {
			$result = $this->s3->createBucket([
				'Bucket' => $bucketName,
			]);
			return true;
		} catch (AwsException $e) {
			$err = $e->getAwsErrorCode();
			$err = preg_replace('/(?<!\ )[A-Z]/', ' $0', $err);
			return $err;
		}
	}

	public function deleteBucket($bucketName){
		try {
			$keyArray = $this->s3->listObjects(['Bucket' => $bucketName]);
		} catch (AwsException $e) {
			 $err = $e->getAwsErrorCode();
			 $err = preg_replace('/(?<!\ )[A-Z]/', ' $0', $err);
			 return $err;
		}

		if(!empty($keyArray['Contents'])){
			$keyArray = $keyArray['Contents'];
			$keys = array_column($keyArray,'Key');

			// Delete the objects.
			$this->s3->deleteObjects([
				'Bucket'  => $bucketName,
				'Delete' => [
					'Objects' => array_map(function ($key) {
						return ['Key' => $key];
					}, $keys)
				],
			]);
		}

		try {
			$delete = $this->s3->deleteBucket(array('Bucket' => $bucketName));
			return $delete['@metadata']['statusCode'];
		} catch (AwsException $e) {
			 $err = $e->getAwsErrorCode();
			 $err = preg_replace('/(?<!\ )[A-Z]/', ' $0', $err);
			 return $err;
		}
	}


	public function deleteObject($fileName){

        $this->s3->deleteObject([
            'Bucket' => $this->staticBucket,
            'Key'    => $fileName
        ]);
    }

    public function getObjectSize($fullpath){
        try {
            $contentArray = $this->s3->listObjects([
                'Bucket' => $this->staticBucket,
                'Prefix' => $fullpath,
            ]);
        } catch (AwsException $e) {
            $err = $e->getAwsErrorCode();
            $err = preg_replace('/(?<!\ )[A-Z]/', ' $0', $err);
            return $err;
        }
        if(isset($contentArray['Contents']) && !empty($contentArray['Contents'])){
            return $contentArray['Contents'][0]['Size'];
        }else{
            return false;
        }
    }

    public function FileExists($fullpath){
        try {
            $contentArray = $this->s3->listObjects([
                'Bucket' => $this->staticBucket,
                'Prefix' => $fullpath,
            ]);
        } catch (AwsException $e) {
            $err = $e->getAwsErrorCode();
            $err = preg_replace('/(?<!\ )[A-Z]/', ' $0', $err);
            return false;
        }
        if(isset($contentArray['Contents']) && !empty($contentArray['Contents'])){
            return true;
        }else{
            return false;
        }
    }


    public function putObject($filepath, $body){
        try {
            $result = $this->s3->putObject([
                'Bucket' => $this->staticBucket,
                'Key'    => $filepath,
                'Body'   => $body,
                'ACL'    => 'private'
            ]);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function copyObject($sourcepath,$filepath){
        try {
            $result = $this->s3->copyObject([
                'Bucket' => $this->staticBucket,
                'CopySource' => $this->staticBucket."/".$sourcepath,
                'Key' => $filepath,
                'ACL' => 'private',
            ]);
            if($result['@metadata']['statusCode']==200){
                return true;
            }else{
                return false;
            }
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * @param $fileName
     * @return string
     */
    public static function getAwsUrl($fileName){
        try {

            $n=new self();

            //Creating a presigned URL
            $info = pathinfo($fileName);
            $newfilename = explode('____',@$info['filename']);
            if(isset($newfilename[1])){
                $newfilename = urldecode($newfilename[1]);
                $newfilename = removeSpecialChar($newfilename);
                $newfilename = $newfilename.".".@$info['extension'];
            }else{
                $newfilename = urldecode($info['filename']);
                $newfilename = removeSpecialChar($newfilename);
                $newfilename = $newfilename.".".@$info['extension'];
            }
            $cmd = $n->getS3Object()->getCommand('GetObject', [
                'Bucket' => $n->staticBucket,
                'Key' => $fileName,
                'ResponseContentDisposition' => "inline; filename=$newfilename"
            ]);
            $request = $n->getS3Object()->createPresignedRequest($cmd, '+60 minutes');
            return (string)$request->getUri();
        }catch (\Exception $r){
            return '';
        }
    }

}
