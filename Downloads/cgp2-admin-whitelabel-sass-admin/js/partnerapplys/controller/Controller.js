Ext.define('CGP.partnerapplys.controller.Controller', {
    

    /**
     * 回复partnerApplys
     */

    confirmpartnerApplys: function (partnerId, reason,window) {
        Ext.Ajax.request({
            url: adminPath + 'api/admin/partnerApplys/' + partnerId + '/confirm',
            method: 'PUT',
            headers: {       //请求头信息
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: {      //发送的JSON数据. 注意: 使用此参数将取代params参数来发送请求数据. 所有params中的参数将被追加到URL后面.
                remark: reason
            },
            failure: function(response, opts) {   //response : Object包含了响应数据的XMLHttpRequest对象.
            	                                  //options : Object调用request函数时的参数.
				            	Ext.MessageBox.alert(i18n.getKey('requestFailed') + response.data.message);
				      },
            success: function(response, opts) {   //response : Object包含了响应数据的XMLHttpRequest对象.
            	                                  //options : Object调用request函数时的参数.
				            	var res=Ext.decode(response.responseText) ;   
							      if(res.success){   
									         //后台返回true时执行的代码   
									         Ext.MessageBox.alert('提示','审核成功');  
									         window.partnerStore.load();
					                         window.close();  
							      }else{   
							         //后台返回true时执行的代码  
							         Ext.MessageBox.alert('提示', '错误信息：'+res.data.message);
							      } 
				      }
            
        });

    },
    rejectpartnerApplys: function (partnerId, reason,window) {
        Ext.Ajax.request({
            url: adminPath + 'api/admin/partnerApplys/' + partnerId + '/reject',
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: {
               remark: reason
            },
            callback: function () {
                window.partnerStore.load();
                window.close();
            }
        });

    },

})