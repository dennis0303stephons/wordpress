(function(a,c){var b=wp.customize;b.Control=b.Value.extend({initialize:function(g,f,e){var d='[name="'+b.settings.prefix+g+'"]';this.params={};b.Value.prototype.initialize.call(this,f,e);this.id=g;this.container=c("#customize-control-"+g);this.element=this.element||new b.Element(this.container.find(d));this.method=this.method||"refresh";this.element.link(this);this.link(this.element);this.bind(this.sync)},sync:function(){switch(this.method){case"refresh":return this.previewer.refresh();case"postMessage":return this.previewer.send("setting",[this.id,this()])}}});b.ColorControl=b.Control.extend({initialize:function(d,i,l){var k=this,g,h,j,f,e;b.Control.prototype.initialize.call(this,d,i,l);g=this.container.find(".color-picker");h=g.find(".color-picker-controls");f=g.find("a");e=function(m){m="#"+m;f.css("background",m);k.farbtastic.setColor(m)};this.input=new b.Element(h.find("input"));this.link(this.input);this.input.link(this);g.on("click","a",function(){h.toggle()});this.farbtastic=c.farbtastic(g.find(".farbtastic-placeholder"),function(m){k.set(m.replace("#",""))});this.bind(e);e(this())},validate:function(d){return/^[a-fA-F0-9]{3}([a-fA-F0-9]{3})?$/.test(d)?d:null}});b.UploadControl=b.Control.extend({initialize:function(g,e,d){var f=this;b.Control.prototype.initialize.call(this,g,e,d);this.params.removed=this.params.removed||"";this.uploader=new wp.Uploader({browser:this.container.find(".upload"),success:function(h){f.set(h.url)}});this.remover=this.container.find(".remove");this.remover.click(function(h){f.set(f.params.removed);h.preventDefault()});this.bind(this.removerVisibility);this.removerVisibility(this.get());if(this.params.context){f.uploader.param("post_data[context]",this.params.context)}},removerVisibility:function(d){this.remover.toggle(d!=this.params.removed)}});b.ImageControl=b.UploadControl.extend({initialize:function(f,e,d){b.UploadControl.prototype.initialize.call(this,f,e,d);this.thumbnail=this.container.find(".thumbnail img");this.bind(this.thumbnailSrc)},thumbnailSrc:function(d){if(/^(http:\/\/|https:\/\/|\/\/)/.test(d)){this.thumbnail.prop("src",d).show()}else{this.thumbnail.hide()}}});b.defaultConstructor=b.Setting;b.Previewer=b.Messenger.extend({refreshBuffer:250,initialize:function(e,d){c.extend(this,d||{});this.loaded=c.proxy(this.loaded,this);this.loaderUuid=0;this.refresh=(function(f){var g=f.refresh,i=function(){h=null;g.call(f)},h;return function(){if(typeof h!=="number"){if(f.loading){f.loading.remove();delete f.loading;f.loader()}else{return i()}}clearTimeout(h);h=setTimeout(i,f.refreshBuffer)}})(this);this.iframe=b.ensure(e.iframe);this.form=b.ensure(e.form);this.name=this.iframe.prop("name");this.container=this.iframe.parent();b.Messenger.prototype.initialize.call(this,e.url,this.iframe[0].contentWindow);this._formOriginalProps={target:this.form.prop("target"),action:this.form.prop("action")};this.bind("url",function(f){if(this.url()==f||0!==f.indexOf(this.origin()+"/")||-1!==f.indexOf("wp-admin")){return}this.url(f);this.refresh()});this.refresh();this.form.on("keydown",function(f){if(13===f.which){f.preventDefault()}})},loader:function(){if(this.loading){return this.loading}this.loading=c("<iframe />",{name:this.name+"-loading-"+this.loaderUuid++}).appendTo(this.container);return this.loading},loaded:function(){this.iframe.remove();this.iframe=this.loading;delete this.loading;this.iframe.prop("name",this.name);this.targetWindow(this.iframe[0].contentWindow)},refresh:function(){this.loader().one("load",this.loaded);this.submit({target:this.loader().prop("name"),action:this.url()})},submit:function(d){if(d){this.form.prop(d)}this.form.submit();if(d){this.form.prop(this._formOriginalProps)}}});b.controls={color:b.ColorControl,upload:b.UploadControl,image:b.ImageControl};c(function(){if(!b.settings){return}var d=new b.Previewer({iframe:"#customize-preview iframe",form:"#customize-controls",url:b.settings.preview});c.each(b.settings.controls,function(h,f){var e=b.controls[f.control]||b.Control,g;g=b.add(h,new e(h,f.value,{params:f.params,previewer:d}));if(f.visibility){b(f.visibility.id,function(i){if("boolean"===typeof f.visibility.value){i.bind(function(j){g.container.toggle(!!j==f.visibility.value)})}else{i.bind(function(j){g.container.toggle(j==f.visibility.value)})}})}});c(".customize-section-title").click(function(){c(this).parents(".customize-section").toggleClass("open");return false});c("#save").click(function(){d.submit();return false});b("background_color",function(e){e.method="postMessage"})})})(wp,jQuery);