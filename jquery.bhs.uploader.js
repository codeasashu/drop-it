/*!
 * Drop-it v1.0.0 
 * Licensed under http://www.apache.org/licenses/LICENSE-2.0
 *
 * Developed by HellCoderz | www.makefbcoverscom
 */
 
(function($){
    if(!$.bhs){
        $.bhs = new Object();
    };
	
    $.bhs.uploader = function(el,options){
  
        var base = this;
		var files, target, maxfile, errorResp, fileReader;
		var resp = new Array();
		var fileArr = new Array();
		var errorArr = new Array();
		var uploadedArr = new Array();
        var Progressor= [];
		var busyFlag = false;
        
        base.$el = target = $(el);
        base.el = el;
        base.$el.data("bhs.uploader", base);
        
        base.init = function(){
            base.options = $.extend({},$.bhs.uploader.defaultOptions, options);
			//Initializations
			dataArray = [];
			maxfile = base.options.maxfile;
			$.event.props.push('dataTransfer');
			
        };
		ondragover =  function(callback){
			target.bind('dragover', function(e) {
				e.preventDefault();
				e.stopPropagation();
				if(typeof callback == 'function')
					callback.call(this);
				return false;
			});
		};
		
		base.init();
		ondragover();
		
		if(base.options.fileUpload){
			$(base.options.fileUpload).bind("change", function () {
				traverseFiles(this.files);
			});
		}
		
		
		if(typeof base.options.onDragEnter == 'function'){
			target.bind('dragenter', function(e) {
				e.preventDefault();
				e.stopPropagation();
				base.options.onDragEnter.call(this);
				return false;
			});
		}
		
		
		if(typeof base.options.onDragOver == 'function'){
			ondragover(base.options.onDragOver);
		}
		
		
		if(typeof base.options.onDragLeave == 'function'){
			target.bind('dragleave', function(e) {
				e.preventDefault();
				e.stopPropagation();
				base.options.onDragLeave.call(this);
				return false;
			});
		}

		
		target.bind('drop', function(e) {
			e.preventDefault();
			e.stopPropagation();
			var files = e.dataTransfer.files;
			traverseFiles(files);
			return false;
		});
		
		/***--------- Private Methods ----------***/
		
		uniqueData =  function(){
			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for( var i=0; i < 5; i++ )
				text += possible.charAt(Math.floor(Math.random() * possible.length));

			return text;
		}
		
		traverseFiles = function(files){
			if(files.length <= maxfile){
				var len = 0;
				$.each(files, function(index, file) {
					
					if(base.isImage(file)){
						len++;
						var uniq = uniqueData();
						file.handle = uniq;
						fileReader = new FileReader();
						fileReader.onload = (function(file) {
							return function(e) { 
								file.src = this.result;
							};
						})(files[index]);
						fileReader.readAsDataURL(file);
						fileArr.push(file);
					}else{
						errorResp = 'file '+file.name+' id('+index+') is not a valid image file';
						parseError(base.options.error, errorResp);
					}
				});
				resp = { fileinfo: fileArr, error: errorArr};
				resp.count = resp.fileinfo.length;
				parsePreview(base.options.preview, resp);
				if(typeof base.options.error == 'function')
					base.error();
				}
			else{
				errorResp = "Maximum "+maxfile+" files are allowed";
				parseError(base.options.error, errorResp);
				return false;
			}
		}
		

		parsePreview = function(MethodOpt, Args){
			if(typeof MethodOpt == 'function'){
				if(Args){
					if(MethodOpt == base.options.error){
						errorArr.push(Args);
					}
					MethodOpt.call(target,Args); 
				}				else

					MethodOpt.call(target);
			}
			return false;
		}
		
		parseError = function(MethodOpt, Args){
			errorArr.push(Args);
			if(typeof MethodOpt == 'function'){
				MethodOpt.call(target,Args); 
			}
			return false;
		}
		
		parseFunc = function(arg){
			arg.call(target);
		}
		
		clearArr = function(arr){
			if(arr && arr.length > 0){
				$.grep(arr, function(e,i){ 
					arr.splice(i,arr.length);		
				});
			}
			return arr;
		}
		
		doAjax = function(postFile, array, xhr, callback){
			
			var file = $(array.shift());
			var fileName = file[0].name;
			var fileSize = file[0].size;
			var fileType = file[0].type;
			var fileSrc = file[0].src;
			var fileHandle = file[0].handle;
			busyFlag = true;
			$.userdata = file;
			provider = function () { return xhr; };
			data = fileSrc.substr(fileSrc.indexOf('base64') + 7); 
			$.ajax({
					type: 'POST',
					url: postFile,
					xhr: provider,
					cache: false,
					data: {
						name: fileName,
						size: fileSize,
						type: fileType,
						data: data,
					},
					success: function (data) {
						$.userdata[0].response =  data;
						console.log(resp.fileinfo);
						$.grep(resp.fileinfo, function(e,i){ 
							if(e.handle == fileHandle)
							{
								resp.fileinfo.splice(i,1);
							}
						});
						callback($.userdata);
						busyFlag = false;
					},
					error: function (data,e1,e2) {
						$(array.unshift(file[0]));
						busyFlag = false;
						console.log(data.statusText);
						resp.count = resp.fileinfo.length;
						errorResp = 'The image could not be saved on server';
						parseError(base.options.error, errorResp);
					}   
			}).done(function(){
				if(array.length === 0){
					return false;
				}
				doAjax(postFile,array, xhr,callback);
			});
			resp.count = resp.fileinfo.length;
		}
		
		/***--------- Public Methods ----------***/
		
		base.isImage =  function(file){
			if (file.type.match('image.*')) {
				return true;
			}
			return false;
		}
		
		base.preview = function(arg){
			if(typeof arg === 'undefined')
				return resp;
			else{
				var index = arg;
				try
				{
					if(arg < 1) return false;
					return resp.fileinfo[arg-1];
				}
				catch(exception){
					return false;
				}				
			}
		}
		
		base.uploaded = function(){
			return uploadedArr;
		}
		
		base.error = function(){
			return (typeof resp == 'object' && resp.error)?resp.error:false;
		}
		
		base.dropped = function(){
			var x = resp.fileinfo;
			var chk = (x)?x:[];
			var dropped = $.merge( $.merge( [], chk ),  uploadedArr );
			return dropped;
		}
		
		base.removeAll =  function(arg){
			if(busyFlag == true){
				console.log('File currently under upload. Could not remove the file now');
				return false;
			}
			else{
				if(typeof arg == 'function')
					parseFunc(arg);
				resp.fileinfo = clearArr(resp.fileinfo);
				resp.error = clearArr(resp.error);
				resp.count = 0;
				return resp;
			}
		}
		
		base.upload = function(arg){
			if(typeof resp != 'undefined' && resp.count)
			{
				var xhr, provider;
				xhr = $.ajaxSettings.xhr();
				if(typeof arg === 'undefined' || arg == ''){
					errorResp = 'Please provide the argument for uploading image';
					parseError(base.options.error, errorResp);
					return false;
				}
				if(typeof arg == 'object' && !arg.file){
					errorResp = 'Please mention a PHP file before uploading';
					parseError(base.options.error, errorResp);
					return false;
				}
				if(typeof(arg.progress) == 'function')
				{
					if (xhr.upload) {
						xhr.upload.addEventListener('progress', function (evt) {
							if (evt.lengthComputable) {
								var percentage = Math.round((evt.loaded / evt.total) * 100);
								$.userdata.progress = percentage;
								arg.progress.call(target,$.userdata);
							}
						}, false);
					}
				}
			
				var file = (typeof arg == 'object')?arg.file:arg;
				doAjax(file, resp.fileinfo, xhr, function(data){
					$.grep(data, function(e,i){ 
						uploadedArr.push(data[i]);
					});
					if(typeof(arg.done) == 'function'){
						arg.done.call(target,data);
					}
				});
				
			}else{
				errorResp = 'No Valid files to upload';
				parseError(base.options.error, errorResp);
				return false;
			}
		}
		
    };
    
    $.bhs.uploader.defaultOptions = {
		maxfile: 5
    };
    
    $.fn.bhs_uploader = function(options){
		var args = Array.prototype.slice.call(arguments, 1);
        return this.each(function(){
				var item = $(this), instance = item.data('bhs_uploader');
				if(!instance) {
					item.data('bhs_uploader', new $.bhs.uploader(this, options));
				} else {
					if(typeof options === 'string') {
						return instance[options].apply(instance, args);
					}
				}	
        });
    };
    
})(jQuery);
