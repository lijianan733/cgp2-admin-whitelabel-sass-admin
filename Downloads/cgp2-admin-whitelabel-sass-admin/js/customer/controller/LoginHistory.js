Ext.define("CGP.customer.controller.LoginHistory",{

	historyWindow : null,//保存一个登录历史窗口
	
	openHistoryWindow: function(record){
		var me = this;
		if(Ext.isEmpty(me.historyWindow)){
			me.historyWindow = Ext.create("CGP.customer.view.loginhistory.LoginHistory",{
				record : record,
				controller : me
			});
		}else{
			me.historyWindow.refresh(record);
		}
		me.historyWindow.show();
	}
	
});