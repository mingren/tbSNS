SNS("SNS.data.Comment",function(){var a=SNS.sys.Helper;var b=function(c){b.superclass.constructor.call(this,c)};b.DATAS={getCmtBox:{url:"http://comment.jianghu.{serverHost}/json/cc_list.htm?_input_charset=utf-8",dataType:"json"},getCmtList:{url:"http://comment.jianghu.{serverHost}/json/page_list.htm?_input_charset=utf-8",dataType:"json"},postCmt:{url:"http://comment.jianghu.{serverHost}/json/add.htm?action=comment/comment_action&event_submit_do_add=true&_input_charset=utf-8",dataType:"json"},delCmt:{url:"http://comment.jianghu.{serverHost}/json/del_comment.htm?_input_charset=utf-8",dataType:"json"}};SNS.Base.extend(b,SNS.Base);SNS.data.Comment=b},"SNS.Base,SNS.util.Helper");
