/*
 ADOBE CONFIDENTIAL
 ___________________

 Copyright 2011 Adobe Systems Incorporated
 All Rights Reserved.

 NOTICE:  All information contained herein is, and remains
 the property of Adobe Systems Incorporated and its suppliers,
 if any.  The intellectual and technical concepts contained
 herein are proprietary to Adobe Systems Incorporated and its
 suppliers and may be covered by U.S. and Foreign Patents,
 patents in process, and are protected by trade secret or copyright law.
 Dissemination of this information or reproduction of this material
 is strictly forbidden unless prior written permission is obtained
 from Adobe Systems Incorporated.
*/
(function(a){if(!Muse.Utils.checkCSSFeature("background-size")){var c=function(b){var d=a(b),c=Muse.Utils.getStyleValue(b,"background-image").replace(/^\s*url\(\"?/,"").replace(/['"]?\)/,""),i=document.createElement("img"),j=document.createElement("div"),k=this,n=!1,l=1,m=1,o=!1,p=!0;a(j).css({overflow:"hidden",position:"absolute",top:"0px",left:"0px",width:b.clientWidth+"px",height:b.clientHeight+"px",marginBottom:"-"+b.clientHeight+"px",marginRight:"-"+b.clientWidth+"px",zIndex:"-1"}).addClass("museBgSizePolyfill");
i.src=c;i.alt="";i.style.position="absolute";j.appendChild(i);b.children.length>0?b.insertBefore(j,b.children[0]):b.appendChild(j);if(b===document.body)d=a("html"),b=d.get(0),c=d.css("background-image").replace(/^\s*url\(['"]?/,"").replace(/['"]?\)$/,""),i.src=c,d.css("background-attachment")=="fixed"?(j.style.position="fixed",p=!1):j.style.position="absolute";else if(d.is("#page"))d.css("marginLeft").toLowerCase()=="auto"&&(o=!0),j.style.top=d.offset().top+parseInt(d.css("borderTopWidth"))+"px",
j.style.bottom=parseInt(d.parent().css("paddingBottom"))+parseInt(d.css("borderBottomWidth"))+"px",j.style.left=d.offset().left+parseInt(d.css("borderLeftWidth"))+"px",j.style.right=d.offset().left+parseInt(d.css("borderRightWidth"))+"px",j.style.zIndex=0;else if(d.css("position")=="static")b.style.position="relative";this.reloadImage=function(){var a=Muse.Utils.getStyleValue(b,"background-image").replace(/^\s*url\(\"?/,"").replace(/['"]?\)/,"");if(a!=i.src)i.src=a;b.style.backgroundImage="none";
a=(d.css("background-position-x")+" "+d.css("background-position-y")).replace(/^\s+/,"").replace(/\s+$/,"").split(/\s+/);a.length==1&&a[0].indexOf("center")>=0&&a.push("center");for(var c=0,h=a.length;c<h;c++)switch(a[c]){case "center":case "50%":c==0?(i.style.left="50%",i.style.marginLeft="-"+Math.ceil(i.offsetWidth/2)+"px"):(i.style.top="50%",i.style.marginTop="-"+Math.ceil(i.offsetHeight/2)+"px");break;case "left":i.style.left="0px";i.style.marginLeft="0px";break;case "right":i.style.right="0px";
i.style.marginLeft="0px";break;case "top":i.style.top="0px";i.style.marginTop="0px";break;case "bottom":i.style.bottom="0px";i.style.marginTop="0px";break;default:c==0?(i.style.left=a[c],i.style.marginLeft="-"+Math.ceil(i.offsetWidth/2)+"px"):(i.style.top=a[c],i.style.marginTop="-"+Math.ceil(i.offsetHeight/2)+"px")}};this.resizeImage=function(a){var d=!p?b.clientWidth:Math.max(b.scrollWidth,b.clientWidth),c=!p?b.clientHeight:Math.max(b.scrollHeight,b.clientHeight),g=d/l,h=c/m;j.style.height=c+"px";
j.style.marginBottom="-"+c+"px";j.style.width=d+"px";j.style.marginRight="-"+d+"px";g<h==a?(i.style.height=c+1+"px",i.style.width="auto"):(i.style.width=d+1+"px",i.style.height="auto")};this.update=function(){if(n){b.style.backgroundImage="";var a=d.css("background-image").toLowerCase(),c=(b.currentStyle||window.getComputedStyle(b,null))["background-size"];c&&c.toLowerCase();if(a!="none"&&(c=="cover"||c=="contain")){if(k.reloadImage(),j.style.display="block",j.style.width="0px",j.style.height="0px",
k.resizeImage(c=="cover"),o)j.style.left=d.offset().left+parseInt(d.css("borderLeftWidth"))+"px",j.style.right=d.offset().left+parseInt(d.css("borderRightWidth"))+"px"}else j.style.display="none"}};if(i.complete)n=!0,l=i.clientWidth,m=i.clientHeight;else a(i).one("load",function(){n=!0;l=i.clientWidth;m=i.clientHeight;k.update()});this.update()},b=[];a(".museBGSize").each(function(){var d=new c(this);this!==document.body?b.push(d):(a(window).resize(function(){setTimeout(function(){d.update()},10)}),
setTimeout(function(){d.update()},10))});var d=b.length;d>0&&setInterval(function(){for(var a=0;a<d;a++)b[a].update()},Math.max(50,8*d))}})(jQuery);
