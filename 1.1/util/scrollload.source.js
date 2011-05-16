
SNS("SNS.util.ScrollLoad",function(){
    var Lang = YAHOO.lang, Event = YAHOO.util.Event, Dom = YAHOO.util.Dom;
    var K = KISSY, D = K.DOM, E = K.Event;


    SNS.util.ScrollLoad = function(cfg) {

        this.cfg = {
            //feeds����
            el: '',
            page: 1,
            // ��������������ײ��ľ��룬С�ڴ˾���ʱ��������feeds ����
            distance: 200,
            // ����feeds �¼����������ʱ
            delay: 100,
            url:"",
            param: {}
        };

        this.cfg = K.merge(this.cfg, cfg || {});



        this.page=this.cfg.page;
        if(this.cfg.param.page)this.page= this.cfg.param.page;
        this.status="stop";
        this.isRun = true;

       
    };


    SNS.util.ScrollLoad.prototype = {
        // ��ʼ������
        init: function() {
           
            this.cfg.el = Dom.get(this.cfg.el);
            if (!this.cfg.el)return this;
            
            this._check();
            return this;
        },
        _check:function(){
            var self=this;

            //��ֹie6�������dom
            // ȥ��������ע�͵Ĳ�����K.ready��,��Ϊ����ԭ����޷�����k.ready

                self._request( function(html) {
                    if(!K.trim(html))return;
                    if(self._canScroll()){
                        self._check();
                    } else{
                        self._on();
                    }
                });
           


        },
        // ������Ƿ��й�����
        _canScroll: function() {

            var h = Dom.getY(this.cfg.el) + this.cfg.el.offsetHeight;
            return h - Dom.getDocumentScrollTop() - this.cfg.distance < Dom.getViewportHeight();
        },
        _request:function(success){
            
            if(this.status == "loading"|| this.status=="destroy") return;
            var self=this, loading;
            var param=  K.mix(self.cfg.param,{
                page:self.page
            })
            var callback=function(resp){
                if(self.status=="destroy")return ;
                self.status="stop"
              
                self.page++;
                if(loading) {
                    loading.style.display="none";
                // D.remove(loading);
                }

             
                var newContent = document.createElement('div');
                newContent.innerHTML = resp.responseText;
               

                self.cfg.el.appendChild(newContent);
                if(success) success(resp.responseText);
               
                if(self.cfg.success)self.cfg.success(resp.responseText, param, newContent);
                if(!K.trim(resp.responseText)){

                    self.destroy();
                    return;
                }
                 

                
            }


            loading = document.createElement('div');
            loading.innerHTML = "<img src='http://img06.taobaocdn.com/tps/i6/T13l0vXhRrXXXXXXXX-24-24.gif' alt='loading ...' /><br /><br />";
            self.cfg.el.appendChild(loading);


            SNS.request(this.cfg.url,{
                success:callback,
                data:param
            })
            //YAHOO.util.Connect.asyncRequest('POST', this.cfg.url, callback, K.param(param));
            this.status="loading";
        },

        // ��ӹ������¼�
        _on: function() {
            var self = this;
            this.scrollFn= function() {

                if(!self.isRun) return;

                if (self._canScroll()&&self.status=="stop") {
                    if (self._timeout) {
                        clearTimeout(self._timeout);
                        self._timeout = null;
                    }
                    self._timeout = setTimeout(function() {
                        self._request();
                    }, self.cfg.delay);
                }

            }

            Event.on(window, 'scroll', this.scrollFn);
            Event.on(window, 'resize', this.scrollFn);
        },
        pause:function(){
            this.isRun =false;
        },
        restart:function(){
            this.isRun = true;
        },
        destroy:function(){
            Event.removeListener (window, 'scroll');
            Event.removeListener (window, 'resize');
            clearTimeout(this._timeout);
            this._timeout = null;
            this.status="destroy";

        }
    };


},"SNS.util.Ajax");
