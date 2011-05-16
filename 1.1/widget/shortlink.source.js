SNS("SNS.widget.ShortLink",function(){

    var Lang = YAHOO.lang, Event = YAHOO.util.Event, Dom = YAHOO.util.Dom, Helper = SNS.sys.Helper, Get = YAHOO.util.Get, Anim = YAHOO.util.Anim;

    /**
     * Feeds���������ʾ��������Դ��ַ
     * @function
     */
    SNS.widget.ShortLink = {

        setpos:function(el,t,s){
            var point = Dom.getXY(t);
            Dom.setStyle(el,'display','block');
            Dom.setStyle(el,'top',point[1] + 24 +'px');
            Dom.setStyle(el,'left',point[0]+(t.offsetWidth / 8) +'px');
            Dom.getFirstChild(Dom.getElementsByClassName('native-url','span',el)[0]).innerHTML = 'Դ����:' + s;
        },

        show:function(e,target){
            var rt = Event.getRelatedTarget(e),
        
            doc = window.document,
            body = doc.body;

                
            if(rt != target && !Dom.isAncestor(target,rt)){
       
                var point = Dom.getXY(target);

                var param = target.innerHTML,
                attr = Dom.getAttribute(target.parentNode,'data-sr'),
                api = Dom.getAttribute(target.parentNode,'data-url');


                if(attr){
                    var oTip = Dom.get('J_urlPop');
                    SNS.widget.ShortLink.setpos(oTip,target,attr);

                }else{

                    new SNS.sys.BasicDataSource({
                        url: api,
                        parms: {
                            shorturl: param
                        },
                        success: function(data) {
                            if(data.errorcode === '0' && data.sourceurl !== ''){
                                var oTip = Dom.get('J_urlPop'),sourceLink;
                                if(data.sourceurl.split('').length > 40) {
                                    sourceLink = data.sourceurl.substring(0,40)+'...';
                                }else{
                                    sourceLink = data.sourceurl;
                                }

                                if(!oTip){
                                    var oWrapper,oBox,oB,oS,sourceLink;
                                    oWrapper = doc.createElement('DIV');
                                    oWrapper.id = 'J_urlPop';
                                    oWrapper.className = 'url-wrapper';
                                    oBox = doc.createElement('SPAN');
                                    oBox.className = 'native-url';
                                    oB = doc.createElement('B');
                                    oS = doc.createElement('S');

                                    oB.appendChild(doc.createTextNode('Դ����:' + sourceLink));
                                    oBox.appendChild(oB);
                                    oBox.appendChild(oS);
                                    oWrapper.appendChild(oBox);
                                    body.appendChild(oWrapper);

                                    Dom.setStyle(oWrapper,'display','block');
                                    Dom.setStyle(oWrapper,'top',point[1] + 24 +'px');
                                    Dom.setStyle(oWrapper,'left',point[0]+(target.offsetWidth / 8) +'px');
                                    Dom.setAttribute(target.parentNode,'data-sr',sourceLink);
                                }else{
                                    SNS.widget.ShortLink.setpos(oTip,target,sourceLink);
                                    Dom.setAttribute(target.parentNode,'data-sr',sourceLink);
                                }

                            }else {
                                return;
                            }
                        }
                    }).jsonp();
                }

            }
        },

        hide:function(e,target){
            var oTip = Dom.get('J_urlPop'),
            rt = Event.getRelatedTarget(e);
            if(rt != target && !Dom.isAncestor(target,rt)){
                Dom.setStyle(oTip,'display','none');
            }
        }
    };


});









SNS('SNS.widget.LinkCheck', function(S) {

function openUrl(url){
    var S = KISSY, DOM = S.DOM,openTempForm,tempInput,str,strs;
       openTempForm = DOM.get("#openTempForm");
      if( openTempForm == null ){
           var openTempForm = DOM.create("<form>",{
           target:'_blank',
           name:'openTempForm',
           id:'openTempForm'
           }
         );
      DOM.append (openTempForm,document.body);
      }
     if(url.indexOf("?")!= -1){
           str = url.substr(url.indexOf("?")+1,url.length);
           strs = str.split("&");
            for(var i = 0; i < strs.length; i ++){
              tempInput = DOM.create("<input>",{
              type:'hidden',
              value:decodeURIComponent(strs[i].split("=")[1]),
              name:strs[i].split("=")[0]
              }
             );
             DOM.append( tempInput,openTempForm);
             input = null;
             tempInput = null;

           }
    }
   str = null;
   strs = null;
   DOM.attr(openTempForm,"action",url);
   openTempForm.submit();
}


    var D=YAHOO.util.Dom,E=YAHOO.util.Event,

    /*��ʼ��
	** @linkarr ָ�����ӵ�Ԫ�ػ�listNoe
	** @_spi �Ϳ���Լ���������ַ,�����ж������Ƿ�ȫ
	*/
    LinkCheck=function(linkarr){
        this.linkarr= linkarr;
        this.link="";
    }
    /*��ǰ�򿪵�����*/
    LinkCheck.link="";
    /*��ǰ�����ӵı���*/
    LinkCheck.linktitle="";
    /*�Ի���
	** @state 0:��ȫ����,1:����ȫ����(�Ϳ���Լ��)
	*/
    LinkCheck.open=function(state){
        if(state==0){
            var _openState=openUrl(LinkCheck.link);
            /*��window.open�����������ʱ,����ѡ���*/
            if(_openState==null){
                SNS.sys.LinkCheck.open(1);
            }
        }else{
            LinkCheck.linkid=D.generateId(null,"J_linkcheck");
            popupDialog = new SNS.sys.Popup({
                /*����*/
                title:LinkCheck.linktitle+"<p id="+LinkCheck.linkid+">"+LinkCheck.link+"</p>",
                width: 290,
                height:127,
                hideMask: false,
                content:"�������ݳ�����վ��Χ,����ȷ���Ƿ�ȫ��",
                /*ģ��������ʽ,app-share-next.css��*/
                type: 'linkCheck',
                onShow:function(){
                    var self=this;
                    var parentObj=D.getAncestorByClassName(LinkCheck.linkid,"linkCheck");
                    /*��ť�ĸ�Ԫ��*/
                    var parentObj2=parentObj.getElementsByTagName("button")[0].parentNode;
                    /*����Ĭ�ϵ�button��Ԫ��*/
                    parentObj.getElementsByTagName("button")[0].style.display="none";
                    /*����������ʵ�A��ǩ*/
                    var _a=document.createElement("a");
                    _a.href=LinkCheck.link;
                    _a.target="_blank";
                    _a.innerHTML="<span>��������</span>";
                    /*����ȡ�����ʵ�A��ǩ*/
                    var _a_hide=document.createElement("a");
                    D.setStyle(_a,'cuscor','pointer');
                    _a_hide.innerHTML="<span>ȡ������</span>";
                    parentObj2.appendChild(_a);
                    parentObj2.appendChild(_a_hide);
                    /*������Ӻ�ȡ��*/
                    E.on([_a,_a_hide],"click",function(e){
                        self.hide();
                    });
                }
            });
        }
    }
    YAHOO.lang.augmentObject(LinkCheck.prototype,{
        _init:function(){
            var self=this;
            E.on(this.linkarr,"click",function(e){
                E.stopEvent(e);
                var obj=E.getTarget(e);
                self.check(obj);
            });
        },
        
        check: function(){
            var obj = this.linkarr;
            if (obj.tagName!=="A"){
                return false
            };
            /*��ȡ����*/
            SNS.sys.LinkCheck.link=obj.href;
            /*��ȡ����*/
            SNS.sys.LinkCheck.linktitle=obj.getAttribute("data-linktitle");
            /* @url=��ǰ�жϵ�url��ַ*/
            var _SPI =SNS.sys.Helper.getApiURI("http://share.jianghu.{serverHost}/security/site_security.htm?callback=SNS.sys.LinkCheck.open&url="+obj.href+"&_input_charset=utf-8");
            YAHOO.util.Get.script(_SPI,{
                timeout: 1000,
                /*��ʱ���õĻص�����*/
                onTimeout:function(){
                    SNS.sys.LinkCheck.open(1);
                }
            });
            
        }
    });
    SNS.widget.LinkCheck = S.sys.LinkCheck = LinkCheck;
})



