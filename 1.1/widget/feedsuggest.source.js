
/*
 * 微博点名
 * @author bofei
 * @date 2010.8.8
 */

SNS("SNS.widget.FeedSuggest",function(){
    /*
     *
     * 微博点名
     **/

    var Dom=YAHOO.util.Dom,
    Event=YAHOO.util.Event,
    Helper=SNS.sys.Helper;

    var MicroSuggest=function(config){

        this.config={
            url:"http://t.{serverHost}/weibo/searchRollcall.htm?_input_charset=utf-8",
            html:'<div class="microblog-suggest">'+
            '<div class="title">你想用@提到谁？</div>'+
            '<div class="content">'+
            '<ul class="list"></ul>'+
            '</div>'+
            '</div>',
            root:document.body,
            className:"J_Suggest",
            autoHeight:true,
            minHeight:20,
            maxHeight:200,
            maxLength:210
        }
        this.init(config);
    }
    MicroSuggest.prototype={
        init:function(config){
            this.config=YAHOO.lang.merge(this.config,config||{});
            this.config.url=SNS.sys.Helper.getApiURI(this.config.url);
            this.on();
        },
        /*创建 浮层*/
        _setUp:function(target){
            var self=this;
            target.panel=SNS.sys.snsNearbyPanel(target,this.config.html,{
                width:"160px",
                showHandle:false,
                zIndex:99999
            });
            target.panel.friendList=Dom.getElementsByClassName("list", "ul", target.panel.content)[0];

            // 按上下键选择
            target.panel.select=function(node){
                var current;
                if(!node)current=Dom.getFirstChild(this.friendList);
                else if(node.nodeType)current=node;
                else if(node=="next"){
                    current=Dom.getNextSibling( this._selectNode);
                    if(!current)current=Dom.getFirstChild(this.friendList)
                }
                else if(node=="prev"){
                    
                    current=Dom.getPreviousSibling( this._selectNode);
                    
                    if(!current)current=Dom.getLastChild(this.friendList);
                }
                if(this._selectNode)  Dom.removeClass(this._selectNode,"hover");
                Dom.addClass(current,"hover");
                this._selectNode=current;
            }
            // 确认当前选择
            target.panel.confirmSelect=function(fix){
                if(!this._selectNode)this._selectNode=this.select();
                if(fix)  Helper.recoverCursorPos(target);
                var pos= self._getCursortPosition(target);

         
               
                var content=target.value,subContent,p,result;
                content=content.replace(/\r\n/gi,"\n")
                p=content.lastIndexOf("@",pos);
         
                if(p!=-1){
                    subContent=content.substring(p+1,pos);
                    if(subContent.indexOf(" ")==-1&&subContent!=""){
                        target.value=content.substring(0,p+1)+this._selectNode.getAttribute("data-value")+" "+content.substring(pos,content.length);
                        target.focus();
                    };
                }
                this.hide();
                Dom.setAttribute(target,"data-lastcursor","");

                if(self.config.callback) self.config.callback();

            };

            Event.on(target.panel.content,"click",function(e){
                var target=Event.getTarget(e);
                if(Dom.hasClass(target,"friend")){
                    this.panel.confirmSelect(true);
                }
                this.panel.hide();
            },target,true)

            Event.on(target.panel.content,"mouseover",function(e){
                var target=Event.getTarget(e);
                if(Dom.hasClass(target,"friend")){
                    this.panel.select(target);
                }
            },target,true)
         
            Helper.fixCursorPosition(target);


            Event.on(document.body,"click",function(){
                target.panel.hide();
            });

        },
        //得到光标的位置
        _fgetCursortPosition:function(ctrl){
            var CaretPos = 0;	// IE Support
            if (document.selection) {
                ctrl.focus ();
                var Sel = document.selection.createRange ();
                Sel.moveStart ('character', -ctrl.value.length);
                CaretPos = Sel.text.length;
                
            }
            else if (ctrl.selectionStart || ctrl.selectionStart == '0')
                CaretPos = ctrl.selectionStart;
            return (CaretPos);

        },
        //得到光标的位置
        _getCursortPosition:function(ctrl){
           
            var CaretPos = 0;	// IE Support
            if (document.selection) {
                var start, end;

                var range = document.selection.createRange(),
                range_all;


                range_all = document.body.createTextRange();
                range_all.moveToElementText(ctrl);

                for (start = 0; range_all.compareEndPoints("StartToStart", range) < 0; start++) {
                    range_all.moveStart('character', 1);
                }


                CaretPos=start;
                
            }
            else if (ctrl.selectionStart || ctrl.selectionStart == '0')
                CaretPos = ctrl.selectionStart;



            return (CaretPos);

        },

       
        on:function(){
            var self=this;
          
            Event.on(this.config.root,"keyup",function(e){
               
                var target=Event.getTarget(e);

              
                if(Dom.hasClass(target,self.config.className)){
                    if(self.config.autoHeight) {
                    /*
                            window.setTimeout(function(){
                        target.style.height="0px";
                        var h=target.scrollHeight;
                  
                        if(h<self.config.minHeight){h=self.config.minHeight;

                        target.style.overflow="hidden"
                        }
                       if( h>self.config.maxHeight){
                           h=self.config.maxHeight;
                           target.style.overflow="auto"
                       }
            
                        target.style.height=h+"px";
                            },100);
                        */
                    
                    }
                    if(!target.panel){
                        this._setUp(target);
                    }
                    if(target.panel.config.state=="show"){
                        var keycode=Event.getCharCode(e);
                        if(keycode==40||keycode==38||keycode==13){
                            return;
                        }
                        if(keycode==8){
                    }
                    }
                  
                    this._request(target);
                  
                }

            },this,true);
            Event.on(this.config.root,"paste",function(e){
               
                var target=Event.getTarget(e);
                if(Dom.hasClass(target,self.config.className)){
                    if(self.config.autoHeight) {
                /*
                        window.setTimeout(function(){
                         
                            target.style.height="0px";
                            var h=target.scrollHeight;
                            if(h<self.config.minHeight)h=self.config.minHeight;
                            target.style.height=h+"px";
                             alert(123);
                        },500);

*/

                }
                }
            })
            Event.on(this.config.root,"keydown",function(e){
                var target=Event.getTarget(e);
                if(Dom.hasClass(target,self.config.className)){
                    if(!target.panel){
                        this._setUp(target);
                    }
                    if(target.panel.config.state=="show"){
                        var keycode=Event.getCharCode(e);
                      
                        if(keycode == 40) {
                            Event.stopEvent(e);
                            target.panel.select("next");
                        } else if(keycode == 38) {
                            Event.stopEvent(e);
                            target.panel.select("prev");
                        } else if(keycode==13){
                           
                            Event.stopEvent(e);
                            target.panel.confirmSelect();
                        }
                    }
                }
            },this,true);
            Event.on(this.config.root,"click",function(e){
                var target=Event.getTarget(e);
                if(Dom.hasClass(target,self.config.className)){
                    Event.stopEvent(e);
                    if(!target.panel){
                        this._setUp(target);
                    }
                    this._request(target);
                }
            },this,true);

        },

        //请求数据
        _request:function(target){
            var pos= this._getCursortPosition(target);
           
            var content=target.value,subContent,p,result;
            content=content.replace(/\r\n/gi,"\n")
            p=content.lastIndexOf("@",pos);
          
      
            if(p!=-1){
             
                subContent=content.substring(p+1,pos);
            
                if(subContent.indexOf(" ")==-1&&subContent!=""&&subContent.indexOf("　")==-1&&subContent.indexOf(":")==-1&&subContent.indexOf("：")==-1)this._showData(subContent,target);
                else target.panel.hide();
            }
        },
        _showData:function(parms,target){
            var self=this;
                   
             
            /* new SNS.sys.BasicDataSource({
                url:this.config.url,
                parms:{
                    kw:parms
                },
                success:function(data){
                   
                    var text="";
                    for(var p=0;p<data.length;p++){
                        text+='<li title="'+data[p].display+'" class="friend" data-value="'+data[p].nick+'">'+data[p].display+'</li>';
                    }
                            
                    target.panel.friendList.innerHTML=text;
                    if(data.length>0){
                        target.panel.place();
                        target.panel.autoHeight();
                        target.panel.show();
                        target.panel.select();
                    }
                    else target.panel.hide();
                }
            }).jsonp();
            */

            SNS.request(this.config.url, {
                data:{
                    kw:parms
                },
                use:"jsonp",
                success:function(data){
                    var text="";
                    for(var p=0;p<data.length;p++){
                        text+='<li title="'+data[p].display+'" class="friend" data-value="'+data[p].nick+'">'+data[p].display+'</li>';
                    }

                    target.panel.friendList.innerHTML=text;
                    if(data.length>0){
                        target.panel.place();
                        target.panel.autoHeight();
                        target.panel.show();
                        target.panel.select();
                    }
                    else target.panel.hide();

                }
            })
        }
    }
    SNS.widget.MicroSuggest=MicroSuggest;

},"SNS.util.Helper,SNS.util.Ajax");
