/**
 *  @description ��¼����
 *  @author ����(mingren@taobao.com) �Ǹ�(qiaofu@taobao.com)
 *  @date 2011.05.09
 *
 *	������ sns.js �� kissy 1.1.6 �� YUI core
 *
 */


SNS('SNS.widget.showLogin', function() {

	var K = KISSY, 
		D = K.DOM, 
		E = K.Event,
		Helper = SNS.sys.Helper;

	var loginPop;

	var showLogin = function( callback ){

		if ( Helper.checkLogin() ){
			
			return 1;
		
		}

		K.getScript('http://assets.daily.taobao.net/p/sns/1.1/widget/css/showLogin.css', function(){}, 'GBK');

		//��¼�ɹ�֮��Ļص���ִ�лص��������رո���
		var loginSuccess = function(){

			if( Helper.checkLogin() ){
		
				callback();
				
				loginPop.hide();
			
			}

		}
	
		var html = '<div class="login-content">'+
					'<iframe onload="SNS.widget.loginSuccess()" id="J_loginiframe"'+
					' width="354" height="263" frameborder="0"'+
					'scrolling="no" src="' + 
					Helper.getApiURI('https://login.{serverHost}/member/login.jhtml?style=mini&is_ignore=false&redirect_url=http://www.taobao.com/go/act/share/loginsuccess.php') + 
					'"></iframe>'+
					'<s class="close-btn">&times;</s>'+
					'</div>';

		setTimeout(function(){

		K.use("overlay",function(){
			loginPop = new K.Overlay({
				width: 404,
				elCls: "popup-login",
				content: html,
				mask: true,
				align: {
					node: null, 
					points: ['cc','cc'],
					offset: [0, 0] 
				}
			});

			loginPop.show();

			popupEl = loginPop.get("contentEl").getDOMNode();

			E.on( D.get( ".close-btn", popupEl ), "click", function(){
			
				loginPop.hide();
			
			} );

		});

		},100);

		
		//ע��SNS.widget.loginSuccess
		SNS.namespace("SNS.widget").loginSuccess = loginSuccess;

		return 0;
	
	};

	SNS.namespace("SNS.widget").showLogin = showLogin;
	

},"SNS.util.Helper");