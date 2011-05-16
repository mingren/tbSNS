/**
����widget
author shiran
date 2010.03.10
 */

SNS('SNS.widget.Face',function(Y) {
    var Y = YAHOO.util,D = Y.Dom,E = Y.Event,Get = Y.Get,
    L = YAHOO.lang,
    doc = document,
    Helper  = SNS.sys.Helper,

    modConfig = {
        /**
         * ��ȡ�����б�Ľӿ�
         * @return
		{
			"fashion" : [
				{ "code" : "", "imgUrl" : "", "title" : "" },
				{ "code" : "", "imgUrl" : "", "title" : "" },
				{ "code" : "", "imgUrl" : "", "title" : "" }
			],

			"allfaces" : [
				{ "code" : "", "imgUrl" : "", "title" : "" },
				{ "code" : "", "imgUrl" : "", "title" : "" },
				{ "code" : "", "imgUrl" : "", "title" : "" }
			]
		}
         */
        elTrigger:'J_viewMoreSmile',
        container:'J_newComment',
        apiFaces : "comment:/json/face_json.htm"
    },

    /**
     * ��ǰ�ĵ�����������������
     * �ֶΣ�
     *  callback    �������ʱ�Ļص�
     */
    currentParams = {
        params : null
    },


    /**
     * ��������
	{
		"fashion" : [
			{ "code" : "", "imgUrl" : "", "title" : "" },
			{ "code" : "", "imgUrl" : "", "title" : "" },
			{ "code" : "", "imgUrl" : "", "title" : "" }
		],

		"allfaces" : [
			{ "code" : "", "imgUrl" : "", "title" : "" },
			{ "code" : "", "imgUrl" : "", "title" : "" },
			{ "code" : "", "imgUrl" : "", "title" : "" }
		]
	}
     */
    facesData = null,


    /**
     * ���ӵ��
     * @param   {HTMLElement}   container   Ҫ���ӵ�����
     */
    monitorClick = function(container, paramsContainer) {
        E.on(container, "click", function(e) {
            var el = E.getTarget(e);
            if ((el.tagName.toUpperCase() !== "A" &&
                (el = el.parentNode).tagName.toUpperCase() !== "A") ||
            !el.getAttribute("data-code")) {

                return;
            }

            E.stopEvent(e);

            var params = paramsContainer.params;

            params.popupHandle && params.popupHandle.hide();

            params.callback &&
            params.callback({
                faceId : el.getAttribute("data-code"),
                faceTitle : el.getAttribute("title") || "",
                faceUrl : el.getElementsByTagName("IMG")[0].src
            });
        });
    },


    /**
     * ����һ�������򣬲��ӷ�������ȡ�����б������
     */
    createPopup = function() {
        var elContl = doc.createElement("DIV");
        D.addClass(elContl, "sns-popup popup-translucent popup-faces");
        elContl.innerHTML = ""+
        '<div class="hd naked"><span class="horn">^</span></div>'+
        '<div class="bd clearfix">'+
        'loading ...'+
        '</div>';
        doc.body.appendChild(elContl);

        monitorClick(elContl, currentParams);

        createPopup = function() {
            return elContl;
        };

        return createPopup.apply(this, arguments);
    },

    /**
     * ��������ʾʱ��ȥ����ͼƬ
     */
    onShowPopup = function(popup) {
        var unescapeHTML = function(str) {
		var div = document.createElement('div');
		div.innerHTML = str.replace(/<\/?[^>]+>/gi, '');
		return div.childNodes[0] ? div.childNodes[0].nodeValue : '';
	}
        if (!popup.getAttribute("face-loaded")) {
            var elBody = D.getElementsByClassName("bd", "DIV", popup)[0];

            setTimeout(function() {
                loadFaces(function(data) {
                    var faces = data.allfaces;

                    facesData = data;

                    var html = [], i = 0,
                    fragment = doc.createDocumentFragment(),
                    elA, face;
                    for (; i < faces.length; ++i) {
                        face = faces[i];
                        elA = doc.createElement("A");
                        elA.setAttribute("data-code", unescapeHTML(face.code));
                        elA.setAttribute("title", face.title);
                        elA.innerHTML = KISSY.substitute("<img src='{imgUrl}' alt='{title}' />", face);
                        fragment.appendChild(elA);
                    }

                    elBody.innerHTML = "";
                    elBody.appendChild(fragment);
                });
            }, 0);

            popup.setAttribute("face-loaded", true);
        }
    },

    /**
     * ���ӵ����� �������
     * @param   {Object}    params  ����
     * @return  {Object}            SimplePopupPlus ���
     */
    attachPopupBox = function(params, handleClickSelf) {
        var handle = null;

        if (params && params.elTrigger) {
          /*  handle = TB.widget.SimplePopupPlus.decorate(params.elTrigger, createPopup(), L.merge({
                position : "bottom",
                align : "left",
                height : 270,
                eventType : handleClickSelf ? "NonExistsEvent" : "click",
                offset : [-20, 6],
                onShow : function() {
                    onShowPopup.apply(this, arguments);
                    currentParams.params = params;

                    var horn = D.getElementsByClassName("horn", "SPAN", popup)[0];
                    D[this.config.align === "right" ? "addClass" : "removeClass"](horn, "right");
                }
            }, params.popupConfig || {}));
*/
          
             

          
            var html = ""+
            '<div class="sns-popup popup-translucent popup-faces">'+
            '<div class="hd naked"><span class="horn">^</span></div>'+
            '<div class="bd clearfix">'+
            'loading ...'+
            '</div>'+
            '</div>';
            
          
            handle= new SNS.sys.NearbyPanel(params.elTrigger,html,{
                height : "270px",
                offsetTop:"10px",
                offsetLeft:"-20px",
                zIndex:99999,
                onShow:function(){
                    
                    onShowPopup(handle.mainContent);
                    params.popupHandle = handle;
                    currentParams.params = params;

                    var horn = D.getElementsByClassName("horn", "SPAN", handle.mainContent)[0];
                    D[this.config.align === "right" ? "addClass" : "removeClass"](horn, "right");
                   
                }
            });


            monitorClick(handle.mainContent, currentParams);


        }

        return handle;
    },

    /**
     * ���ر����б�
     * @param   {XHR}   response    XHR ��Ӧ����
     */
    loadFaces = function(callback) {
        if (facesData) {
            callback && callback(facesData);
        } else {
            handle.loadFaces = function(data) {
                facesData = data;
                callback && callback(facesData);
            };
            //window.FaceSelector = faceSelector;
            Get.script(Helper.buildURI(Helper.getApiURI(modConfig.apiFaces), "callback=SNS.widget.faceSelector.loadFaces"), {
                charset : "gbk"
            });
        }
    },

    handle = {
        init : function(cfg) {
            L.augmentObject(modConfig, cfg, true);
            var container = D.get(modConfig.container),
            textarea = container.getElementsByTagName('textarea')[0];

            Helper.fixCursorPosition(textarea);
            var result=true;
           return attachPopupBox({
                elTrigger:modConfig.elTrigger,
                callback:function(obj) {
                    if(textarea.value == textarea.getAttribute('placeholder')) {
                        textarea.value = '';
                    }
                    if(cfg.insertBefore) result=cfg.insertBefore();
                    if(result!=false){
                        Helper.recoverCursorPos(textarea);
                        Helper.insertText(textarea, obj.faceId);
                    }
                    if(cfg.insertAfter)cfg.insertAfter();

                }
            });
        //attachPopupBox(params);
        },

        /**
         * ��ȡ���б����б�
         */
        getAllFaces : function() {
            if (facesData) {
                return facesData.allfaces;
            }

            return [];
        },

        /**
         * ��ʾ����ѡ���
         * @param   {Object}    params      ���������
         *                                  elTrigger   ���ڶ�λ��Ԫ��
         *                                  callback    ��������Ļص�����
         */
        showDialog : function(params) {
            var elTrigger = D.get(params.elTrigger);

            if (!elTrigger.popupHandle) {
                elTrigger.popupHandle = attachPopupBox(params, true);
            }

            elTrigger.popupHandle &&
            elTrigger.popupHandle.show();
        }
    };

    SNS.widget.faceSelector = handle;

},"SNS.util.Popup");
