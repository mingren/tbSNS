/**
 *  @description ������� �����Ӻ��Ѻ͹�ͬ���ѹ���
 *  @author ����(mingren@taobao.com)
 *  @date 2011.04.06
 *
 *	������ sns.js �� kissy 1.1.6
 *
 */

SNS('SNS.widget.Friend', function() {

    var	K = KISSY, D = K.DOM, E = K.Event;

	(function(){

	/*
	 *	���Ӻ��ѡ�
	 *
	 *
	 *	���÷�ʽ��
	 *
	 *	 SNS(function(){
	 *	 
	 *		SNS.widget.Friend.addFriend( {
	 *			userId : userId,
	 *			callback : function(){
	 *				console.log( "your code here" );
	 *			},
	 *			isFork : 0,
	 *			msgId : 123
	 *		);
	 *	 
	 *	 },"SNS.widget.Friend");
	 *
	 *	������
	 *	param					������̨�Ĳ�������ҵ����Լ�����
	 *	{	
	 *		friendId			�Է�id
	 *		isFork				Ϊ�������̱��
	 *		msgId				������Ϣ�����еļӺ��Ѵ���msgid
	 *	}
	 *
	 *	 callback		���������Ļص�����
	 *
	 */

	var addFriend = function( param , callback ){		/* ���� { param = {} , callback = function(){} */ 

		var popup,		//���������
			popupEl;	//������DOM

		/*
		 *	��ʼ�����
		 */

		var init = function(){

			if( SNS.widget.showLogin( arguments.callee ) == 0 ){
			
				return;
			
			}

			//ͳ��
			D.create('<img src="http://www.atpanel.com/jsclick?cache='+ Math.ceil( Math.random()*Math.pow(10,7) ) +'&profriend=add" alt=" " />');

			K.getScript( SNS.sys.Helper.getApiURI('http://assets.{serverHost}/p/sns/1.1/widget/css/add-friends.css'), function(){}, 'GBK');

			//��������,�������븡��
			K.jsonp( SNS.sys.Helper.getApiURI('http://jianghu.{serverHost}/json/inviteSetting.htm'), param,	function(data){

					setTimeout(function(){

					if(data.auth == false){
						KISSY.use("",function(K){
							K.getScript('http://assets.taobaocdn.com/p/sns/1.0/widget/auth/auth.css?t=' + new Date().getTime(), function(){}, 'GBK');
							K.getScript('http://assets.taobaocdn.com/p/sns/1.0/widget/auth/auth.js?t=' + new Date().getTime(), function(){
								K.use("auth",function(K){
									K.sns.auth();
								});
							}, 'GBK');
						});

						return;
					}


					K.use("overlay",function(){
						popup = new K.Overlay({
							width: 430,
							elCls: "add-friend-popup",
							content:data.html,
							mask:true,
							align: {
								node: null, 
								points: ['cc','cc'],
								offset: [0, 0] 
							}
						});

						popup.show();

						//����DOM�����������и��㹫��
						popupEl = popup.get("contentEl").getDOMNode();

						_bindEvent();
					});

					},100);

				}
			);
			
		};



		/* 
		 *	�¼�����
		 *	�Ӻ��������и����衢����
		 */

		var _bindEvent = function(){

			E.on( popupEl, "click", function(e){

				//�ش�����������Ѹ���
				if( D.hasClass(e.target, "J_Request1") ){

					var reqParam = eval('(' + D.attr( e.target, "data-param") + ')');

					e.preventDefault();

					K.jsonp( SNS.sys.Helper.getApiURI('http://jianghu.{serverHost}/json/applyFriend.htm'),
						K.mix( reqParam, {
							type : 0,//�����Ͻӿ�
							groupId : 1,//�����Ͻӿ�
							question : encodeURIComponent(encodeURIComponent(D.get(".J_Question").value)),
							answer : encodeURIComponent(encodeURIComponent(D.get(".J_Answer", popupEl).value))
						}),
						function(data){
							popup.set("content",data.html);
							
							if( (data.success == 1) && callback )
								callback();
						}
					);

				}
				
				//�������֤��Ϣ������Ѹ���
				else if( D.hasClass(e.target, "J_Request2") ){

					var reqParam = eval('(' + D.attr( e.target, "data-param") + ')');

					e.preventDefault();

					K.jsonp( SNS.sys.Helper.getApiURI('http://jianghu.{serverHost}/json/applyFriend.htm'),
						K.mix( reqParam , {
							type : 0,//�����Ͻӿ�
							groupId : 1,//�����Ͻӿ�
							message : encodeURIComponent(encodeURIComponent(D.get(".J_ReqTxt", popupEl).value))
						} ),
						function(data){
							popup.set("content",data.html);

							if( (data.success == 1) && callback )
								callback();
						}
					);

				}

				//��ͬ����
				else if( D.hasClass(e.target, "J_CommonFriend") ){

					e.preventDefault();

					SNS.widget.Friend.showCommonFriends( D.attr( e.target , "data-userId" ) , e.target );

				}

				//������ʶ���� �Ӻ���
				else if( D.hasClass(e.target, "J_AddFriend") ){

					e.preventDefault();
					
					popup.hide();

					SNS.widget.Friend.addFriend( { friendId: D.attr( e.target , "data-userid" ) , isFork: 1 } , function(){} );

				}

				//�Ƽ��Լ��ĺ��Ѹ��Է�
				else if( D.hasClass(e.target, "J_Recommend") ){

					e.preventDefault();
					
					var checkboxs = D.query("#J_UserList input");

					var ids = "";

					for( var i in checkboxs ){
						if( checkboxs[i].checked == true )
							ids = ids + "," + checkboxs[i].value;
					}

					ids = ids.substr(1);

					//�ж�δ��ѡ���Ƽ�ʱֱ�ӹرո���
					if( ids == "" ){
						popup.hide();
					}

					K.jsonp( SNS.sys.Helper.getApiURI('http://jianghu.{serverHost}/json/commendMyFriend.htm'),
						{
							toUserId:D.attr(e.target,"data-userid"),
							recommendIds:ids
						},
						function(data){
							popup.set("content",data.html);
						}
					);
				}

				//�ύ��֤��
				else if( D.hasClass(e.target, "J_SendCheckCode") ){

					e.preventDefault();

					var param = eval('(' + D.attr( e.target, "data-param") + ')');

					K.mix( param, {
					
						'TPL_checkcode':D.get(".J_CheckCode").value

					} );

					K.jsonp( SNS.sys.Helper.getApiURI('http://jianghu.{serverHost}/json/applyFriend.htm'), param, function(data){
							popup.set( "content" , data.html );
						}
					);
				}

				//��һ�� ��֤��
				else if( D.hasClass(e.target, "J_CheckCodeChange") ){
					e.preventDefault();
					e.halt();
					img = D.get('#J_CheckCodeImg');
					img.src = img.src + "&t=" + new Date().getTime();
				}

				//�رհ�ť
				else if( D.hasClass(e.target, "J_Close") ){
					e.preventDefault();
					popup.hide();
				}
			});
		};

		/*
		 *	���ó�ʼ������
		 */

		init();

	}

	SNS.namespace("SNS.widget.Friend").addFriend = addFriend;


	})();




	/*************************************************************************************/


	(function(){



	/*
	 *	����ͬ���ѡ�
	 *
	 *
	 *	���÷�ʽ��
	 *
	 *	 SNS(function(){
	 *	 
	 *		SNS.widget.Friend.showCommonFriends( userId );
	 *	 
	 *	 },"SNS.widget.Friend");
	 *
	 *	������
	 *		
	 *	userId	�Է�id
	 *
	 */



	/*
	 *	���ع�ͬ��������
	 */
	var loadCommonFriends = function( id , callback ) {
	
		K.jsonp( SNS.sys.Helper.getApiURI('http://jianghu.daily.taobao.net/recommend/common_friends.htm?userId='+id),function(data){
		
			callback(data);

		});

	}


	/*
	 *	��ͬ���ѵ���widget
	 */
	var showCommonFriends = function( id , triggerEl , align ) {

		//ͳ��
		D.create('<img src="http://www.atpanel.com/jsclick?cache='+ Math.ceil( Math.random()*Math.pow(10,7) ) +'&profriend=add" alt=" " />');

		//����
		var popup;

		/* ģ��ƴ�� */
		var combineTemp = function( data ){

			var listTemp = '<a href="{href}" class="pic" title="{name}"><img width="40" height="40" src="{img}"></a>';

			var list = "";

			//�б�ƴ��
			for( var i = 0 ; i<data.list.length; i++ ){

				list = list + K.substitute( listTemp , data.list[i] );

			}

			//����contentƴ��
			var temp = '<div class="friends-list">'+
							list+
						'</div>';

			var content = K.substitute(
						'<div class="hd naked"><h3>������&nbsp;{num}����ͬ����.&nbsp;'+
							( (data.num > 7) ? '<a href="{friendsHref}">�鿴����</a>' : '' )+
						'</p></div><div class="bd">' +
							temp+
						'</div><div class="ft"><a href="#" title="�رմ˴���" class="btn-close J_Close">x</a></div>',data);

			return content;

		};


		/* ��Ⱦ���� */
		var render = function( data ){

			var content = combineTemp( data );

			if( !align ){
				var align = {
						node:triggerEl,
						points:['tc', 'bc'],
						offset:[0,0]
					};
			}

			K.use("overlay",function(){
			
				popup = new K.Overlay({
					width: 236,
					elCls: "common-friends J_CommonFriendsBox",
					content: content,
					zIndex: 10000,
					align:align
				});

				popup.show();
				bindEvent();

			});

		};


		/* ����Ч���¼��� */
		var bindEvent = function(){

			//������뵯��ʱ�����ص���
			E.on( popup.get("contentEl").getDOMNode() , "click" , function(e){
			
				if( D.hasClass( e.target, "J_Close" ) ){

					e.preventDefault();
				
					popup.hide();

				}

			});

			//����Ƴ�����ʱ���ص���
			E.on( document.body , "click" , function(e){
			
				if( !D.contains( popup.get("contentEl").getDOMNode(), e.target ) ){

					e.preventDefault();
				
					popup.hide();
				
				}

			});

		};

		
		
		
		/* ��ʼ������ */
		var init = function(){
		
			K.getScript( SNS.sys.Helper.getApiURI('http://assets.{serverHost}/p/sns/1.1/widget/css/common-friends.css'), function(){}, 'GBK');

			//���ع�ͬ��������
			loadCommonFriends( id , render );

		};


		/*
		 *	��ں���ִ��
		 */

		init();
	
	}

	/*
	 *	���ع�ͬ��������
	 */
	SNS.namespace("SNS.widget.Friend").loadCommonFriends = loadCommonFriends;


	/*
	 *	��ͬ���ѵ���widget
	 */
	SNS.namespace("SNS.widget.Friend").showCommonFriends = showCommonFriends;


	})();


},"SNS.util.Helper,SNS.widget.showLogin");





