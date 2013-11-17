Drop-it!
=======

Now drop your favorite images right into web browser with great ease. 
Just include the plugin and start using it right away

Please refer to the following steps to start using it.

Basic usage:
=======

The basic usage of the plugin start with only a single line of code.

`````javascript
<script type="text/javascript">
 $('#drop-target').bhs_uploader(); //Just a single line
</script>
`````

This will make a division wirh id "drop-target" to be droppable. 

Currently, the plguin supports following options and method.

## 1. fileUpload

This option provides ability to include files in the drop region uploaded from any file uploader.
For example, if you have any other file uploader like:

`````html
<input id="files-upload" type="file" multiple />
`````
then you can just mention the id ("#files-upload") in fileUpload option in plugin, and it will automatically link the
given file uploader to the drop area.

#### Useage:
`````javascript
  $('#drop-target').bhs_uploader({fileUpload: $('#files-upload')}); 
`````


## 2. maxfile

This option lets you limit the number of files that can be dropped into drop area. Since the drop area can hold
multiple files at a time, so you may want to limit the number of files.
The plugin currently impose limit of 5 files by default. However, you can increase it to any number you want.

#### Useage:
`````javascript
  $('#drop-target').bhs_uploader({maxfile: 4}); 
`````

## 3. onDragEnter

This option let you perform your code execution while some files that are to be dropped, enters the droppable area.
You can mention what you want to do inside the option *onDragEnter*

#### Useage:
`````javascript
  $('#drop-target').bhs_uploader({
          onDragEnter : function(){
					    console.log('File entered the droppable region');
				}
			}); 
`````

## 4. onDragOver

This option will enable you to perform any function/task you intented to do while files are over the droppable area.
It will continue to execute till the files remains over the droppable area.

#### Useage:
`````javascript
  $('#drop-target').bhs_uploader({
          onDragOver : function(){
					    console.log('File are now over the droppable region');
					//This will continue to output till you pull the file away from droppable region
				}
			}); 
`````

## 5. onDragLeave

Similar to above two options, this will execute when files being dropped leaves the drop area, such as in case you 
wanted to know if the files are actually dropped or not. This method is useful when you are curious to know if
file were just pulled away from dropped region without being dropped.

#### Useage:
`````javascript
  $('#drop-target').bhs_uploader({
          onDragLeave : function(){
					    console.log('File are now over the droppable region');
					//This will continue to output till you pull the file away from droppable region
				}
			}); 
`````

## 6. preview

This option is one of the most import option which fulfils the need of file enquiery.
If you want to know how many files have been droppes, their names, size, total count etc., utilize this function
to get every details for every files contained in the drop area.

#### Useage:
`````javascript
  $('#drop-target').bhs_uploader({
          preview : function(data){   //Type of data is array which holds detail of every files including errors
					    console.log('Total number of files dropped till now:'+ data.count);
					   //This will show you how many **valid** files have been dropped
				}
			}); 
`````

The `data` is type of array object which contains releavent informations about the files being dropped.
The `data` object looks like following array
`````
Object {
        fileinfo: 
            {0: File
              {
                handle: "glg1g",
                name: "filename.png",
                size: 45629, //in bytes
                src: "data:image/png;base64,iVBORw0KGgoAAAANSUh.... ", //Base-64 encoded data for image
                type: "image/png"
              }
            }, 
        error: 
            {
              0: "some error occured" //errors if there are any
            }, 
        count: 2  //Total 2 **valid** files are dropped
        }
`````

So using this array, you can extractb each files details. Here is a jQuery code sample
`````javascript
  var errors;
  
  $('#drop-target').bhs_uploader({
          preview : function(data){   //Type of data is array which holds detail of every files including errors
					    console.log('Total number of files dropped till now:'+ data.count);
					   //This will show you how many **valid** files have been dropped
					   for(var i =0; i<data.count;i++){
					      console.log('File Name:'+ data.fileinfo[i].name);
					      console.log('File Size:'+ data.fileinfo[i].size);
					      console.log('File type:'+ data.fileinfo[i].type);
					      console.log('File handle:'+ data.fileinfo[i].handle); //Used to uniquely represent the files
					      errors = data.error; //Store the errors
					   }
				}
			}); 
`````

You might be surprised by the `handle` object.

**Ok, so what this `handle` is?** 
`handle` is a file handler this plugin uses to help you recoginze each file uniquely in a cluster of multiple files.
As you know, this plugin supports multiple file drops, there may arise a situation when you want to apply some action
against each file that are being droppes. But how will you recognize the file?

For example, suppose that you want check progress (while being uploaded) of each file that were dropped.
If you want to upload multiple files at once, you have to be sure about which file is currently being uploaded.
Since there can be multiple files of same name and size, even of same __data source__ (i mean they are same images),
then you definitely need some unique. Here comes the role of `handle` object.

It comes with the array of file information, which you can use as file identifier.

## 7. error

Finally this option is all that left. This allows you to print any errors after the files been dropped.
you can know if there is some kind of invalid file that is dropped, or bumps in between. It will come handy
when you have to deal with large number of files.

#### Useage:
`````javascript
  $('#drop-target').bhs_uploader({
          error : function(response){   
					    console.log(response);
					   //This will print error in each line
				}
			}); 
`````

## Full option usage

Now that you have all the options described, you can use any or all or none in the plugin to start by.
Imagination is your limit.
If you want to use options, just include them in comma seperated list.
Example-
#### Useage:
`````javascript
  $('#drop-target').bhs_uploader({
          fileUpload: $('#files-upload'),
          maxfile: 4,
          onDragEnter : function(){
					  console.log('file entered the drag area');
				  },
          onDragOver : function(){
					  console.log('file is over the drag area');
				  },
				  onDragLeave : function(){
					  console.log('file left the drag area');
				  },
				  preview: function(data){
				    console.log(data);
				  },
          error : function(response){   
					    console.log(response);
					   //This will print error in each line
				}
			}); 
`````

#Methods:

The plugin not only let you preview your files but also allow you to upload it as well.
You have to just write a backend code to handle the file uploads.
Apart from this, plugin also let you to view other properties as well, such as, all the uploaded files,
files that have been dropped but not uploaded yet, etc.

Lets being with how to upload certain files.

## 1. Upload

This function let you upload all the dropped files one by one to the desired location.
All you have to do is to mention the PHP/Backend code file that will handle the file uploads.

The minimal usage is:

`````javascript
  var arg = { file: 'upload-handler.php' };
  $('#drop-files').data('bhs_uploader').upload(arg);
//Or simply as
//$('#drop-files').data('bhs_uploader').upload({file: 'upload-handler.php'});
`````

> You might be wondering why it looks like `data('bhs_uploader')` ?
> Due to the nature of the plugin, and need to parse the arguments, keeping the current DOM context, I found it more
> appealing to use `data('bhs_uploader')` instead of just `bhs_uploader` .
> But does that make any difference?

The file argument let you to mention the file which will handle the uploads.
> Don't forget to mention path of you have file at any other location than the same directory from which you are
> running this code. Example- `file: '/path/to/file/upload-handler.php'`

Apart from this, it also provides option to monitor progress of each files that are currently in the dropped area.
This option utilizes the same `data` array you have obtained previously in preview option.
It just adds a array `progress` to `data` by which you can monitor which file is under progress currently and what the
progress is.

`````javascript
var arg = {
    file: 'upload-handler.php',
    progress: function(data){
        //Use data[0] to extract details of current file
        console.log('Current file being uploaded: '+data[0].name);
        console.log('Current file\'s handle: '+data[0].handle);
        console.log('Current file\'s progress: '+ data.progress); //Note here the use of *data* not *data[0]*
        //Now we have the handle, you can apply the progress to the particular file as
        $('.file-selector['data-handle='+data[0].handle+']').html('<p>This file got'+data.progress+' % progresses');
    }
}
//Now upload the files
$('#drop-files').data('bhs_uploader').upload(arg);
`````

### done: 
This is another option which will let you to know when each file gets uploaded. The return data is what you echoed in 
PHP backend file. This will be useful when you want to pass the result image data to the frontend.

#### Usage:
`````javascript
var arg = {
    file: 'upload-handler.php',
    progress: function(data){
        //Use data[0] to extract details of current file
        console.log('Current file being uploaded: '+data[0].name);
        console.log('Current file\'s handle: '+data[0].handle);
        console.log('Current file\'s progress: '+ data.progress); //Note here the use of *data* not *data[0]*
        //Now we have the handle, you can apply the progress to the particular file as
        $('.file-selector['data-handle='+data[0].handle+']').html('<p>This file got'+data.progress+' % progresses');
    },
    done: function(response){
      //data[0] will hold details of each completed files
      //data[0].respon
      console.log('File just uploaded: '+data[0].name);
      console.log('File\'s handle: '+data[0].handle);
      console.log('File\'s response from backend: '+data[0].response);
    }
}
//Now upload the files
$('#drop-files').data('bhs_uploader').upload(arg);
`````
  
## 2. Uploaded
This function returns an array containing all the information of files that have been uploaded. It will **NOT** 
contain the details of files that are under drop region currently. Well in that case, see next function.

#### Usage:
`````javascript
  var uploaded = $('#drop-files').data('bhs_uploader').uploaded();
  console.log(uploaded); //prints list of uploaded files
`````

## 3. Preview
This function returns an array containing all the information of files that are currently inside the droppable region
but not have uploaded yet.

#### Usage:
`````javascript
  var preview = $('#drop-files').data('bhs_uploader').preview();
  console.log(preview); //prints list of files under preview(i.e not have been uploaded yet)
`````

## 4. Dropped
This function returns an array containing all the information of the files that are currently in drop region as well
as those which have been uploaded. This is much like summary of the files in current session.

This can be also summarized as:
> dropped() = preview() + uploaded()

#### Usage:
`````javascript
  var dropped = $('#drop-files').data('bhs_uploader').dropped();
  console.log(dropped); //prints list of all files (dropped plus under preview)
`````

## 4. RemoveAll
This function lets you to clear all the files and reset the webpage. This comes handy when you want to clear the
drop region for fresh start.

#### Usage:
`````javascript
  $('#drop-files').data('bhs_uploader').removeAll(function(){
    alert('Removed all the data');
  });
  console.log(dropped); //prints list of all files (dropped plus under preview)
`````

## 5. Error
And finally the most integral part of any plugin. The error function will let you check if there has been any
errors till now. It will return the array containing all the errors that have been occured during any of the process.

#### Usage:
`````javascript
  var errors = $('#drop-files').data('bhs_uploader').error();
  console.log(errors); //prints list of all errors
`````

Thats it folks. I have been pretty busy to maintain and develop this plugin. I soon will be uploading a nice demo 
to show you how actually it is being implemented and how easy it comes to be.

I am also open to any suggestions. Please fork, clone this repo and help it make a big project.
